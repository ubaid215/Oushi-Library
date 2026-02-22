import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createSlug } from "@/lib/utils";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const fatwa = await prisma.fatwa.findUnique({
        where: { id },
        include: {
            author: true,
            category: true,
            pdfFile: true,
            tags: { include: { tag: true } },
        },
    });

    if (!fatwa) {
        return NextResponse.json({ error: "Fatwa not found" }, { status: 404 });
    }

    return NextResponse.json(fatwa);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    try {
        const body = await req.json();
        const { tagIds, seoKeywords, ...rest } = body;

        if (rest.categoryId === "") {
            rest.categoryId = null;
        }

        // Handle slug
        if (!rest.slug && rest.title) {
            rest.slug = createSlug(rest.title);
        }

        // Check slug collision (excluding self)
        if (rest.slug) {
            const existing = await prisma.fatwa.findFirst({
                where: { slug: rest.slug, NOT: { id } },
            });
            if (existing) {
                return NextResponse.json({ error: `Slug "${rest.slug}" already taken` }, { status: 409 });
            }
        }

        // Update tags: delete old, insert new
        if (tagIds !== undefined) {
            await prisma.fatwaTag.deleteMany({ where: { fatwaId: id } });
            if (tagIds.length > 0) {
                await prisma.fatwaTag.createMany({
                    data: tagIds.map((tagId: string) => ({ fatwaId: id, tagId })),
                });
            }
        }

        const updated = await prisma.fatwa.update({
            where: { id },
            data: {
                ...rest,
                seoKeywords: seoKeywords || [],
                publishedAt:
                    rest.isPublished && !rest.publishedAt ? new Date() : rest.publishedAt,
            },
        });

        return NextResponse.json(updated);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to update fatwa" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    try {
        await prisma.fatwa.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: "Failed to delete fatwa" }, { status: 500 });
    }
}
