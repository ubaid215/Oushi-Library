import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, BookOpen, Download, Eye } from "lucide-react";
import { formatNumber, formatDate, getStatusColor, getStatusLabel, formatFileSize } from "@/lib/utils";
import type { Metadata } from "next";
import type { ContentStatus } from "@prisma/client";

export const metadata: Metadata = { title: "Books" };

interface BooksPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    language?: string;
  }>;
}

const LIMIT = 20;

export default async function BooksPage({ searchParams }: BooksPageProps) {
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
    ...(status && { status: status as ContentStatus }),
    ...(language && { language }),
  };

  const [books, total] = await Promise.all([
    prisma.book.findMany({
      where,
      skip,
      take: LIMIT,
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { name: true } },
        category: { select: { name: true } },
        coverImage: { select: { url: true } },
        pdfFile: { select: { compressedSize: true, size: true } },
      },
    }),
    prisma.book.count({ where }),
  ]);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      {/* Header */}
      <div className="page-header--with-action page-header">
        <div>
          <p className="page-header__eyebrow">Library</p>
          <h1 className="page-header__title">Books</h1>
          <p className="page-header__subtitle">
            Manage your Islamic book collection — upload, organize, and publish.
          </p>
        </div>
        <Link href="/admin/books/new" className="btn btn--primary">
          <Plus size={15} />
          Add Book
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <form method="GET" style={{ display: "flex", gap: "var(--space-3)", flex: 1, flexWrap: "wrap", alignItems: "center" }}>
          <div className="input-wrapper" style={{ flex: 1, minWidth: 200 }}>
            <input
              name="search"
              defaultValue={search}
              placeholder="Search title or author..."
              className="input input--sm"
            />
          </div>
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
          {(search || status || language) && (
            <Link href="/admin/books" className="btn btn--ghost btn--sm">Clear</Link>
          )}
        </form>
        <div className="sort-bar__info">
          <strong>{formatNumber(total)}</strong> books
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper overflow-x-auto w-full">
        <table className="table">
          <thead>
            <tr>
              <th>Book</th>
              <th>Author</th>
              <th>Category</th>
              <th>PDF Size</th>
              <th>Downloads</th>
              <th>Views</th>
              <th>Status</th>
              <th>Date</th>
              <th style={{ width: 80 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.length === 0 ? (
              <tr>
                <td colSpan={9}>
                  <div className="empty-state" style={{ padding: "var(--space-12)" }}>
                    <BookOpen size={48} style={{ opacity: 0.2, margin: "0 auto var(--space-4)" }} />
                    <p className="empty-state__title">No books found</p>
                    <p className="empty-state__body">
                      {search ? `No results for "${search}"` : "Start by adding your first book"}
                    </p>
                    <Link href="/admin/books/new" className="btn btn--primary btn--sm" style={{ marginTop: "var(--space-4)" }}>
                      <Plus size={13} /> Add Book
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              books.map((book) => (
                <tr key={book.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                      <div
                        style={{
                          width: 32,
                          height: 42,
                          borderRadius: "var(--radius-md)",
                          background: book.coverImage?.url
                            ? `url(${book.coverImage.url}) center/cover`
                            : "linear-gradient(135deg, var(--color-dusty-200), var(--color-dusty-300))",
                          flexShrink: 0,
                          boxShadow: "var(--shadow-xs)",
                        }}
                      />
                      <div>
                        <Link
                          href={`/admin/books/${book.slug}`}
                          style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text-primary)", textDecoration: "none" }}
                        >
                          {book.title}
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
                    {book.author.name}
                  </td>
                  <td style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
                    {book.category?.name ?? "—"}
                  </td>
                  <td style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
                    {book.pdfFile?.compressedSize
                      ? formatFileSize(book.pdfFile.compressedSize)
                      : book.pdfFile?.size
                        ? formatFileSize(book.pdfFile.size)
                        : "—"}
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
                      <Download size={12} style={{ color: "var(--color-text-tertiary)" }} />
                      <span style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-dusty-600)" }}>
                        {formatNumber(book.downloadCount)}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
                      <Eye size={12} style={{ color: "var(--color-text-tertiary)" }} />
                      <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
                        {formatNumber(book.viewCount)}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getStatusColor(book.status)}`}>
                      {getStatusLabel(book.status)}
                    </span>
                  </td>
                  <td style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
                    {formatDate(book.createdAt)}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "var(--space-1)" }}>
                      <Link href={`/books/${book.slug}`} target="_blank" className="btn btn--ghost btn--icon-sm" title="Preview">
                        <Eye size={14} />
                      </Link>
                      <Link href={`/admin/books/${book.slug}`} className="btn btn--ghost btn--icon-sm" title="Edit">
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="pagination">
            {page > 1 && (
              <Link
                href={`/admin/books?page=${page - 1}&search=${search}&status=${status}&language=${language}`}
                className="pagination__btn"
              >
                ‹
              </Link>
            )}
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/admin/books?page=${p}&search=${search}&status=${status}&language=${language}`}
                className={`pagination__btn ${p === page ? "pagination__btn--active" : ""}`}
              >
                {p}
              </Link>
            ))}
            {page < totalPages && (
              <Link
                href={`/admin/books?page=${page + 1}&search=${search}&status=${status}&language=${language}`}
                className="pagination__btn"
              >
                ›
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
