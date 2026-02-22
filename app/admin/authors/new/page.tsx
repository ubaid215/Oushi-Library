import AuthorForm from "@/components/admin/AuthorForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Add Author" };

export default function NewAuthorPage() {
    return (
        <div>
            <div className="page-header flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <p className="page-header__eyebrow">Directory</p>
                    <h1 className="page-header__title">Add New Author</h1>
                    <p className="page-header__subtitle">
                        Create a profile for a Mufti, Scholar, or Author to associate with books and fatawa.
                    </p>
                </div>
            </div>
            <AuthorForm mode="create" />
        </div>
    );
}
