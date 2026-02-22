import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import FatwaForm from "@/components/admin/FatwaForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Fatwa" };

export default async function EditFatwaPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    // 1. Fetch the fatwa and its relations
    const fatwa = await prisma.fatwa.findUnique({
        where: { slug },
        include: {
            tags: { include: { tag: true } },
        },
    });

    if (!fatwa) {
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
            where: { isActive: true, type: { in: ["FATWA", "BOTH"] } },
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
        ...fatwa,
        seoTitle: fatwa.seoTitle ?? undefined,
        seoDescription: fatwa.seoDescription ?? undefined,
        categoryId: fatwa.categoryId ?? "", // Use empty string for empty selects
        tagIds: fatwa.tags.map((ft) => ft.tag.id),
    };

    return (
        <div>
            <div className="page-header">
                <p className="page-header__eyebrow">Fatawa</p>
                <h1 className="page-header__title">Edit Fatwa</h1>
                <p className="page-header__subtitle">Edit the details of this fatwa.</p>
            </div>
            <FatwaForm
                mode="edit"
                initialData={initialData}
                authors={authors}
                categories={categories}
                tags={tags}
            />
        </div>
    );
}
