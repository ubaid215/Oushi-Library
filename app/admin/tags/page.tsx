import { prisma } from "@/lib/prisma";
import TagsManager from "@/components/admin/TagsManager";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Tags" };

export default async function TagsPage() {
  const tags = await prisma.tag.findMany({
    orderBy: { count: "desc" },
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div className="page-header">
        <p className="page-header__eyebrow">Taxonomy</p>
        <h1 className="page-header__title">Tags</h1>
        <p className="page-header__subtitle">
          Create and manage tags to organize your content.
        </p>
      </div>
      <TagsManager initialTags={tags} />
    </div>
  );
}
