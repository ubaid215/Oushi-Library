import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import type { AdminUserSession } from "@/types";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const q = searchParams.get("q") || "";
        const activeOnly = searchParams.get("activeOnly") === "true";

        const authors = await prisma.author.findMany({
            where: {
                ...(q && { name: { contains: q, mode: "insensitive" } }),
                ...(activeOnly && { isActive: true }),
            },
            orderBy: { name: "asc" },
            include: { image: true },
        });

        return NextResponse.json(authors);
    } catch (error) {
        console.error("GET /api/authors error:", error);
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

        const author = await prisma.author.create({
            data: {
                name: data.name,
                slug: data.slug,
                bio: data.bio || null,
                birthYear: data.birthYear || null,
                deathYear: data.deathYear || null,
                nationality: data.nationality || null,
                isActive: data.isActive ?? true,
                imageId: data.imageId || null,
            },
        });

        return NextResponse.json(author, { status: 201 });
    } catch (error: any) {
        console.error("POST /api/authors error:", error);
        if (error.code === "P2002") {
            return NextResponse.json({ error: "An author with this slug already exists" }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
