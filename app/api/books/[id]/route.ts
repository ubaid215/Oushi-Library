import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createSlug } from "@/lib/utils";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = await prisma.book.findUnique({
    where: { id },
    include: {
      author: true,
      category: true,
      coverImage: true,
      pdfFile: true,
      tags: { include: { tag: true } },
    },
  });

  if (!book) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }

  return NextResponse.json(book);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const { tagIds, ...rest } = body;

    if (rest.categoryId === "") {
      rest.categoryId = null;
    }

    // Handle slug
    if (!rest.slug && rest.title) {
      rest.slug = createSlug(rest.title);
    }

    // Check slug collision (excluding self)
    if (rest.slug) {
      const existing = await prisma.book.findFirst({
        where: { slug: rest.slug, NOT: { id } },
      });
      if (existing) {
        return NextResponse.json({ error: `Slug "${rest.slug}" already taken` }, { status: 409 });
      }
    }

    // Update tags: delete old, insert new
    if (tagIds !== undefined) {
      await prisma.bookTag.deleteMany({ where: { bookId: id } });
      if (tagIds.length > 0) {
        await prisma.bookTag.createMany({
          data: tagIds.map((tagId: string) => ({ bookId: id, tagId })),
        });
      }
    }

    const updated = await prisma.book.update({
      where: { id },
      data: {
        ...rest,
        publishedAt:
          rest.isPublished && !rest.publishedAt ? new Date() : rest.publishedAt,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update book" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.book.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete book" }, { status: 500 });
  }
}
