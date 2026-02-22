import { prisma } from "@/lib/prisma";
import Hero from "@/components/home/Hero";
import StatsStrip from "@/components/home/StatsStrip";
import FeaturedBooks from "@/components/home/FeaturedBooks";
import WhyBibliotheca from "@/components/home/WhyBibliotheca";
import CategoryBrowser from "@/components/home/CategoryBrowser";
import RecentFatawa from "@/components/home/RecentFatawa";
import AuthorsShowcase from "@/components/home/AuthorsShowcase";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bibliotheca — Islamic Books & Fatawa Library",
  description:
    "A free digital library of thousands of Islamic books, fatawa, and scholarly works in Urdu, Arabic, and English — freely readable and downloadable.",
};

async function getHomeData() {
  const [
    totalBooks,
    totalFatawa,
    totalAuthors,
    totalDownloads,
    featuredBooks,
    recentFatawa,
    featuredAuthors,
    categories,
  ] = await Promise.all([
    prisma.book.count({ where: { isPublished: true } }),
    prisma.fatwa.count({ where: { isPublished: true } }),
    prisma.author.count({ where: { isActive: true } }),
    prisma.book.aggregate({ _sum: { downloadCount: true }, where: { isPublished: true } }),
    prisma.book.findMany({
      where: { isPublished: true },
      orderBy: [{ isFeatured: "desc" }, { downloadCount: "desc" }],
      take: 8,
      select: {
        id: true, title: true, slug: true, language: true, downloadCount: true,
        author: { select: { name: true, slug: true } },
        category: { select: { name: true } },
        coverImage: { select: { url: true } },
        tags: { select: { tag: { select: { name: true } } }, take: 3 },
      },
    }),
    prisma.fatwa.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      take: 6,
      select: {
        id: true, title: true, slug: true, question: true,
        language: true, viewCount: true, publishedAt: true,
        author: { select: { name: true, slug: true } },
        category: { select: { name: true } },
        tags: { select: { tag: { select: { name: true } } }, take: 3 },
      },
    }),
    prisma.author.findMany({
      where: { isActive: true },
      orderBy: [{ books: { _count: "desc" } }],
      take: 8,
      select: {
        id: true, name: true, slug: true, bio: true, nationality: true,
        birthYear: true, deathYear: true,
        image: { select: { url: true } },
        _count: { select: { books: true, fatawa: true } },
      },
    }),
    prisma.category.findMany({
      where: { isActive: true, parentId: null },
      orderBy: { order: "asc" },
      take: 12,
      select: {
        id: true, name: true, slug: true, type: true,
        _count: { select: { books: true, fatawa: true } },
      },
    }),
  ]);

  return {
    totalBooks,
    totalFatawa,
    totalAuthors,
    totalDownloads: totalDownloads._sum.downloadCount ?? 0,
    featuredBooks,
    recentFatawa,
    featuredAuthors,
    categories,
  };
}

export default async function HomePage() {
  const data = await getHomeData();

  return (
    <>
      <Hero
        totalBooks={data.totalBooks}
        totalFatawa={data.totalFatawa}
        totalDownloads={data.totalDownloads}
      />

      <StatsStrip
        totalBooks={data.totalBooks}
        totalFatawa={data.totalFatawa}
        totalAuthors={data.totalAuthors}
        totalDownloads={data.totalDownloads}
      />

      <FeaturedBooks books={data.featuredBooks as any} />

      <WhyBibliotheca />

      <CategoryBrowser categories={data.categories as any} />

      <RecentFatawa fatawa={data.recentFatawa as any} />

      <AuthorsShowcase authors={data.featuredAuthors as any} />
    </>
  );
}
