import { prisma } from "@/lib/prisma";
import BookForm from "@/components/admin/BookForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Add Book" };

export default async function NewBookPage() {
  const [authors, categories, tags] = await Promise.all([
    prisma.author.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.category.findMany({
      where: { isActive: true, type: { in: ["BOOK", "BOTH"] } },
      orderBy: { name: "asc" },
      select: { id: true, name: true, parentId: true },
    }),
    prisma.tag.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <div>
      <div className="page-header">
        <p className="page-header__eyebrow">Books</p>
        <h1 className="page-header__title">Add New Book</h1>
        <p className="page-header__subtitle">
          Upload a PDF book with cover image, metadata, and SEO details.
        </p>
      </div>
      <BookForm
        mode="create"
        authors={authors}
        categories={categories}
        tags={tags}
      />
    </div>
  );
}
