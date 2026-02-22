import { prisma } from "@/lib/prisma";
import FatwaForm from "@/components/admin/FatwaForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Add Fatwa" };

export default async function NewFatwaPage() {
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

    return (
        <div>
            <div className="page-header">
                <p className="page-header__eyebrow">Fatawa</p>
                <h1 className="page-header__title">Add New Fatwa</h1>
                <p className="page-header__subtitle">
                    Publish a new Islamic ruling with complete question, answer, and metadata.
                </p>
            </div>
            <FatwaForm
                mode="create"
                authors={authors}
                categories={categories}
                tags={tags}
            />
        </div>
    );
}
