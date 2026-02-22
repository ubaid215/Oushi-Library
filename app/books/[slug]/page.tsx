import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatFileSize, formatDate } from "@/lib/utils";
import Link from "next/link";
import { Download, Eye, BookOpen, User, Tag, Calendar, ArrowRight } from "lucide-react";
import { ShareButton } from "@/components/ui/ShareButton";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const book = await prisma.book.findUnique({ where: { slug: decodedSlug } });

    if (!book) return { title: "Book Not Found" };

    return {
        title: book.title,
        description: book.description?.slice(0, 160) || `Read ${book.title}`,
    };
}

const COVER_GRADIENTS = [
    "linear-gradient(155deg, #eae8f2, #b5afd0)",
    "linear-gradient(155deg, #f9e6de, #e4a285)",
    "linear-gradient(155deg, #e4ede4, #9dbf9d)",
    "linear-gradient(155deg, #f8f2e4, #d9bc85)",
    "linear-gradient(155deg, #e0ddef, #9188b8)",
    "linear-gradient(155deg, #fdf5f2, #d4775a)",
];

export default async function BookPreviewPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);

    const book = await prisma.book.findUnique({
        where: { slug: decodedSlug },
        include: {
            author: true,
            category: true,
            coverImage: true,
            pdfFile: true,
            tags: { include: { tag: true } },
        },
    });

    if (!book) {
        notFound();
    }

    // Increment view count directly via prisma in background
    prisma.book.update({
        where: { id: book.id },
        data: { viewCount: { increment: 1 } }
    }).catch(console.error);

    // Fetch related books (same category, excluding current)
    const relatedBooks = await prisma.book.findMany({
        where: {
            isPublished: true,
            categoryId: book.categoryId,
            id: { not: book.id }
        },
        take: 3,
        include: { author: true, coverImage: true, category: true }
    });

    return (
        <div style={{ background: "var(--color-parchment-50)", minHeight: "100vh", paddingTop: "var(--space-8)", paddingBottom: "6rem" }}>
            <div className="container" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 var(--space-4)" }}>
                {/* Back button */}
                <div style={{ marginBottom: "var(--space-6)" }}>
                    <Link href="/books" className="btn btn--outline btn--sm" style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)" }}>
                        &larr; Back to Library
                    </Link>
                </div>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: "var(--space-8)",
                    alignItems: "start"
                }} className="book-layout-grid">

                    {/* Left Side: Sidebar / Cover Image & Download */}
                    <aside style={{ position: "sticky", top: "var(--space-8)" }}>
                        <div style={{
                            borderRadius: "16px",
                            overflow: "hidden",
                            boxShadow: "0 12px 32px rgba(39,33,24,0.08)",
                            aspectRatio: "2/3",
                            background: book.coverImage?.url ? `url(${book.coverImage.url}) center/cover` : COVER_GRADIENTS[0],
                            marginBottom: "var(--space-6)",
                            position: "relative"
                        }}>
                            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "12px", background: "linear-gradient(to right, rgba(0,0,0,0.15), transparent)" }} />
                            {!book.coverImage?.url && (
                                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", textAlign: "center" }}>
                                    <span style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, color: "rgba(39,33,24,0.4)" }}>
                                        {book.title}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                            {book.pdfFile && (
                                <a
                                    href={`/api/files/${book.pdfFileId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn--primary btn--full"
                                    style={{ padding: "0.875rem", fontSize: "1rem", display: "flex", justifyContent: "center", alignItems: "center", gap: "var(--space-2)", background: "var(--color-slate-warm-800)", color: "white", borderRadius: "12px", textDecoration: "none", fontWeight: 600, transition: "all 0.2s" }}
                                >
                                    <Download size={18} />
                                    Read PDF ({formatFileSize(book.pdfFile.compressedSize ?? book.pdfFile.size)})
                                </a>
                            )}
                            <ShareButton
                                title={book.title}
                                text={`Read ${book.title} by ${book.author.name} on Oushi Books.`}
                                className="btn btn--outline btn--full"
                                style={{ padding: "0.875rem", fontSize: "1rem", display: "flex", justifyContent: "center", alignItems: "center", gap: "var(--space-2)", borderRadius: "12px" }}
                            />
                        </div>
                    </aside>

                    {/* Right Side: Content */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
                        <div style={{
                            background: "white",
                            padding: "3rem 2.5rem",
                            borderRadius: "20px",
                            border: "1px solid var(--color-parchment-200)",
                            boxShadow: "0 4px 16px rgba(39,33,24,0.02)"
                        }}>
                            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                                <span style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-dusty-500)", background: "var(--color-dusty-50)", padding: "0.25rem 0.625rem", borderRadius: "999px", border: "1px solid var(--color-dusty-200)" }}>
                                    {book.language.toUpperCase()}
                                </span>
                                {book.category && (
                                    <span style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-slate-warm-400)", padding: "0.25rem 0.625rem", borderRadius: "999px", border: "1px solid var(--color-parchment-300)" }}>
                                        {book.category.name}
                                    </span>
                                )}
                            </div>
                            <h1 style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                                fontWeight: 700,
                                lineHeight: 1.15,
                                color: "var(--color-slate-warm-800)",
                                letterSpacing: "-0.02em",
                                marginBottom: "1.5rem"
                            }}>
                                {book.title}
                            </h1>

                            <div style={{
                                display: "flex",
                                gap: "1.5rem",
                                color: "var(--color-slate-warm-400)",
                                fontSize: "0.875rem",
                                flexWrap: "wrap",
                                paddingBottom: "2rem",
                                borderBottom: "1px solid var(--color-parchment-200)"
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                                    <User size={16} style={{ color: "var(--color-dusty-400)" }} />
                                    <Link href={`/authors/${book.author.slug}`} style={{ color: "var(--color-dusty-600)", fontWeight: 600, textDecoration: "none" }}>{book.author.name}</Link>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                                    <Calendar size={16} /> {book.publishedAt ? formatDate(book.publishedAt) : "Draft"}
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                                    <Eye size={16} /> {book.viewCount} views
                                </div>
                            </div>

                            {book.description && (
                                <div style={{ marginTop: "2rem" }}>
                                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "var(--color-slate-warm-700)", marginBottom: "1rem" }}>Synopsis</h3>
                                    <p style={{
                                        fontSize: "1rem",
                                        lineHeight: 1.8,
                                        color: "var(--color-slate-warm-500)",
                                        whiteSpace: "pre-wrap"
                                    }}>
                                        {book.description}
                                    </p>
                                </div>
                            )}

                            {/* Additional Metadata Details */}
                            <div style={{
                                background: "var(--color-parchment-50)",
                                padding: "1.5rem",
                                borderRadius: "12px",
                                border: "1px solid var(--color-parchment-200)",
                                marginTop: "3rem",
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                                gap: "1rem",
                                fontSize: "0.875rem",
                                color: "var(--color-slate-warm-500)"
                            }}>
                                {book.publisher && <div><strong style={{ color: "var(--color-slate-warm-700)" }}>Publisher:</strong> {book.publisher}</div>}
                                {book.edition && <div><strong style={{ color: "var(--color-slate-warm-700)" }}>Edition:</strong> {book.edition}</div>}
                                {book.isbn && <div><strong style={{ color: "var(--color-slate-warm-700)" }}>ISBN:</strong> {book.isbn}</div>}
                            </div>

                            {/* Tags */}
                            {book.tags.length > 0 && (
                                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap", marginTop: "2rem" }}>
                                    <Tag size={16} style={{ color: "var(--color-dusty-400)", marginRight: "0.25rem" }} />
                                    {book.tags.map((t) => (
                                        <span key={t.tag.id} style={{ fontSize: "0.75rem", color: "var(--color-slate-warm-500)", background: "var(--color-parchment-100)", padding: "0.25rem 0.625rem", borderRadius: "999px", border: "1px solid var(--color-parchment-200)" }}>
                                            {t.tag.name}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recommendations Section */}
                {relatedBooks.length > 0 && (
                    <div style={{ marginTop: "6rem" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", borderBottom: "1px solid var(--color-parchment-200)", paddingBottom: "1rem" }}>
                            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 700, color: "var(--color-slate-warm-800)", letterSpacing: "-0.01em" }}>
                                Related Books
                            </h2>
                            <Link href={book.category ? `/books?category=${book.category.slug}` : `/books`} style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.875rem", color: "var(--color-dusty-500)", fontWeight: 600, textDecoration: "none" }}>
                                See more <ArrowRight size={14} />
                            </Link>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2rem" }}>
                            {relatedBooks.map((rb, idx) => (
                                <Link key={rb.id} href={`/books/${rb.slug}`} style={{ textDecoration: "none" }}>
                                    <div style={{
                                        background: "white",
                                        borderRadius: "16px",
                                        overflow: "hidden",
                                        border: "1px solid var(--color-parchment-200)",
                                        boxShadow: "0 4px 16px rgba(39,33,24,0.04)",
                                        transition: "all 0.3s",
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        cursor: "pointer",
                                    }}>
                                        <div style={{ height: 200, background: rb.coverImage?.url ? `url(${rb.coverImage.url}) center/cover` : COVER_GRADIENTS[idx % COVER_GRADIENTS.length], position: "relative" }}>
                                            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "10px", background: "linear-gradient(to right, rgba(0,0,0,0.15), transparent)" }} />
                                            {!rb.coverImage?.url && (
                                                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", textAlign: "center" }}>
                                                    <span style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "rgba(39,33,24,0.3)" }}>{rb.title}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
                                            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.0625rem", fontWeight: 700, color: "var(--color-slate-warm-800)", lineHeight: 1.3, marginBottom: "0.25rem" }}>{rb.title}</h3>
                                            <p style={{ fontSize: "0.8125rem", color: "var(--color-slate-warm-400)", fontWeight: 500 }}>{rb.author.name}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @media (min-width: 900px) {
                    .book-layout-grid {
                        grid-template-columns: 280px 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
}
