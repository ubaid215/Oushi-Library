import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, FolderTree } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Categories" };

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { order: "asc" },
    include: {
      children: {
        orderBy: { order: "asc" },
        include: { _count: { select: { books: true, fatawa: true } } },
      },
      _count: { select: { books: true, fatawa: true } },
    },
  });

  const totalCategories = await prisma.category.count();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div className="page-header--with-action page-header">
        <div>
          <p className="page-header__eyebrow">Organization</p>
          <h1 className="page-header__title">Categories</h1>
          <p className="page-header__subtitle">
            Hierarchical category tree for books and fatawa.
          </p>
        </div>
        <Link href="/admin/categories/new" className="btn btn--primary">
          <Plus size={15} /> Add Category
        </Link>
      </div>

      <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap" }}>
        <div className="stat-card" style={{ minWidth: 150 }}>
          <div className="stat-card__label">Total</div>
          <div className="stat-card__value" style={{ fontSize: "var(--text-3xl)" }}>{totalCategories}</div>
          <div className="stat-card__footer"><span className="stat-card__period">All categories</span></div>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="empty-state">
          <FolderTree size={48} style={{ opacity: 0.2, margin: "0 auto var(--space-4)" }} />
          <p className="empty-state__title">No categories yet</p>
          <Link href="/admin/categories/new" className="btn btn--primary btn--sm" style={{ marginTop: "var(--space-4)" }}>
            <Plus size={13} /> Add Category
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          {categories.map((cat) => (
            <div key={cat.id} className="card">
              <div className="card__body">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: cat.children.length > 0 ? "var(--space-4)" : 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "var(--radius-lg)",
                        background: cat.type === "BOOK"
                          ? "var(--color-dusty-100)"
                          : cat.type === "FATWA"
                          ? "var(--color-terracotta-50)"
                          : "var(--color-sage-50)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FolderTree size={16} style={{ color: cat.type === "BOOK" ? "var(--color-dusty-500)" : "var(--color-terracotta-400)" }} />
                    </div>
                    <div>
                      <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-base)", fontWeight: 600, color: "var(--color-text-primary)" }}>
                        {cat.name}
                      </p>
                      <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
                        /{cat.slug} · {cat.type.toLowerCase()}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
                        {cat._count.books} books · {cat._count.fatawa} fatawa
                      </p>
                      <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
                        {cat.children.length} subcategories
                      </p>
                    </div>
                    <span className={`badge ${cat.isActive ? "badge--success" : "badge--default"}`}>
                      {cat.isActive ? "Active" : "Inactive"}
                    </span>
                    <Link href={`/admin/categories/${cat.id}`} className="btn btn--secondary btn--xs">
                      Edit
                    </Link>
                  </div>
                </div>

                {/* Children */}
                {cat.children.length > 0 && (
                  <div
                    style={{
                      paddingLeft: "var(--space-8)",
                      borderLeft: "2px solid var(--color-border-subtle)",
                      marginLeft: "var(--space-4)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--space-2)",
                    }}
                  >
                    {cat.children.map((child) => (
                      <div
                        key={child.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "var(--space-2-5) var(--space-4)",
                          borderRadius: "var(--radius-lg)",
                          background: "var(--color-parchment-50)",
                        }}
                      >
                        <div>
                          <span style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text-primary)" }}>
                            {child.name}
                          </span>
                          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", marginLeft: "var(--space-2)" }}>
                            {child._count.books}b · {child._count.fatawa}f
                          </span>
                        </div>
                        <Link href={`/admin/categories/${child.id}`} className="btn btn--ghost btn--xs">
                          Edit
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
