import { spawn } from "child_process";
import { writeFile, readFile, unlink, mkdtemp } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";

export interface CompressionResult {
  buffer: Buffer;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number; // e.g. 0.72 means 28% smaller
  strategy: string;
}

export interface CompressionOptions {
  targetSizeBytes?: number;       // default: 10MB
  maxInputSizeBytes?: number;     // default: 35MB
  timeoutMs?: number;             // default: 120_000 (2 min)
}

// Ghostscript PDF settings profiles, from lightest to most aggressive
const GS_PROFILES = [
  { name: "ebook",    dpi: 150, setting: "/ebook"    },
  { name: "low-dpi",  dpi: 96,  setting: "/ebook"    },
  { name: "screen",   dpi: 72,  setting: "/screen"   },
  { name: "minimum",  dpi: 72,  setting: "/screen", extra: [
    "-dColorImageResolution=60",
    "-dGrayImageResolution=60",
    "-dMonoImageResolution=72",
  ]},
] as const;

const DEFAULT_TARGET  = 10 * 1024 * 1024; // 10 MB
const DEFAULT_MAX_IN  = 35 * 1024 * 1024; // 35 MB
const DEFAULT_TIMEOUT = 120_000;           // 2 min

// ─── Main entry point ────────────────────────────────────────────────────────

export async function compressPdf(
  input: Buffer,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const {
    targetSizeBytes  = DEFAULT_TARGET,
    maxInputSizeBytes = DEFAULT_MAX_IN,
    timeoutMs        = DEFAULT_TIMEOUT,
  } = options;

  const originalSize = input.length;

  if (originalSize > maxInputSizeBytes) {
    throw new Error(
      `PDF too large: ${formatMb(originalSize)}. Maximum allowed: ${formatMb(maxInputSizeBytes)}.`
    );
  }

  // If already under target, skip compression entirely
  if (originalSize <= targetSizeBytes) {
    return {
      buffer: input,
      originalSize,
      compressedSize: originalSize,
      compressionRatio: 0,
      strategy: "none (already within target)",
    };
  }

  const gsAvailable = await isGhostscriptAvailable();

  if (gsAvailable) {
    return compressWithGhostscript(input, { targetSizeBytes, timeoutMs });
  }

  // Fallback: pdf-lib metadata stripping (mild compression only)
  return compressWithPdfLib(input, targetSizeBytes);
}

// ─── Ghostscript compression ──────────────────────────────────────────────────

async function compressWithGhostscript(
  input: Buffer,
  { targetSizeBytes, timeoutMs }: Required<Pick<CompressionOptions, "targetSizeBytes" | "timeoutMs">>
): Promise<CompressionResult> {
  const originalSize = input.length;
  const workDir = await mkdtemp(join(tmpdir(), "pdf-compress-"));
  const inputPath  = join(workDir, "input.pdf");
  const outputPath = join(workDir, "output.pdf");

  await writeFile(inputPath, input);

  let lastResult: { buffer: Buffer; strategy: string } | null = null;
  let lastError: Error | null = null;

  for (const profile of GS_PROFILES) {
    try {
      await runGhostscript(inputPath, outputPath, profile, timeoutMs);
      const compressed = await readFile(outputPath);

      lastResult = { buffer: compressed, strategy: `ghostscript/${profile.name}` };

      if (compressed.length <= targetSizeBytes) {
        // Hit target — done
        await cleanupFiles(workDir, inputPath, outputPath);
        return buildResult(input, compressed, originalSize, `ghostscript/${profile.name}`);
      }

      // Not small enough yet — continue to next profile
    } catch (err) {
      lastError = err as Error;
      // If one profile fails, try the next
    }
  }

  await cleanupFiles(workDir, inputPath, outputPath);

  // All profiles tried — return best result we got, even if over target
  if (lastResult) {
    const compressedSize = lastResult.buffer.length;
    if (compressedSize >= originalSize) {
      throw new Error(
        `Compression made no progress. The PDF may contain mostly scanned images or encrypted content.`
      );
    }
    // Return it with a warning flag via the strategy string
    return buildResult(
      input,
      lastResult.buffer,
      originalSize,
      `${lastResult.strategy} (target not met — best effort)`
    );
  }

  throw new Error(
    `Ghostscript compression failed for all profiles. Last error: ${lastError?.message ?? "unknown"}`
  );
}

function runGhostscript(
  inputPath: string,
  outputPath: string,
  profile: (typeof GS_PROFILES)[number],
  timeoutMs: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    const args = [
      "-sDEVICE=pdfwrite",
      "-dNOPAUSE",
      "-dBATCH",
      "-dSAFER",
      `-dPDFSETTINGS=${profile.setting}`,
      `-dCompatibilityLevel=1.5`,
      "-dDetectDuplicateImages=true",
      "-dCompressFonts=true",
      "-dSubsetFonts=true",
      `-dColorImageDPI=${profile.dpi}`,
      `-dGrayImageDPI=${profile.dpi}`,
      `-dMonoImageDPI=${profile.dpi}`,
      ...("extra" in profile ? profile.extra : []),
      `-sOutputFile=${outputPath}`,
      inputPath,
    ];

    const gs = spawn("gs", args, { stdio: ["ignore", "pipe", "pipe"] });

    const timer = setTimeout(() => {
      gs.kill("SIGKILL");
      reject(new Error(`Ghostscript timed out after ${timeoutMs / 1000}s (profile: ${profile.name})`));
    }, timeoutMs);

    let stderr = "";
    gs.stderr.on("data", (d: Buffer) => { stderr += d.toString(); });

    gs.on("close", (code) => {
      clearTimeout(timer);
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Ghostscript exited with code ${code}: ${stderr.slice(-500)}`));
      }
    });

    gs.on("error", (err) => {
      clearTimeout(timer);
      reject(new Error(`Failed to spawn Ghostscript: ${err.message}`));
    });
  });
}

// ─── pdf-lib fallback (strips metadata/annotations, mild size reduction) ──────

async function compressWithPdfLib(
  input: Buffer,
  targetSizeBytes: number
): Promise<CompressionResult> {
  let PDFDocument: typeof import("pdf-lib").PDFDocument;
  try {
    ({ PDFDocument } = await import("pdf-lib"));
  } catch {
    throw new Error(
      "Neither Ghostscript nor pdf-lib is available. " +
      "Install Ghostscript (`apt-get install ghostscript`) for proper compression."
    );
  }

  const pdfDoc = await PDFDocument.load(input, { ignoreEncryption: true });

  // Strip XMP metadata and info dict to shave a little size
  pdfDoc.setTitle("");
  pdfDoc.setAuthor("");
  pdfDoc.setSubject("");
  pdfDoc.setKeywords([]);
  pdfDoc.setProducer("");
  pdfDoc.setCreator("");

  const compressed = Buffer.from(
    await pdfDoc.save({ useObjectStreams: true, addDefaultPage: false })
  );

  if (compressed.length > targetSizeBytes) {
    // pdf-lib can't do image resampling — warn clearly
    throw new Error(
      `pdf-lib fallback reduced size from ${formatMb(input.length)} → ${formatMb(compressed.length)}, ` +
      `but target of ${formatMb(targetSizeBytes)} was not met. ` +
      `Install Ghostscript for full compression support.`
    );
  }

  return buildResult(input, compressed, input.length, "pdf-lib/metadata-strip");
}

// ─── Utilities ────────────────────────────────────────────────────────────────

async function isGhostscriptAvailable(): Promise<boolean> {
  return new Promise((resolve) => {
    const gs = spawn("gs", ["--version"], { stdio: "ignore" });
    gs.on("close", (code) => resolve(code === 0));
    gs.on("error", () => resolve(false));
  });
}

function buildResult(
  original: Buffer,
  compressed: Buffer,
  originalSize: number,
  strategy: string
): CompressionResult {
  const compressedSize = compressed.length;
  return {
    buffer: compressed,
    originalSize,
    compressedSize,
    compressionRatio: parseFloat(((originalSize - compressedSize) / originalSize).toFixed(4)),
    strategy,
  };
}

async function cleanupFiles(...paths: string[]): Promise<void> {
  await Promise.allSettled(paths.map((p) => unlink(p).catch(() => {})));
}

export function formatMb(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}