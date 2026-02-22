import { prisma } from "@/lib/prisma";
import CategoryForm from "@/components/admin/CategoryForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Add Category" };

export default async function NewCategoryPage() {
    const categories = await prisma.category.findMany({
        where: { isActive: true },
        select: { id: true, name: true, type: true, parentId: true },
        orderBy: { name: "asc" },
    });

    return (
        <div>
            <div className="page-header flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <p className="page-header__eyebrow">Taxonomy</p>
                    <h1 className="page-header__title">Add New Category</h1>
                    <p className="page-header__subtitle">
                        Create hierarchies for organizing the Library and Fatawa collections.
                    </p>
                </div>
            </div>
            <CategoryForm mode="create" categories={categories as any} />
        </div>
    );
}
