import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Users } from "lucide-react";
import { formatDate, timeAgo } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Authors" };

interface AuthorsPageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

const LIMIT = 20;

export default async function AuthorsPage({ searchParams }: AuthorsPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1"));
  const search = params.search ?? "";
  const skip = (page - 1) * LIMIT;

  const where = search
    ? { name: { contains: search, mode: "insensitive" as const } }
    : {};

  const [authors, total] = await Promise.all([
    prisma.author.findMany({
      where,
      skip,
      take: LIMIT,
      orderBy: { name: "asc" },
      include: {
        image: { select: { url: true } },
        _count: { select: { books: true, fatawa: true } },
      },
    }),
    prisma.author.count({ where }),
  ]);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div className="page-header--with-action page-header">
        <div>
          <p className="page-header__eyebrow">People</p>
          <h1 className="page-header__title">Authors</h1>
          <p className="page-header__subtitle">Manage scholars and authors in your library.</p>
        </div>
        <Link href="/admin/authors/new" className="btn btn--primary">
          <Plus size={15} /> Add Author
        </Link>
      </div>

      {/* Search */}
      <div className="filter-bar flex-wrap sm:flex-nowrap">
        <form method="GET" className="flex flex-col sm:flex-row gap-3 flex-1">
          <input
            name="search"
            defaultValue={search}
            placeholder="Search authors..."
            className="input input--sm"
            style={{ maxWidth: 320 }}
          />
          <button type="submit" className="btn btn--secondary btn--sm">Search</button>
          {search && <Link href="/admin/authors" className="btn btn--ghost btn--sm">Clear</Link>}
        </form>
        <span className="sort-bar__info"><strong>{total}</strong> authors</span>
      </div>

      {/* Grid */}
      {authors.length === 0 ? (
        <div className="empty-state">
          <Users size={48} style={{ opacity: 0.2, margin: "0 auto var(--space-4)" }} />
          <p className="empty-state__title">No authors yet</p>
          <p className="empty-state__body">Add your first author to get started.</p>
          <Link href="/admin/authors/new" className="btn btn--primary btn--sm" style={{ marginTop: "var(--space-4)" }}>
            <Plus size={13} /> Add Author
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {authors.map((author) => (
            <Link key={author.id} href={`/admin/authors/${author.id}`} style={{ textDecoration: "none" }}>
              <div className="card card--interactive">
                <div className="card__body">
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
                    <div
                      className="avatar avatar--lg"
                      style={{
                        background: author.image?.url
                          ? "transparent"
                          : "linear-gradient(135deg, var(--color-dusty-200), var(--color-dusty-400))",
                        flexShrink: 0,
                      }}
                    >
                      {author.image?.url ? (
                        <img src={author.image.url} alt={author.name} />
                      ) : (
                        <span style={{ fontSize: "var(--text-lg)", color: "white", fontFamily: "var(--font-display)" }}>
                          {author.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-base)", fontWeight: 600, color: "var(--color-text-primary)" }}>
                        {author.name}
                      </p>
                      {author.nationality && (
                        <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
                          {author.nationality}
                          {author.birthYear && ` · ${author.birthYear}${author.deathYear ? `–${author.deathYear}` : ""}`}
                        </p>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "var(--space-4)", marginTop: "var(--space-5)", paddingTop: "var(--space-4)", borderTop: "1px solid var(--color-border-subtle)" }}>
                    <div style={{ textAlign: "center" }}>
                      <p style={{ fontSize: "var(--text-xl)", fontWeight: 700, color: "var(--color-dusty-600)", fontFamily: "var(--font-display)" }}>
                        {author._count.books}
                      </p>
                      <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>Books</p>
                    </div>
                    <div style={{ width: 1, background: "var(--color-border-subtle)" }} />
                    <div style={{ textAlign: "center" }}>
                      <p style={{ fontSize: "var(--text-xl)", fontWeight: 700, color: "var(--color-terracotta-400)", fontFamily: "var(--font-display)" }}>
                        {author._count.fatawa}
                      </p>
                      <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>Fatawa</p>
                    </div>
                    <div style={{ width: 1, background: "var(--color-border-subtle)" }} />
                    <div>
                      <span className={`badge ${author.isActive ? "badge--success" : "badge--default"}`}>
                        {author.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/admin/authors?page=${p}&search=${search}`}
                className={`pagination__btn ${p === page ? "pagination__btn--active" : ""}`}
              >
                {p}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
