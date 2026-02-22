import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BookOpen, Download } from "lucide-react";
import SearchFilter from "@/components/ui/SearchFilter";

export const metadata = {
    title: "Books Library — Oushi",
    description: "Browse our extensive collection of Islamic books.",
};

const LANG_LABELS: Record<string, string> = {
    ur: "اردو",
    ar: "عربي",
    en: "English",
    fa: "فارسی",
};

const COVER_GRADIENTS = [
    "linear-gradient(155deg, #eae8f2, #b5afd0)",
    "linear-gradient(155deg, #f9e6de, #e4a285)",
    "linear-gradient(155deg, #e4ede4, #9dbf9d)",
    "linear-gradient(155deg, #f8f2e4, #d9bc85)",
    "linear-gradient(155deg, #e0ddef, #9188b8)",
    "linear-gradient(155deg, #fdf5f2, #d4775a)",
];

export default async function BooksDirectoryPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string; search?: string }>;
}) {
    const resolvedParams = await searchParams;
    const categorySlug = resolvedParams.category;
    const searchQuery = resolvedParams.search;

    const whereClause: any = {
        isPublished: true,
    };
    if (categorySlug) {
        whereClause.category = { slug: categorySlug };
    }
    if (searchQuery) {
        whereClause.OR = [
            { title: { contains: searchQuery, mode: "insensitive" } },
            { author: { name: { contains: searchQuery, mode: "insensitive" } } },
        ];
    }

    const categories = await prisma.category.findMany({
        where: { type: { in: ["BOOK", "BOTH"] }, isActive: true },
        select: { id: true, name: true, slug: true },
        orderBy: { order: "asc" },
    });

    const books = await prisma.book.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            title: true,
            slug: true,
            language: true,
            downloadCount: true,
            author: { select: { name: true } },
            category: { select: { name: true } },
            coverImage: { select: { url: true } },
        },
    });

    return (
        <div style={{ minHeight: "100vh", background: "var(--color-parchment-50)", padding: "4rem 0" }}>
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>
                {/* Header */}
                <div style={{ marginBottom: "3rem", textAlign: "center" }}>
                    <h1
                        style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                            fontWeight: 700,
                            color: "var(--color-slate-warm-800)",
                            letterSpacing: "-0.03em",
                            marginBottom: "1rem",
                        }}
                    >
                        {categorySlug ? "Category Books" : "Library"}
                    </h1>
                    <p style={{ color: "var(--color-slate-warm-400)", fontSize: "1.125rem", maxWidth: 500, margin: "0 auto" }}>
                        Explore our curated collection of classical and contemporary Islamic literature.
                    </p>
                </div>

                <SearchFilter
                    cats={categories}
                    currentCategory={categorySlug}
                    currentSearch={searchQuery}
                    placeholder="Search books by title or author..."
                />

                {/* Grid */}
                <style>{`
                    .book-card {
                        background: white;
                        border-radius: 16px;
                        overflow: hidden;
                        border: 1px solid var(--color-parchment-200);
                        box-shadow: 0 4px 16px rgba(39,33,24,0.04);
                        transition: all 0.3s cubic-bezier(0.25,0.46,0.45,0.94);
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        cursor: pointer;
                    }
                    .book-card:hover {
                        transform: translateY(-6px);
                        box-shadow: 0 12px 32px rgba(39,33,24,0.08);
                        border-color: var(--color-dusty-200);
                    }
                `}</style>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                        gap: "2rem",
                    }}
                >
                    {books.map((book, idx) => (
                        <Link key={book.id} href={`/books/${book.slug}`} style={{ textDecoration: "none" }}>
                            <div className="book-card">
                                {/* Cover Area */}
                                <div
                                    style={{
                                        height: 220,
                                        background: book.coverImage?.url
                                            ? `url(${book.coverImage.url}) center/cover`
                                            : COVER_GRADIENTS[idx % COVER_GRADIENTS.length],
                                        position: "relative",
                                    }}
                                >
                                    <div
                                        style={{
                                            position: "absolute",
                                            left: 0,
                                            top: 0,
                                            bottom: 0,
                                            width: "12px",
                                            background: "linear-gradient(to right, rgba(0,0,0,0.15), transparent)",
                                        }}
                                    />
                                    {!book.coverImage?.url && (
                                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", textAlign: "center" }}>
                                            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "rgba(39,33,24,0.4)" }}>
                                                {book.title}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                                        <span
                                            style={{
                                                fontSize: "0.625rem",
                                                fontWeight: 700,
                                                letterSpacing: "0.08em",
                                                textTransform: "uppercase",
                                                color: "var(--color-dusty-500)",
                                                background: "var(--color-dusty-50)",
                                                padding: "0.25rem 0.5rem",
                                                borderRadius: "999px",
                                                border: "1px solid var(--color-dusty-200)",
                                            }}
                                        >
                                            {LANG_LABELS[book.language] ?? book.language}
                                        </span>
                                        {book.category && (
                                            <span
                                                style={{
                                                    fontSize: "0.625rem",
                                                    fontWeight: 700,
                                                    letterSpacing: "0.08em",
                                                    textTransform: "uppercase",
                                                    color: "var(--color-slate-warm-400)",
                                                    padding: "0.25rem 0.5rem",
                                                    borderRadius: "999px",
                                                    border: "1px solid var(--color-parchment-300)",
                                                }}
                                            >
                                                {book.category.name}
                                            </span>
                                        )}
                                    </div>

                                    <h3
                                        style={{
                                            fontFamily: "var(--font-display)",
                                            fontSize: "1.125rem",
                                            fontWeight: 700,
                                            color: "var(--color-slate-warm-800)",
                                            lineHeight: 1.3,
                                            marginBottom: "0.5rem",
                                        }}
                                    >
                                        {book.title}
                                    </h3>

                                    <p style={{ fontSize: "0.8125rem", color: "var(--color-slate-warm-400)", fontWeight: 500, marginBottom: "1.5rem" }}>
                                        {book.author.name}
                                    </p>

                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", borderTop: "1px solid var(--color-parchment-100)", paddingTop: "1rem" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "var(--color-slate-warm-400)", fontSize: "0.75rem" }}>
                                            <Download size={12} />
                                            {book.downloadCount.toLocaleString()}
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--color-dusty-400)", fontSize: "0.75rem", fontWeight: 600 }}>
                                            Read <BookOpen size={12} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {books.length === 0 && (
                        <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "4rem 0", color: "var(--color-slate-warm-400)" }}>
                            <BookOpen size={48} style={{ margin: "0 auto 1rem", opacity: 0.2 }} />
                            <p>No books found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
