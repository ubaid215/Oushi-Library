import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createSlug } from "@/lib/utils";
import type { BookFormData } from "@/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "";
  const skip = (page - 1) * limit;

  const where = {
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" as const } },
        { author: { name: { contains: search, mode: "insensitive" as const } } },
      ],
    }),
    ...(status && { status: status as any }),
  };

  const [data, total] = await Promise.all([
    prisma.book.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { name: true } },
        category: { select: { name: true } },
        coverImage: { select: { url: true } },
        pdfFile: { select: { url: true, compressedSize: true, size: true } },
        tags: { include: { tag: true } },
      },
    }),
    prisma.book.count({ where }),
  ]);

  return NextResponse.json({
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: BookFormData = await req.json();
    const { tagIds, ...rest } = body;

    if (rest.categoryId === "") {
      (rest as any).categoryId = null;
    }

    const slug = rest.slug || createSlug(rest.title);

    // Check slug uniqueness
    const existing = await prisma.book.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: `Slug "${slug}" already exists. Choose a different title or slug.` },
        { status: 409 }
      );
    }

    const book = await prisma.book.create({
      data: {
        ...rest,
        slug,
        publishedAt: rest.isPublished ? new Date() : null,
        tags: tagIds?.length
          ? {
            create: tagIds.map((tagId) => ({ tagId })),
          }
          : undefined,
      },
    });

    // Update tag counts
    if (tagIds?.length) {
      await prisma.tag.updateMany({
        where: { id: { in: tagIds } },
        data: { count: { increment: 1 } },
      });
    }

    return NextResponse.json(book, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create book" }, { status: 500 });
  }
}
