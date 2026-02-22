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
        const category = await prisma.category.findUnique({
            where: { id: resolvedParams.id },
            include: {
                parent: { select: { id: true, name: true } },
            }
        });

        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        return NextResponse.json(category);
    } catch (error) {
        console.error("GET /api/categories/[id] error:", error);
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

        // Prevent circular reference (cannot be its own parent)
        if (resolvedParams.id === data.parentId) {
            return NextResponse.json({ error: "A category cannot be its own parent" }, { status: 400 });
        }

        const category = await prisma.category.update({
            where: { id: resolvedParams.id },
            data: {
                name: data.name,
                slug: data.slug,
                description: data.description || null,
                type: data.type,
                parentId: data.parentId || null,
                order: data.order,
                isActive: data.isActive,
            },
        });

        return NextResponse.json(category);
    } catch (error: any) {
        console.error("PUT /api/categories/[id] error:", error);
        if (error.code === "P2025") {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }
        if (error.code === "P2002") {
            return NextResponse.json({ error: "A category with this slug already exists" }, { status: 400 });
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

        // Check for child categories
        const childrenCount = await prisma.category.count({
            where: { parentId: resolvedParams.id }
        });

        if (childrenCount > 0) {
            return NextResponse.json(
                { error: "Cannot delete category because it has sub-categories. Delete or reassign them first." },
                { status: 400 }
            );
        }

        // Check for linked books or fatawa
        const bookCount = await prisma.book.count({ where: { categoryId: resolvedParams.id } });
        const fatwaCount = await prisma.fatwa.count({ where: { categoryId: resolvedParams.id } });

        if (bookCount > 0 || fatwaCount > 0) {
            return NextResponse.json(
                { error: `Cannot delete category. Linked to ${bookCount} books and ${fatwaCount} fatawa.` },
                { status: 400 }
            );
        }

        await prisma.category.delete({
            where: { id: resolvedParams.id },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("DELETE /api/categories/[id] error:", error);
        if (error.code === "P2025") {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
