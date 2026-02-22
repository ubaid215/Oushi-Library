import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import type { AdminUserSession, CategoryType } from "@/types";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type") as CategoryType | null;
        const activeOnly = searchParams.get("activeOnly") === "true";

        const categories = await prisma.category.findMany({
            where: {
                ...(type && {
                    OR: [
                        { type },
                        { type: "BOTH" }
                    ]
                }),
                ...(activeOnly && { isActive: true }),
            },
            orderBy: [
                { parentId: "asc" },
                { order: "asc" },
                { name: "asc" },
            ],
            include: {
                parent: { select: { name: true } }
            }
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.error("GET /api/categories error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = session.user as AdminUserSession;
        if (user.role !== "SUPER_ADMIN" && user.role !== "ADMIN") {
            return NextResponse.json({ error: "Permission Denied" }, { status: 403 });
        }

        const data = await req.json();

        const category = await prisma.category.create({
            data: {
                name: data.name,
                slug: data.slug,
                description: data.description || null,
                type: data.type,
                parentId: data.parentId || null,
                order: data.order || 0,
                isActive: data.isActive ?? true,
            },
        });

        return NextResponse.json(category, { status: 201 });
    } catch (error: any) {
        console.error("POST /api/categories error:", error);
        if (error.code === "P2002") {
            return NextResponse.json({ error: "A category with this slug already exists" }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
