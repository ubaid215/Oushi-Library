import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BookOpen, ScrollText } from "lucide-react";

export const metadata = {
    title: "Scholars & Authors — Oushi",
    description: "Explore the scholars and authors who contributed to our library.",
};

export default async function AuthorsDirectoryPage() {
    const authors = await prisma.author.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
        select: {
            id: true,
            name: true,
            slug: true,
            bio: true,
            nationality: true,
            birthYear: true,
            deathYear: true,
            image: { select: { url: true } },
            _count: { select: { books: true, fatawa: true } },
        },
    });

    return (
        <div style={{ minHeight: "100vh", background: "var(--color-slate-warm-800)", color: "var(--color-parchment-100)", padding: "4rem 0", position: "relative", overflow: "hidden" }}>
            {/* Texture */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `radial-gradient(circle at 20% 50%, rgba(110,99,158,0.12) 0%, transparent 50%), radial-gradient(circle at 80% 30%, rgba(202,166,96,0.06) 0%, transparent 50%)`,
                    pointerEvents: "none",
                }}
            />

            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem", position: "relative" }}>
                {/* Header */}
                <div style={{ marginBottom: "3rem", textAlign: "center" }}>
                    <h1
                        style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                            fontWeight: 700,
                            color: "var(--color-parchment-100)",
                            letterSpacing: "-0.03em",
                            marginBottom: "1rem",
                        }}
                    >
                        Scholars &amp; Authors
                    </h1>
                    <p style={{ color: "rgba(240,232,216,0.5)", fontSize: "1.125rem", maxWidth: 500, margin: "0 auto" }}>
                        The custodians of knowledge who documented and preserved the sciences for generations.
                    </p>
                </div>

                {/* Grid */}
                <style>{`
                    .author-card {
                        background: rgba(255,255,255,0.04);
                        border: 1px solid rgba(240,232,216,0.1);
                        border-radius: 16px;
                        padding: 1.5rem;
                        transition: all 0.25s;
                        cursor: pointer;
                        height: 100%;
                    }
                    .author-card:hover {
                        background: rgba(255,255,255,0.08);
                        border-color: rgba(240,232,216,0.2);
                        transform: translateY(-3px);
                    }
                `}</style>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                        gap: "1.5rem",
                    }}
                >
                    {authors.map((author) => (
                        <Link key={author.id} href={`/authors/${author.slug}`} style={{ textDecoration: "none" }}>
                            <div className="author-card">
                                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                                    {/* Avatar */}
                                    <div
                                        style={{
                                            width: 56,
                                            height: 56,
                                            borderRadius: "14px",
                                            flexShrink: 0,
                                            overflow: "hidden",
                                            background: author.image
                                                ? "transparent"
                                                : `linear-gradient(135deg, rgba(110,99,158,0.4), rgba(85,75,130,0.5))`,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            border: "1px solid rgba(255,255,255,0.08)",
                                        }}
                                    >
                                        {author.image ? (
                                            <img src={author.image.url} alt={author.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        ) : (
                                            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", fontWeight: 700, color: "rgba(240,232,216,0.7)" }}>
                                                {author.name.charAt(0)}
                                            </span>
                                        )}
                                    </div>

                                    <div style={{ minWidth: 0 }}>
                                        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 700, color: "var(--color-parchment-100)", letterSpacing: "-0.01em", lineHeight: 1.3, marginBottom: "0.25rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {author.name}
                                        </h3>
                                        {(author.nationality || author.birthYear) && (
                                            <p style={{ fontSize: "0.8rem", color: "rgba(240,232,216,0.4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {author.nationality}
                                                {author.birthYear && ` · ${author.birthYear}${author.deathYear ? `–${author.deathYear}` : ""}`}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {author.bio && (
                                    <p style={{ fontSize: "0.85rem", color: "rgba(240,232,216,0.5)", lineHeight: 1.65, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", marginBottom: "1rem" }}>
                                        {author.bio}
                                    </p>
                                )}

                                <div style={{ display: "flex", gap: "1rem", paddingTop: "1rem", borderTop: "1px solid rgba(240,232,216,0.07)", marginTop: "auto" }}>
                                    {author._count.books > 0 && (
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                                            <BookOpen size={14} style={{ color: "rgba(240,232,216,0.35)" }} />
                                            <span style={{ fontSize: "0.8rem", color: "rgba(240,232,216,0.4)", fontWeight: 500 }}>
                                                {author._count.books} books
                                            </span>
                                        </div>
                                    )}
                                    {author._count.fatawa > 0 && (
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                                            <ScrollText size={14} style={{ color: "rgba(240,232,216,0.35)" }} />
                                            <span style={{ fontSize: "0.8rem", color: "rgba(240,232,216,0.4)", fontWeight: 500 }}>
                                                {author._count.fatawa} fatawa
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}

                    {authors.length === 0 && (
                        <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "4rem 0", color: "rgba(240,232,216,0.3)" }}>
                            <p>No authors found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
