import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { compressAndUploadPdf, uploadImage } from "@/lib/cloudinary";

export const maxDuration = 120; // Allow up to 120 seconds for Vercel

const PDF_MAX_BYTES = 35 * 1024 * 1024; //  35 MB
const IMAGE_MAX_BYTES = 5 * 1024 * 1024; //   5 MB

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const mimeType = file.type;
    const originalName = file.name;

    // ── Validate file size BEFORE buffering (uses File.size metadata) ────────
    if (type === "pdf" && file.size > PDF_MAX_BYTES) {
      return NextResponse.json(
        { error: `File too large (${formatMb(file.size)}). Maximum is 35MB.` },
        { status: 400 }
      );
    }
    if (type === "image" && file.size > IMAGE_MAX_BYTES) {
      return NextResponse.json(
        { error: `Image too large (${formatMb(file.size)}). Maximum is 5MB.` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ── PDF ──────────────────────────────────────────────────────────────────
    if (type === "pdf") {
      if (!mimeType.includes("pdf")) {
        return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
      }

      const result = await compressAndUploadPdf(buffer, originalName, "pdfs");

      const fileRecord = await prisma.file.create({
        data: {
          filename: result.publicId.split("/").pop() ?? originalName,
          originalName,
          url: result.url,
          publicId: result.publicId,
          mimeType: "application/pdf",
          size: result.size,
          compressedSize: result.compressedSize,
          storage: "CLOUDINARY",
          isPublic: true,
        },
      });

      return NextResponse.json({
        fileId: fileRecord.id,
        url: result.url,
        publicId: result.publicId,
        size: result.size,
        compressedSize: result.compressedSize,
        compressionRatio: result.compressionRatio,
        strategy: result.strategy,
        targetMet: result.targetMet,
      });
    }

    // ── Image ────────────────────────────────────────────────────────────────
    if (type === "image") {
      if (!mimeType.startsWith("image/")) {
        return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
      }

      const result = await uploadImage(buffer, originalName, "covers");

      const fileRecord = await prisma.file.create({
        data: {
          filename: result.publicId.split("/").pop() ?? originalName,
          originalName,
          url: result.url,
          publicId: result.publicId,
          mimeType,
          size: buffer.length,
          compressedSize: result.size,
          storage: "CLOUDINARY",
          isPublic: true,
        },
      });

      return NextResponse.json({
        fileId: fileRecord.id,
        url: result.url,
        publicId: result.publicId,
        size: buffer.length,
        compressedSize: result.size,
      });
    }

    return NextResponse.json({ error: "Invalid type. Expected 'pdf' or 'image'." }, { status: 400 });

  } catch (err) {
    console.error("[upload] error:", err);
    const message = err instanceof Error ? err.message || "Upload failed" : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function formatMb(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}