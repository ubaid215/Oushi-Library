import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ScrollText, Eye } from "lucide-react";
import SearchFilter from "@/components/ui/SearchFilter";

export const metadata = {
    title: "Islamic Rulings (Fatawa) — Oushi",
    description: "Browse the archive of Islamic rulings and questions.",
};

const LANG_LABELS: Record<string, string> = {
    ur: "اردو",
    ar: "عربي",
    en: "English",
};

function stripHtml(html: string) {
    if (typeof document === "undefined") {
        return html.replace(/<[^>]*>?/gm, "").trim();
    }
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}

export default async function FatawaDirectoryPage({
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
            { question: { contains: searchQuery, mode: "insensitive" } },
        ];
    }

    const categories = await prisma.category.findMany({
        where: { type: { in: ["FATWA", "BOTH"] }, isActive: true },
        select: { id: true, name: true, slug: true },
        orderBy: { order: "asc" },
    });

    const fatawa = await prisma.fatwa.findMany({
        where: whereClause,
        orderBy: { publishedAt: "desc" },
        select: {
            id: true,
            title: true,
            slug: true,
            question: true,
            language: true,
            viewCount: true,
            author: { select: { name: true } },
            category: { select: { name: true } },
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
                        {categorySlug ? "Category Fatawa" : "Fatawa Archive"}
                    </h1>
                    <p style={{ color: "var(--color-slate-warm-400)", fontSize: "1.125rem", maxWidth: 500, margin: "0 auto" }}>
                        Answers to contemporary and classical Islamic questions.
                    </p>
                </div>

                <SearchFilter
                    cats={categories}
                    currentCategory={categorySlug}
                    currentSearch={searchQuery}
                    placeholder="Search fatawa by question or keywords..."
                />

                {/* Grid */}
                <style>{`
                    .fatwa-card {
                        background: white;
                        border: 1px solid var(--color-parchment-200);
                        border-radius: 16px;
                        padding: 1.75rem;
                        transition: all 0.25s;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        gap: 0.875rem;
                        cursor: pointer;
                    }
                    .fatwa-card:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 12px 32px rgba(39,33,24,0.09);
                        border-color: var(--color-terracotta-200);
                    }
                `}</style>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                        gap: "1.5rem",
                    }}
                >
                    {fatawa.map((f) => (
                        <Link key={f.id} href={`/fatawa/${f.slug}`} style={{ textDecoration: "none" }}>
                            <article className="fatwa-card">
                                {/* Top: category + lang */}
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                                    <span
                                        style={{
                                            fontSize: "0.6875rem",
                                            fontWeight: 700,
                                            letterSpacing: "0.08em",
                                            textTransform: "uppercase",
                                            color: "var(--color-terracotta-500)",
                                            background: "var(--color-terracotta-50)",
                                            padding: "0.25rem 0.625rem",
                                            borderRadius: "999px",
                                            border: "1px solid var(--color-terracotta-100)",
                                        }}
                                    >
                                        {f.category.name}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: "0.6875rem",
                                            color: "var(--color-slate-warm-400)",
                                            padding: "0.25rem 0.625rem",
                                            borderRadius: "999px",
                                            border: "1px solid var(--color-parchment-200)",
                                        }}
                                    >
                                        {LANG_LABELS[f.language] ?? f.language}
                                    </span>
                                </div>

                                {/* Content */}
                                <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", flex: 1 }}>
                                    <div
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: "10px",
                                            background: "var(--color-terracotta-50)",
                                            border: "1px solid var(--color-terracotta-100)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                            marginTop: "2px",
                                        }}
                                    >
                                        <ScrollText size={18} style={{ color: "var(--color-terracotta-400)" }} />
                                    </div>

                                    <div>
                                        <h3
                                            style={{
                                                fontFamily: "var(--font-display)",
                                                fontSize: "1.125rem",
                                                fontWeight: 700,
                                                color: "var(--color-slate-warm-800)",
                                                letterSpacing: "-0.01em",
                                                lineHeight: 1.35,
                                                marginBottom: "0.5rem",
                                            }}
                                        >
                                            {f.title}
                                        </h3>
                                        <p
                                            style={{
                                                fontSize: "0.9rem",
                                                color: "var(--color-slate-warm-400)",
                                                lineHeight: 1.65,
                                                display: "-webkit-box",
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                            }}
                                        >
                                            {stripHtml(f.question).slice(0, 150)}…
                                        </p>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        paddingTop: "1rem",
                                        borderTop: "1px solid var(--color-parchment-100)",
                                        marginTop: "auto",
                                    }}
                                >
                                    <span style={{ fontSize: "0.8125rem", color: "var(--color-dusty-500)", fontWeight: 600 }}>
                                        {f.author.name}
                                    </span>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "var(--color-slate-warm-400)", fontSize: "0.8125rem" }}>
                                        <Eye size={14} />
                                        {f.viewCount.toLocaleString()}
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}

                    {fatawa.length === 0 && (
                        <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "4rem 0", color: "var(--color-slate-warm-400)" }}>
                            <ScrollText size={48} style={{ margin: "0 auto 1rem", opacity: 0.2 }} />
                            <p>No fatawa found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
