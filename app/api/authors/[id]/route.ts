import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import type { AdminUserSession } from "@/types";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const author = await prisma.author.findUnique({
            where: { id: resolvedParams.id },
            include: { image: true },
        });

        if (!author) {
            return NextResponse.json({ error: "Author not found" }, { status: 404 });
        }

        return NextResponse.json(author);
    } catch (error) {
        console.error("GET /api/authors/[id] error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = session.user as AdminUserSession;
        if (user.role !== "SUPER_ADMIN" && user.role !== "ADMIN") {
            return NextResponse.json({ error: "Permission Denied" }, { status: 403 });
        }

        const resolvedParams = await params;
        const data = await req.json();

        const author = await prisma.author.update({
            where: { id: resolvedParams.id },
            data: {
                name: data.name,
                slug: data.slug,
                bio: data.bio || null,
                birthYear: data.birthYear || null,
                deathYear: data.deathYear || null,
                nationality: data.nationality || null,
                isActive: data.isActive,
                imageId: data.imageId || null,
            },
        });

        return NextResponse.json(author);
    } catch (error: any) {
        console.error("PUT /api/authors/[id] error:", error);
        if (error.code === "P2025") {
            return NextResponse.json({ error: "Author not found" }, { status: 404 });
        }
        if (error.code === "P2002") {
            return NextResponse.json({ error: "An author with this slug already exists" }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = session.user as AdminUserSession;
        if (user.role !== "SUPER_ADMIN" && user.role !== "ADMIN") {
            return NextResponse.json({ error: "Permission Denied" }, { status: 403 });
        }

        const resolvedParams = await params;

        // Optional: check if author is assigned to any books or fatawa
        const bookCount = await prisma.book.count({ where: { authorId: resolvedParams.id } });
        const fatwaCount = await prisma.fatwa.count({ where: { authorId: resolvedParams.id } });

        if (bookCount > 0 || fatwaCount > 0) {
            return NextResponse.json(
                { error: `Cannot delete author. Linked to ${bookCount} books and ${fatwaCount} fatawa.` },
                { status: 400 }
            );
        }

        await prisma.author.delete({
            where: { id: resolvedParams.id },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("DELETE /api/authors/[id] error:", error);
        if (error.code === "P2025") {
            return NextResponse.json({ error: "Author not found" }, { status: 404 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
