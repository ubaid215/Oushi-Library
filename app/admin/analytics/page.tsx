import { prisma } from "@/lib/prisma";
import { formatNumber } from "@/lib/utils";
import { Download, Eye, BookOpen, ScrollText, TrendingUp, BarChart2 } from "lucide-react";
import AnalyticsCharts from "@/components/admin/AnalyticsCharts";
import type { Metadata } from "next";
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from "react";

export const metadata: Metadata = { title: "Analytics" };

async function getAnalyticsData() {
  const [
    totalDownloads,
    totalViews,
    totalBooks,
    totalFatawa,
    topDownloadedBooks,
    topViewedFatawa,
    booksByLanguage,
    fatwaByLanguage,
  ] = await Promise.all([
    prisma.book.aggregate({ _sum: { downloadCount: true } }),
    prisma.book.aggregate({ _sum: { viewCount: true } }),
    prisma.book.count({ where: { isPublished: true } }),
    prisma.fatwa.count({ where: { isPublished: true } }),
    prisma.book.findMany({
      take: 10,
      orderBy: { downloadCount: "desc" },
      where: { isPublished: true },
      select: { title: true, downloadCount: true, author: { select: { name: true } } },
    }),
    prisma.fatwa.findMany({
      take: 10,
      orderBy: { viewCount: "desc" },
      where: { isPublished: true },
      select: { title: true, viewCount: true, author: { select: { name: true } } },
    }),
    prisma.book.groupBy({ by: ["language"], _count: { language: true } }),
    prisma.fatwa.groupBy({ by: ["language"], _count: { language: true } }),
  ]);

  return {
    totalDownloads: totalDownloads._sum.downloadCount ?? 0,
    totalViews: totalViews._sum.viewCount ?? 0,
    totalBooks,
    totalFatawa,
    topDownloadedBooks,
    topViewedFatawa,
    booksByLanguage,
    fatwaByLanguage,
  };
}

const LANG_LABELS: Record<string, string> = {
  ur: "اردو",
  ar: "عربي",
  en: "English",
  fa: "فارسی",
};

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();

  const stats = [
    { label: "Total Downloads", value: formatNumber(data.totalDownloads), icon: <Download size={18} />, color: "var(--color-dusty-500)", bg: "var(--color-dusty-100)" },
    { label: "Total Views", value: formatNumber(data.totalViews), icon: <Eye size={18} />, color: "var(--color-sage-500)", bg: "var(--color-sage-50)" },
    { label: "Published Books", value: formatNumber(data.totalBooks), icon: <BookOpen size={18} />, color: "var(--color-parchment-500)", bg: "var(--color-parchment-100)" },
    { label: "Published Fatawa", value: formatNumber(data.totalFatawa), icon: <ScrollText size={18} />, color: "var(--color-terracotta-400)", bg: "var(--color-terracotta-50)" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
      <div className="page-header">
        <p className="page-header__eyebrow">Insights</p>
        <h1 className="page-header__title">Analytics</h1>
        <p className="page-header__subtitle">Track downloads, views, and content performance.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-card__header">
              <span className="stat-card__label">{s.label}</span>
              <div className="stat-card__icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            </div>
            <div className="stat-card__value">{s.value}</div>
            <div className="stat-card__footer">
              <TrendingUp size={11} style={{ color: "var(--color-sage-500)" }} />
              <span className="stat-card__period">All time</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts component */}
      <AnalyticsCharts
        booksByLanguage={data.booksByLanguage.map((b: any) => ({
          name: LANG_LABELS[b.language] ?? b.language,
          value: b._count.language,
        }))}
        fatwaByLanguage={data.fatwaByLanguage.map((f: any) => ({
          name: LANG_LABELS[f.language] ?? f.language,
          value: f._count.language,
        }))}
      />

      {/* Top Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Books */}
        <div className="card">
          <div className="card__header">
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", color: "var(--color-text-primary)" }}>
              Top Downloaded Books
            </h3>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th style={{ textAlign: "right" }}>Downloads</th>
                </tr>
              </thead>
              <tbody>
                {data.topDownloadedBooks.map((book: any, i: number) => (
                  <tr key={i}>
                    <td style={{ color: "var(--color-text-tertiary)", fontWeight: 700, width: 32 }}>{i + 1}</td>
                    <td style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text-primary)" }}>
                      {book.title}
                    </td>
                    <td style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>{book.author.name}</td>
                    <td style={{ textAlign: "right" }}>
                      <span style={{ fontWeight: 700, color: "var(--color-dusty-600)" }}>
                        {formatNumber(book.downloadCount)}
                      </span>
                    </td>
                  </tr>
                ))}
                {data.topDownloadedBooks.length === 0 && (
                  <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--color-text-tertiary)", padding: "var(--space-8)" }}>No data</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Fatawa */}
        <div className="card">
          <div className="card__header">
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", color: "var(--color-text-primary)" }}>
              Top Viewed Fatawa
            </h3>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th style={{ textAlign: "right" }}>Views</th>
                </tr>
              </thead>
              <tbody>
                {data.topViewedFatawa.map((f: any, i: number) => (
                  <tr key={i}>
                    <td style={{ color: "var(--color-text-tertiary)", fontWeight: 700, width: 32 }}>{i + 1}</td>
                    <td style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text-primary)" }}>
                      {f.title}
                    </td>
                    <td style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>{f.author.name}</td>
                    <td style={{ textAlign: "right" }}>
                      <span style={{ fontWeight: 700, color: "var(--color-terracotta-400)" }}>
                        {formatNumber(f.viewCount)}
                      </span>
                    </td>
                  </tr>
                ))}
                {data.topViewedFatawa.length === 0 && (
                  <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--color-text-tertiary)", padding: "var(--space-8)" }}>No data</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
