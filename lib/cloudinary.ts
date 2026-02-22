import { v2 as cloudinary } from "cloudinary";
import { PDFDocument } from "pdf-lib";
import { compressWithStirling, isStirlingAvailable } from "./stirling-compressor";
import type { UploadResult, CompressedPdfResult } from "@/types";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  timeout: 120000,
});

export { cloudinary };

// ── Constants ────────────────────────────────────────────────────────────────
const MAX_UPLOAD_BYTES = 9.5 * 1024 * 1024; // 9.5MB — Cloudinary free tier safe limit
const MAX_INPUT_BYTES = 35 * 1024 * 1024; // 35MB  — max we accept before compression

// ── pdf-lib fallback (metadata strip only) ───────────────────────────────────
// Used when Stirling PDF is unavailable. Gives minor size reduction only —
// not suitable for image-heavy PDFs but prevents a hard crash.
async function compressWithPdfLib(buffer: Buffer): Promise<CompressedPdfResult> {
  const originalSize = buffer.length;

  try {
    const pdfDoc = await PDFDocument.load(buffer, {
      ignoreEncryption: true,
      throwOnInvalidObject: false,
      updateMetadata: false,
    });

    pdfDoc.setTitle("");
    pdfDoc.setAuthor("");
    pdfDoc.setSubject("");
    pdfDoc.setKeywords([]);
    pdfDoc.setProducer("Bibliotheca");
    pdfDoc.setCreator("Bibliotheca Admin");

    const bytes = await pdfDoc.save({ useObjectStreams: true, addDefaultPage: false, objectsPerTick: 50 });
    const result = Buffer.from(bytes);
    const ratio = ((originalSize - result.length) / originalSize) * 100;

    return {
      buffer: result,
      originalSize,
      compressedSize: result.length,
      ratio: Math.round(ratio * 10) / 10,
      strategy: "pdf-lib/metadata-strip",
    };
  } catch {
    return {
      buffer,
      originalSize,
      compressedSize: originalSize,
      ratio: 0,
      strategy: "none (pdf-lib failed)",
    };
  }
}

// ── Main compressPdf (Stirling → pdf-lib fallback) ───────────────────────────
export async function compressPdf(
  buffer: Buffer,
  filename: string
): Promise<CompressedPdfResult> {
  if (await isStirlingAvailable()) {
    return compressWithStirling(buffer, filename);
  }

  // Stirling is down or not configured — warn and fall back
  const stirlingUrl = process.env.STIRLING_PDF_URL;
  if (!stirlingUrl) {
    console.warn(
      "[pdf-compress] STIRLING_PDF_URL not set — falling back to pdf-lib (limited compression). " +
      "Deploy Stirling PDF and set the env var for proper compression."
    );
  } else {
    console.warn(
      `[pdf-compress] Stirling PDF at ${stirlingUrl} is unreachable — falling back to pdf-lib.`
    );
  }

  return compressWithPdfLib(buffer);
}

// ── Upload to Cloudinary ─────────────────────────────────────────────────────
import { Readable } from "stream";

export async function uploadToCloudinary(
  buffer: Buffer,
  options: {
    folder: string;
    filename: string;
    resourceType?: "raw" | "image" | "auto";
    mimeType?: string;
  }
): Promise<{ url: string; publicId: string; size: number }> {
  const { folder, filename, resourceType = "raw" } = options;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_chunked_stream(
      {
        folder: `bibliotheca/${folder}`,
        public_id: filename,
        resource_type: resourceType,
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        chunk_size: 12000000,
        timeout: 120000, // 120 seconds upload timeout
        ...(resourceType === "raw" && { format: "pdf" }),
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Upload failed"));
          return;
        }
        resolve({ url: result.secure_url, publicId: result.public_id, size: result.bytes });
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
}

// ── Delete from Cloudinary ───────────────────────────────────────────────────
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: "raw" | "image" = "raw"
): Promise<void> {
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}

// ── Combined: Compress + Upload PDF ─────────────────────────────────────────
export async function compressAndUploadPdf(
  buffer: Buffer,
  filename: string,
  folder: string = "pdfs"
): Promise<UploadResult & { compressionRatio: number; strategy: string; targetMet: boolean }> {
  const originalSize = buffer.length;

  const safeName = filename
    .replace(/\\.pdf$/i, "")
    .replace(/[^a-z0-9-_]/gi, "_")
    .slice(0, 80);

  const { url, publicId } = await uploadToCloudinary(buffer, {
    folder,
    filename: safeName,
    resourceType: "raw",
  });

  return {
    fileId: publicId,
    url,
    publicId,
    size: originalSize,
    compressedSize: originalSize,
    compressionRatio: 0,
    strategy: "none (compression bypassed)",
    targetMet: true,
  };
}

// ── Upload Image ─────────────────────────────────────────────────────────────
export async function uploadImage(
  buffer: Buffer,
  filename: string,
  folder: string = "images"
): Promise<{ url: string; publicId: string; size: number }> {
  const safeName = filename
    .replace(/\.(jpg|jpeg|png|webp|avif)$/i, "")
    .replace(/[^a-z0-9-_]/gi, "_")
    .slice(0, 80);

  return uploadToCloudinary(buffer, {
    folder,
    filename: safeName,
    resourceType: "image",
  });
}

// ── File size formatter ──────────────────────────────────────────────────────
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}