import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, ScrollText, Eye } from "lucide-react";
import { formatDate, getStatusColor, getStatusLabel, formatNumber } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Fatawa" };

interface FatawaPageProps {
  searchParams: Promise<{ page?: string; search?: string; status?: string; language?: string }>;
}

const LIMIT = 20;

export default async function FatawaPage({ searchParams }: FatawaPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1"));
  const search = params.search ?? "";
  const status = params.status ?? "";
  const language = params.language ?? "";
  const skip = (page - 1) * LIMIT;

  const where = {
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" as const } },
        { author: { name: { contains: search, mode: "insensitive" as const } } },
      ],
    }),
    ...(status && { status: status as any }),
    ...(language && { language }),
  };

  const [fatawa, total] = await Promise.all([
    prisma.fatwa.findMany({
      where,
      skip,
      take: LIMIT,
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { name: true } },
        category: { select: { name: true } },
      },
    }),
    prisma.fatwa.count({ where }),
  ]);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div className="page-header--with-action page-header">
        <div>
          <p className="page-header__eyebrow">Content</p>
          <h1 className="page-header__title">Fatawa</h1>
          <p className="page-header__subtitle">Manage Islamic rulings and fatawa.</p>
        </div>
        <Link href="/admin/fatawa/new" className="btn btn--primary">
          <Plus size={15} /> Add Fatwa
        </Link>
      </div>

      <div className="filter-bar">
        <form method="GET" style={{ display: "flex", gap: "var(--space-3)", flex: 1, flexWrap: "wrap", alignItems: "center" }}>
          <input name="search" defaultValue={search} placeholder="Search..." className="input input--sm" style={{ flex: 1, minWidth: 200 }} />
          <select name="status" defaultValue={status} className="select" style={{ width: 140 }}>
            <option value="">All Status</option>
            <option value="DRAFT">Draft</option>
            <option value="REVIEW">In Review</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
          <select name="language" defaultValue={language} className="select" style={{ width: 120 }}>
            <option value="">All Languages</option>
            <option value="ur">اردو</option>
            <option value="ar">عربي</option>
            <option value="en">English</option>
          </select>
          <button type="submit" className="btn btn--secondary btn--sm">Filter</button>
          {(search || status || language) && <Link href="/admin/fatawa" className="btn btn--ghost btn--sm">Clear</Link>}
        </form>
        <span className="sort-bar__info"><strong>{formatNumber(total)}</strong> fatawa</span>
      </div>

      <div className="table-wrapper overflow-x-auto w-full">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Language</th>
              <th>Views</th>
              <th>Status</th>
              <th>Date</th>
              <th style={{ width: 80 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fatawa.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <div className="empty-state" style={{ padding: "var(--space-12)" }}>
                    <ScrollText size={48} style={{ opacity: 0.2, margin: "0 auto var(--space-4)" }} />
                    <p className="empty-state__title">No fatawa found</p>
                    <Link href="/admin/fatawa/new" className="btn btn--primary btn--sm" style={{ marginTop: "var(--space-4)" }}>
                      <Plus size={13} /> Add Fatwa
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              fatawa.map((f) => (
                <tr key={f.id}>
                  <td>
                    <Link href={`/admin/fatawa/${f.slug}`} style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text-primary)", textDecoration: "none" }}>
                      {f.title}
                    </Link>
                  </td>
                  <td style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>{f.author.name}</td>
                  <td style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>{f.category.name}</td>
                  <td>
                    <span className="badge badge--default" style={{ fontSize: "10px" }}>
                      {f.language.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
                    {formatNumber(f.viewCount)}
                  </td>
                  <td>
                    <span className={`badge ${getStatusColor(f.status)}`}>{getStatusLabel(f.status)}</span>
                  </td>
                  <td style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
                    {formatDate(f.createdAt)}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "var(--space-1)" }}>
                      <Link href={`/fatawa/${f.slug}`} target="_blank" className="btn btn--ghost btn--xs" title="Preview">
                        <Eye size={12} />
                      </Link>
                      <Link href={`/admin/fatawa/${f.slug}`} className="btn btn--ghost btn--xs" title="Edit">
                        ✎
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="pagination">
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => (
              <Link key={p} href={`/admin/fatawa?page=${p}&search=${search}&status=${status}`} className={`pagination__btn ${p === page ? "pagination__btn--active" : ""}`}>{p}</Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
