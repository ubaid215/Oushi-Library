// app/api/files/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function toDownloadUrl(url: string): string {
  if (url.includes("fl_attachment")) return url;
  return url.replace("/raw/upload/", "/raw/upload/fl_attachment/");
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Missing file ID" }, { status: 400 });
  }

  try {
    const file = await prisma.file.findUnique({ where: { id } });

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const downloadUrl = toDownloadUrl(file.url);

    // Check if client wants JSON (e.g. fetch from JS) or a redirect (direct link)
    const acceptsJson = req.headers.get("accept")?.includes("application/json");

    if (acceptsJson) {
      return NextResponse.json({ url: downloadUrl });
    }

    return NextResponse.redirect(downloadUrl);

  } catch (err) {
    console.error("[file_proxy] error:", err);
    return NextResponse.json({ error: "Failed to fetch file" }, { status: 500 });
  }
}