import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
    title: "Categories — Oushi",
    description: "Browse library collections by category/subject.",
};

const CATEGORY_ACCENTS = [
    { bg: "var(--color-dusty-100)", border: "var(--color-dusty-200)", text: "var(--color-dusty-600)", dot: "var(--color-dusty-400)" },
    { bg: "var(--color-terracotta-50)", border: "var(--color-terracotta-100)", text: "var(--color-terracotta-500)", dot: "var(--color-terracotta-300)" },
    { bg: "var(--color-sage-50)", border: "var(--color-sage-200)", text: "var(--color-sage-600)", dot: "var(--color-sage-400)" },
    { bg: "var(--color-parchment-100)", border: "var(--color-parchment-300)", text: "var(--color-parchment-500)", dot: "var(--color-parchment-400)" },
    { bg: "var(--color-dusty-50)", border: "var(--color-dusty-100)", text: "var(--color-dusty-500)", dot: "var(--color-dusty-300)" },
    { bg: "var(--color-terracotta-50)", border: "var(--color-terracotta-100)", text: "var(--color-terracotta-400)", dot: "var(--color-terracotta-200)" },
];

export default async function CategoriesDirectoryPage() {
    const categories = await prisma.category.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
        select: {
            id: true,
            name: true,
            slug: true,
            type: true,
            _count: { select: { books: true, fatawa: true } },
        },
    });

    return (
        <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, var(--color-parchment-100) 0%, var(--color-parchment-50) 100%)", padding: "4rem 0" }}>
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
                        Library Subjects
                    </h1>
                    <p style={{ color: "var(--color-slate-warm-400)", fontSize: "1.125rem", maxWidth: 500, margin: "0 auto" }}>
                        Explore our organized collection of topics spanning varied Islamic disciplines.
                    </p>
                </div>

                {/* Grid */}
                <style>{`
                    .category-card {
                        background: white;
                        border-radius: 16px;
                        padding: 1.5rem;
                        transition: all 0.25s cubic-bezier(0.25,0.46,0.45,0.94);
                        cursor: pointer;
                        position: relative;
                        overflow: hidden;
                        height: 100%;
                    }
                    .category-card:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 12px 32px rgba(39,33,24,0.1);
                        background: var(--hover-bg, var(--color-parchment-50)) !important;
                    }
                `}</style>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                        gap: "1.25rem",
                    }}
                >
                    {categories.map((cat, idx) => {
                        const accent = CATEGORY_ACCENTS[idx % CATEGORY_ACCENTS.length];
                        const isBook = cat.type === "BOOK" || cat.type === "BOTH";
                        const isFatwa = cat.type === "FATWA" || cat.type === "BOTH";
                        const count = isBook ? cat._count.books : cat._count.fatawa;
                        const href = isBook ? `/books?category=${cat.slug}` : `/fatawa?category=${cat.slug}`;

                        return (
                            <Link key={cat.id} href={href} style={{ textDecoration: "none" }}>
                                <div
                                    className="category-card"
                                    style={{
                                        border: `1px solid ${accent.border}`,
                                        "--hover-bg": accent.bg,
                                    } as React.CSSProperties}
                                >
                                    {/* Decorative dot */}
                                    <div
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: "10px",
                                            background: accent.bg,
                                            border: `1px solid ${accent.border}`,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginBottom: "1rem",
                                        }}
                                    >
                                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: accent.dot }} />
                                    </div>

                                    <h3
                                        style={{
                                            fontFamily: "var(--font-display)",
                                            fontSize: "1.125rem",
                                            fontWeight: 700,
                                            color: "var(--color-slate-warm-800)",
                                            letterSpacing: "-0.01em",
                                            marginBottom: "0.5rem",
                                            lineHeight: 1.3,
                                        }}
                                    >
                                        {cat.name}
                                    </h3>

                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1.5rem" }}>
                                        <span style={{ fontSize: "0.85rem", color: "var(--color-slate-warm-400)", fontWeight: 500 }}>
                                            {count} {isBook ? "books" : "fatawa"}
                                        </span>
                                        <ArrowRight size={16} style={{ color: accent.text }} />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
