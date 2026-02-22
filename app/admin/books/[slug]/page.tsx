import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BookForm from "@/components/admin/BookForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Book" };

export default async function EditBookPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    // 1. Fetch the book and its relations
    const book = await prisma.book.findUnique({
        where: { slug },
        include: {
            tags: { include: { tag: true } },
        },
    });

    if (!book) {
        notFound();
    }

    // 2. Fetch the metadata needed for the form options
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

    // 3. Format the data to pass to the form as initialData
    const initialData = {
        ...book,
        description: book.description ?? undefined,
        isbn: book.isbn ?? undefined,
        publisher: book.publisher ?? undefined,
        edition: book.edition ?? undefined,
        categoryId: book.categoryId ?? "", // Use empty string for empty selects
        tagIds: book.tags.map((bt) => bt.tag.id),
        pdfFileId: book.pdfFileId ?? "",
        coverImageId: book.coverImageId ?? "",
    };

    return (
        <div>
            <div className="page-header">
                <p className="page-header__eyebrow">Books</p>
                <h1 className="page-header__title">Edit Book</h1>
                <p className="page-header__subtitle">Edit the details of this book.</p>
            </div>
            <BookForm
                mode="edit"
                initialData={initialData}
                authors={authors}
                categories={categories}
                tags={tags}
            />
        </div>
    );
}
