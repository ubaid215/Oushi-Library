import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    if (!id) {
        return NextResponse.json({ error: "Missing file ID" }, { status: 400 });
    }

    try {
        const file = await prisma.file.findUnique({
            where: { id },
        });

        if (!file) {
            return NextResponse.json({ error: "File not found" }, { status: 404 });
        }

        // Redirect to the Cloudinary URL
        return NextResponse.redirect(file.url);
    } catch (err) {
        console.error("[file_proxy] error:", err);
        return NextResponse.json({ error: "Failed to fetch file" }, { status: 500 });
    }
}
