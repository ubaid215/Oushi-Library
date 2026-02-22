/**
 * Stirling PDF compression client.
 *
 * Stirling PDF exposes a REST API. We use the /api/v1/compress-pdf endpoint
 * which internally runs Ghostscript — same quality you'd get locally, but
 * hosted on your own Docker container (Railway / Render / VPS / local).
 *
 * Docs: https://stirlingpdf.io/api-docs
 *
 * Required env var:
 *   STIRLING_PDF_URL=https://your-stirling-instance.up.railway.app
 *
 * Optional env var (if you enable authentication in Stirling):
 *   STIRLING_PDF_API_KEY=your-api-key
 */

export interface StirlingCompressionResult {
  buffer: Buffer;
  originalSize: number;
  compressedSize: number;
  ratio: number;   // percentage saved e.g. 68.4
  strategy: string;
}

// Compression levels Stirling exposes (maps to Ghostscript profiles internally)
// Lower number = more aggressive compression
// 1 → /screen  (72 dpi  — smallest file, lowest quality)
// 2 → /ebook   (150 dpi — good balance, recommended default)
// 3 → /printer (300 dpi — high quality, less compression)
const COMPRESSION_LEVELS = [2, 1] as const; // try balanced first, then aggressive

const MAX_UPLOAD_BYTES = 9.5 * 1024 * 1024;
const REQUEST_TIMEOUT = 5 * 60 * 1000; // 5 min — large PDFs take time

function getStirlingUrl(): string {
  const url = process.env.STIRLING_PDF_URL;
  if (!url) {
    throw new Error(
      "STIRLING_PDF_URL is not set. " +
      "Add it to your .env: STIRLING_PDF_URL=https://your-stirling-instance.up.railway.app"
    );
  }
  return url.replace(/\/$/, ""); // strip trailing slash
}

// ── Single compression attempt at a given level ──────────────────────────────
async function compressAtLevel(
  buffer: Buffer,
  filename: string,
  compressionLevel: number
): Promise<Buffer> {
  const baseUrl = getStirlingUrl();

  const form = new FormData();
  form.append(
    "fileInput",
    new Blob([new Uint8Array(buffer)], { type: "application/pdf" }),
    filename
  );
  form.append("optimizeLevel", String(compressionLevel));

  const headers: Record<string, string> = {};
  if (process.env.STIRLING_PDF_API_KEY) {
    headers["X-API-Key"] = process.env.STIRLING_PDF_API_KEY;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  let response: Response;
  try {
    response = await fetch(`${baseUrl}/api/v1/compress-pdf`, {
      method: "POST",
      headers,
      body: form,
      signal: controller.signal,
    });
  } catch (err) {
    const msg = (err as Error).message;
    if (msg.includes("abort") || msg.includes("signal")) {
      throw new Error(`Stirling PDF request timed out after ${REQUEST_TIMEOUT / 1000}s`);
    }
    throw new Error(`Stirling PDF unreachable: ${msg}`);
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `Stirling PDF returned ${response.status}: ${body.slice(0, 200)}`
    );
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

// ── Main: try compression levels until target is met ─────────────────────────
export async function compressWithStirling(
  buffer: Buffer,
  filename: string
): Promise<StirlingCompressionResult> {
  const originalSize = buffer.length;

  // Already under limit — skip compression entirely
  if (originalSize <= MAX_UPLOAD_BYTES) {
    return {
      buffer,
      originalSize,
      compressedSize: originalSize,
      ratio: 0,
      strategy: "none (already within limit)",
    };
  }

  let bestBuffer: Buffer | null = null;
  let bestLevel: number = COMPRESSION_LEVELS[0];
  let lastError: Error | null = null;

  for (const level of COMPRESSION_LEVELS) {
    try {
      console.log(`[stirling] Trying compression level ${level} on ${filename}...`);
      const compressed = await compressAtLevel(buffer, filename, level);

      // Track the best result regardless of whether target is met
      if (!bestBuffer || compressed.length < bestBuffer.length) {
        bestBuffer = compressed;
        bestLevel = level;
      }

      if (compressed.length <= MAX_UPLOAD_BYTES) {
        break; // Target met — stop here
      }

      console.warn(
        `[stirling] Level ${level}: ${formatMb(compressed.length)} — still over limit, trying next level...`
      );
    } catch (err) {
      lastError = err as Error;
      console.warn(`[stirling] Level ${level} failed: ${lastError.message}`);
    }
  }

  if (!bestBuffer) {
    throw new Error(
      `Stirling PDF compression failed for all levels. Last error: ${lastError?.message ?? "unknown"}`
    );
  }

  const compressedSize = bestBuffer.length;
  const ratio = ((originalSize - compressedSize) / originalSize) * 100;
  const levelName = bestLevel === 1 ? "screen/aggressive" : "ebook/balanced";

  return {
    buffer: bestBuffer,
    originalSize,
    compressedSize,
    ratio: Math.round(ratio * 10) / 10,
    strategy: `stirling/${levelName}`,
  };
}

// ── Health check (call on startup or before first upload) ────────────────────
export async function isStirlingAvailable(): Promise<boolean> {
  try {
    const url = getStirlingUrl();
    const res = await fetch(`${url}/api/v1/info/status`, {
      signal: AbortSignal.timeout(5000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

function formatMb(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}