import { prisma } from "@/lib/prisma";
import { BookOpen, ScrollText, Users, Download, Eye, TrendingUp, FolderTree } from "lucide-react";
import Link from "next/link";
import { formatNumber, formatDate, getStatusColor, getStatusLabel, timeAgo } from "@/lib/utils";
import DashboardCharts from "@/components/admin/DashboardCharts";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

async function getDashboardData() {
  const [
    totalBooks,
    totalFatawa,
    totalAuthors,
    totalCategories,
    totalDownloads,
    totalViews,
    recentBooks,
    recentFatawa,
    topBooks,
    booksByStatus,
  ] = await Promise.all([
    prisma.book.count(),
    prisma.fatwa.count(),
    prisma.author.count(),
    prisma.category.count(),
    prisma.book.aggregate({ _sum: { downloadCount: true } }),
    prisma.book.aggregate({ _sum: { viewCount: true } }),
    prisma.book.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true } }, coverImage: { select: { url: true } } },
    }),
    prisma.fatwa.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true } } },
    }),
    prisma.book.findMany({
      take: 5,
      orderBy: { downloadCount: "desc" },
      include: { author: { select: { name: true } } },
    }),
    prisma.book.groupBy({ by: ["status"], _count: { status: true } }),
  ]);

  return {
    totalBooks,
    totalFatawa,
    totalAuthors,
    totalCategories,
    totalDownloads: totalDownloads._sum.downloadCount ?? 0,
    totalViews: totalViews._sum.viewCount ?? 0,
    recentBooks,
    recentFatawa,
    topBooks,
    booksByStatus,
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  const stats = [
    {
      label: "Total Books",
      value: formatNumber(data.totalBooks),
      icon: <BookOpen size={18} />,
      color: "var(--color-dusty-500)",
      bg: "var(--color-dusty-100)",
      href: "/admin/books",
    },
    {
      label: "Total Fatawa",
      value: formatNumber(data.totalFatawa),
      icon: <ScrollText size={18} />,
      color: "var(--color-terracotta-400)",
      bg: "var(--color-terracotta-50)",
      href: "/admin/fatawa",
    },
    {
      label: "Authors",
      value: formatNumber(data.totalAuthors),
      icon: <Users size={18} />,
      color: "var(--color-sage-500)",
      bg: "var(--color-sage-50)",
      href: "/admin/authors",
    },
    {
      label: "Categories",
      value: formatNumber(data.totalCategories),
      icon: <FolderTree size={18} />,
      color: "var(--color-parchment-500)",
      bg: "var(--color-parchment-100)",
      href: "/admin/categories",
    },
    {
      label: "Downloads",
      value: formatNumber(data.totalDownloads),
      icon: <Download size={18} />,
      color: "var(--color-dusty-500)",
      bg: "var(--color-dusty-100)",
      href: "/admin/analytics",
    },
    {
      label: "Total Views",
      value: formatNumber(data.totalViews),
      icon: <Eye size={18} />,
      color: "var(--color-sage-500)",
      bg: "var(--color-sage-50)",
      href: "/admin/analytics",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
      {/* Header */}
      <div className="page-header">
        <p className="page-header__eyebrow">Overview</p>
        <h1 className="page-header__title">Dashboard</h1>
        <p className="page-header__subtitle">
          Your library at a glance — books, fatawa, authors, and analytics.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} style={{ textDecoration: "none" }}>
            <div className="stat-card">
              <div className="stat-card__header">
                <span className="stat-card__label">{s.label}</span>
                <div
                  className="stat-card__icon"
                  style={{ background: s.bg, color: s.color }}
                >
                  {s.icon}
                </div>
              </div>
              <div className="stat-card__value">{s.value}</div>
              <div className="stat-card__footer">
                <TrendingUp size={12} style={{ color: "var(--color-sage-500)" }} />
                <span className="stat-card__period">All time</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Charts */}
      <DashboardCharts booksByStatus={data.booksByStatus} />

      {/* Two column: Recent Books + Recent Fatawa */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Books */}
        <div className="card">
          <div className="card__header">
            <div>
              <p style={{ fontSize: "var(--text-xs)", fontWeight: 600, letterSpacing: "var(--tracking-widest)", textTransform: "uppercase", color: "var(--color-text-tertiary)" }}>
                Recently Added
              </p>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", color: "var(--color-text-primary)", marginTop: "var(--space-1)" }}>
                Books
              </h3>
            </div>
            <Link href="/admin/books" className="btn btn--ghost btn--sm">View all</Link>
          </div>
          <div className="card__body" style={{ paddingTop: "var(--space-3)" }}>
            {data.recentBooks.length === 0 ? (
              <p style={{ color: "var(--color-text-tertiary)", fontSize: "var(--text-sm)", textAlign: "center", padding: "var(--space-8)" }}>
                No books yet
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                {data.recentBooks.map((book) => (
                  <Link
                    key={book.id}
                    href={`/admin/books/${book.id}`}
                    style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-2)", borderRadius: "var(--radius-lg)", transition: "background var(--duration-fast)" }}
                    className="hover-bg"
                  >
                    <div
                      style={{
                        width: 36,
                        height: 48,
                        borderRadius: "var(--radius-md)",
                        background: book.coverImage?.url
                          ? `url(${book.coverImage.url}) center/cover`
                          : "linear-gradient(135deg, var(--color-dusty-200), var(--color-dusty-300))",
                        flexShrink: 0,
                        boxShadow: "var(--shadow-xs)",
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {book.title}
                      </p>
                      <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
                        {book.author.name}
                      </p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2, flexShrink: 0 }}>
                      <span className={`badge ${getStatusColor(book.status)}`}>
                        {getStatusLabel(book.status)}
                      </span>
                      <span style={{ fontSize: "10px", color: "var(--color-text-tertiary)" }}>
                        {timeAgo(book.createdAt)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Fatawa */}
        <div className="card">
          <div className="card__header">
            <div>
              <p style={{ fontSize: "var(--text-xs)", fontWeight: 600, letterSpacing: "var(--tracking-widest)", textTransform: "uppercase", color: "var(--color-text-tertiary)" }}>
                Recently Added
              </p>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", color: "var(--color-text-primary)", marginTop: "var(--space-1)" }}>
                Fatawa
              </h3>
            </div>
            <Link href="/admin/fatawa" className="btn btn--ghost btn--sm">View all</Link>
          </div>
          <div className="card__body" style={{ paddingTop: "var(--space-3)" }}>
            {data.recentFatawa.length === 0 ? (
              <p style={{ color: "var(--color-text-tertiary)", fontSize: "var(--text-sm)", textAlign: "center", padding: "var(--space-8)" }}>
                No fatawa yet
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                {data.recentFatawa.map((f) => (
                  <Link
                    key={f.id}
                    href={`/admin/fatawa/${f.id}`}
                    style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-2)", borderRadius: "var(--radius-lg)" }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "var(--radius-lg)",
                        background: "linear-gradient(135deg, var(--color-terracotta-50), var(--color-terracotta-100))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <ScrollText size={16} style={{ color: "var(--color-terracotta-400)" }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {f.title}
                      </p>
                      <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
                        {f.author.name}
                      </p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2, flexShrink: 0 }}>
                      <span className={`badge ${getStatusColor(f.status)}`}>
                        {getStatusLabel(f.status)}
                      </span>
                      <span style={{ fontSize: "10px", color: "var(--color-text-tertiary)" }}>
                        {timeAgo(f.createdAt)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Downloaded Books */}
      <div className="card">
        <div className="card__header">
          <div>
            <p style={{ fontSize: "var(--text-xs)", fontWeight: 600, letterSpacing: "var(--tracking-widest)", textTransform: "uppercase", color: "var(--color-text-tertiary)" }}>
              Performance
            </p>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", color: "var(--color-text-primary)", marginTop: "var(--space-1)" }}>
              Most Downloaded Books
            </h3>
          </div>
          <Link href="/admin/analytics" className="btn btn--ghost btn--sm">Analytics</Link>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Author</th>
                <th>Downloads</th>
                <th>Views</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.topBooks.map((book, i) => (
                <tr key={book.id}>
                  <td style={{ color: "var(--color-text-tertiary)", fontWeight: 600, width: 40 }}>
                    {i + 1}
                  </td>
                  <td>
                    <Link
                      href={`/admin/books/${book.id}`}
                      style={{ color: "var(--color-text-primary)", fontWeight: 600, textDecoration: "none", fontSize: "var(--text-sm)" }}
                    >
                      {book.title}
                    </Link>
                  </td>
                  <td style={{ color: "var(--color-text-secondary)" }}>{book.author.name}</td>
                  <td>
                    <span style={{ fontWeight: 600, color: "var(--color-dusty-600)" }}>
                      {formatNumber(book.downloadCount)}
                    </span>
                  </td>
                  <td style={{ color: "var(--color-text-secondary)" }}>
                    {formatNumber(book.viewCount)}
                  </td>
                  <td>
                    <span className={`badge ${getStatusColor(book.status)}`}>
                      {getStatusLabel(book.status)}
                    </span>
                  </td>
                </tr>
              ))}
              {data.topBooks.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", color: "var(--color-text-tertiary)", padding: "var(--space-8)" }}>
                    No data yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
