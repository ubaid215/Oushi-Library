import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate, formatFileSize } from "@/lib/utils";
import Link from "next/link";
import { Eye, ScrollText, User, Tag, Calendar, ChevronRight, Download, ArrowRight } from "lucide-react";
import { ShareButton } from "@/components/ui/ShareButton";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const fatwa = await prisma.fatwa.findUnique({ where: { slug: decodedSlug } });

    if (!fatwa) return { title: "Fatwa Not Found" };

    return {
        title: fatwa.seoTitle || fatwa.title,
        description: fatwa.seoDescription || fatwa.question.slice(0, 160),
        keywords: fatwa.seoKeywords?.join(", ")
    };
}

export default async function FatwaPreviewPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);

    const fatwa = await prisma.fatwa.findUnique({
        where: { slug: decodedSlug },
        include: {
            author: true,
            category: true,
            pdfFile: true,
            tags: { include: { tag: true } },
        },
    });

    if (!fatwa) {
        notFound();
    }

    // Increment view count directly via prisma
    prisma.fatwa.update({
        where: { id: fatwa.id },
        data: { viewCount: { increment: 1 } }
    }).catch(console.error);

    const relatedFatawa = await prisma.fatwa.findMany({
        where: {
            isPublished: true,
            categoryId: fatwa.categoryId,
            id: { not: fatwa.id }
        },
        take: 3,
        include: { author: true, category: true }
    });

    const isRtl = fatwa.language === "ur" || fatwa.language === "ar" || fatwa.language === "fa";
    const isUrdu = fatwa.language === "ur";

    function stripHtml(html: string) {
        // Fallback for server side
        return html.replace(/<[^>]*>?/gm, "").trim();
    }

    return (
        <div style={{ background: "var(--color-parchment-50)", minHeight: "100vh", paddingTop: "var(--space-8)", paddingBottom: "6rem" }}>
            <div className="container" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 var(--space-4)" }}>

                {/* Back button & Breadcrumbs */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-6)" }}>
                    <Link href="/fatawa" className="btn btn--outline btn--sm" style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)" }}>
                        &larr; Back to Archive
                    </Link>

                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-tertiary)" }}>
                        <span style={{ color: "var(--color-text-primary)" }}>{fatwa.category.name}</span>
                    </div>
                </div>

                <div className="fatwa-layout-grid" style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: "2.5rem",
                    alignItems: "start"
                }}>

                    {/* Main Content Area */}
                    <article style={{
                        background: "white",
                        borderRadius: "20px",
                        boxShadow: "0 4px 16px rgba(39,33,24,0.02)",
                        padding: "var(--space-8)",
                        border: "1px solid var(--color-parchment-200)"
                    }}>

                        {/* Header */}
                        <header style={{ borderBottom: "1px solid var(--color-border-subtle)", paddingBottom: "var(--space-6)", marginBottom: "var(--space-6)" }}>
                            <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-4)" }}>
                                <span style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-dusty-500)", background: "var(--color-dusty-50)", padding: "0.25rem 0.625rem", borderRadius: "999px", border: "1px solid var(--color-dusty-200)" }}>
                                    {fatwa.language.toUpperCase()}
                                </span>
                                {fatwa.category && (
                                    <span style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-slate-warm-400)", padding: "0.25rem 0.625rem", borderRadius: "999px", border: "1px solid var(--color-parchment-300)" }}>
                                        {fatwa.category.name}
                                    </span>
                                )}
                            </div>

                            <h1 style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "clamp(2rem, 4vw, 3rem)",
                                fontWeight: 700,
                                lineHeight: 1.2,
                                color: "var(--color-slate-warm-800)",
                                marginBottom: "var(--space-4)"
                            }}>
                                {fatwa.title}
                            </h1>

                            <div style={{
                                display: "flex",
                                gap: "var(--space-4)",
                                marginTop: "var(--space-6)",
                                paddingTop: "var(--space-6)",
                                borderTop: "1px dashed var(--color-border-subtle)",
                                flexWrap: "wrap",
                                alignItems: "center"
                            }}>
                                {fatwa.pdfFile && (
                                    <a
                                        href={`/api/files/${fatwa.pdfFileId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ padding: "0.75rem 1.25rem", fontSize: "0.875rem", display: "inline-flex", justifyContent: "center", alignItems: "center", gap: "var(--space-2)", background: "var(--color-slate-warm-800)", color: "white", borderRadius: "8px", textDecoration: "none", fontWeight: 600, transition: "all 0.2s" }}
                                    >
                                        <Download size={16} />
                                        Download PDF
                                    </a>
                                )}
                                <ShareButton
                                    title={fatwa.title}
                                    text={`Read this Fatwa by ${fatwa.author.name} on Oushi Books.`}
                                />
                            </div>
                        </header>

                        {/* Question */}
                        <div style={{ marginBottom: "var(--space-8)" }}>
                            <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 700, color: "var(--color-dusty-700)", marginBottom: "var(--space-3)", display: "flex", alignItems: "center", gap: "var(--space-2)", direction: isRtl ? "rtl" : "ltr" }}>
                                Question
                            </h2>
                            <div
                                className={`fatwa-rich-content fatwa-question-content ${isUrdu ? 'content-urdu' : ''}`}
                                dir={isRtl ? "rtl" : "ltr"}
                                dangerouslySetInnerHTML={{ __html: fatwa.question }}
                            />
                        </div>

                        {/* Answer */}
                        <div>
                            <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 700, color: "var(--color-sage-600)", marginBottom: "var(--space-3)", display: "flex", alignItems: "center", gap: "var(--space-2)", direction: isRtl ? "rtl" : "ltr" }}>
                                Answer
                            </h2>
                            <div
                                className={`fatwa-rich-content fatwa-answer-content ${isUrdu ? 'content-urdu' : ''}`}
                                dir={isRtl ? "rtl" : "ltr"}
                                dangerouslySetInnerHTML={{ __html: fatwa.answer }}
                            />
                        </div>

                        <style>{`
                            .content-urdu {
                                font-family: var(--font-urdu);
                                font-size: 1.25em !important;
                                line-height: 2 !important;
                            }
                            .fatwa-rich-content {
                                font-family: var(--font-body);
                                color: var(--color-text-secondary);
                                line-height: 1.8;
                            }
                            .fatwa-rich-content p {
                                margin-bottom: 1em;
                            }
                            .fatwa-rich-content strong {
                                font-weight: 700;
                                color: var(--color-text-primary);
                            }
                            .fatwa-rich-content em {
                                font-style: italic;
                            }
                            .fatwa-rich-content mark {
                                background-color: var(--color-dusty-200);
                                color: inherit;
                                padding: 0 0.2em;
                                border-radius: 0.2em;
                            }
                            .fatwa-rich-content ul {
                                list-style-type: disc;
                                margin-bottom: 1em;
                                padding-left: 2rem;
                            }
                            .fatwa-rich-content ol {
                                list-style-type: decimal;
                                margin-bottom: 1em;
                                padding-left: 2rem;
                            }
                            .fatwa-rich-content li {
                                margin-bottom: 0.5em;
                            }
                            .fatwa-rich-content li p {
                                margin-bottom: 0;
                            }
                            .fatwa-rich-content blockquote {
                                border-left: 4px solid var(--color-dusty-300);
                                padding-left: 1rem;
                                margin-left: 0;
                                color: var(--color-text-tertiary);
                                font-style: italic;
                                background: var(--color-dusty-50);
                                padding: var(--space-3) var(--space-4);
                                border-radius: 0 var(--radius-md) var(--radius-md) 0;
                                margin-bottom: 1em;
                            }
        
                            .fatwa-question-content {
                                background: var(--color-dusty-50);
                                padding: var(--space-5);
                                border-radius: var(--radius-lg);
                                font-size: var(--text-lg);
                                color: var(--color-text-primary);
                                border-left: 4px solid var(--color-dusty-500);
                            }
                            .fatwa-question-content p:last-child {
                                margin-bottom: 0;
                            }
        
                            .fatwa-answer-content {
                                font-size: var(--text-base);
                            }
                            .fatwa-answer-content p:last-child {
                                margin-bottom: 0;
                            }
                        `}</style>
                    </article>

                    {/* Right Aside (Metadata) */}
                    <aside style={{ position: "sticky", top: "var(--space-8)" }}>
                        <div style={{
                            background: "white",
                            padding: "1.5rem",
                            borderRadius: "16px",
                            border: "1px solid var(--color-parchment-200)",
                            boxShadow: "0 4px 16px rgba(39,33,24,0.02)",
                            marginBottom: "1.5rem"
                        }}>
                            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 700, color: "var(--color-slate-warm-800)", marginBottom: "1rem", borderBottom: "1px solid var(--color-parchment-100)", paddingBottom: "0.75rem" }}>
                                Fatwa Details
                            </h3>

                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.875rem", color: "var(--color-slate-warm-500)" }}>
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                    <User size={16} style={{ color: "var(--color-dusty-400)", flexShrink: 0 }} />
                                    <div>
                                        <div style={{ fontWeight: 600, color: "var(--color-slate-warm-700)" }}>Mufti</div>
                                        <Link href={`/authors/${fatwa.author.slug}`} style={{ color: "var(--color-dusty-600)", fontWeight: 500, textDecoration: "none" }}>{fatwa.author.name}</Link>
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                    <Calendar size={16} style={{ color: "var(--color-dusty-400)", flexShrink: 0 }} />
                                    <div>
                                        <div style={{ fontWeight: 600, color: "var(--color-slate-warm-700)" }}>Published</div>
                                        <div>{fatwa.publishedAt ? formatDate(fatwa.publishedAt) : "Draft"}</div>
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                    <Eye size={16} style={{ color: "var(--color-dusty-400)", flexShrink: 0 }} />
                                    <div>
                                        <div style={{ fontWeight: 600, color: "var(--color-slate-warm-700)" }}>Views</div>
                                        <div>{fatwa.viewCount.toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>

                            {fatwa.tags.length > 0 && (
                                <div style={{ borderTop: "1px solid var(--color-parchment-100)", marginTop: "1rem", paddingTop: "1rem" }}>
                                    <div style={{ fontWeight: 600, color: "var(--color-slate-warm-700)", marginBottom: "0.5rem", fontSize: "0.875rem" }}>Tags</div>
                                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                                        {fatwa.tags.map(t => (
                                            <span key={t.tag.id} style={{ fontSize: "0.75rem", color: "var(--color-slate-warm-500)", background: "var(--color-parchment-100)", padding: "0.25rem 0.625rem", borderRadius: "999px", border: "1px solid var(--color-parchment-200)" }}>
                                                {t.tag.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>

                {/* Recommendations Section */}
                {relatedFatawa.length > 0 && (
                    <div style={{ marginTop: "6rem" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", borderBottom: "1px solid var(--color-parchment-200)", paddingBottom: "1rem" }}>
                            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 700, color: "var(--color-slate-warm-800)", letterSpacing: "-0.01em" }}>
                                Related Fatawa
                            </h2>
                            <Link href={fatwa.category ? `/fatawa?category=${fatwa.category.slug}` : `/fatawa`} style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.875rem", color: "var(--color-dusty-500)", fontWeight: 600, textDecoration: "none" }}>
                                See more <ArrowRight size={14} />
                            </Link>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
                            {relatedFatawa.map((rf) => (
                                <Link key={rf.id} href={`/fatawa/${rf.slug}`} style={{ textDecoration: "none" }}>
                                    <div style={{
                                        background: "white",
                                        borderRadius: "16px",
                                        padding: "1.5rem",
                                        border: "1px solid var(--color-parchment-200)",
                                        boxShadow: "0 4px 16px rgba(39,33,24,0.02)",
                                        transition: "all 0.3s",
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        cursor: "pointer",
                                    }}>
                                        <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", marginBottom: "1rem" }}>
                                            <div style={{ width: 36, height: 36, borderRadius: "8px", background: "var(--color-terracotta-50)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                <ScrollText size={16} style={{ color: "var(--color-terracotta-400)" }} />
                                            </div>
                                            <div>
                                                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.0625rem", fontWeight: 700, color: "var(--color-slate-warm-800)", lineHeight: 1.3, marginBottom: "0.25rem" }}>{rf.title}</h3>
                                                <p style={{ fontSize: "0.8125rem", color: "var(--color-slate-warm-400)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                                    {stripHtml(rf.question).slice(0, 100)}...
                                                </p>
                                            </div>
                                        </div>
                                        <div style={{ marginTop: "auto", paddingTop: "1rem", borderTop: "1px solid var(--color-parchment-100)", fontSize: "0.8125rem", color: "var(--color-dusty-500)", fontWeight: 500 }}>
                                            By {rf.author.name}
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
                    .fatwa-layout-grid {
                        grid-template-columns: 1fr 340px !important;
                    }
                }
            `}</style>
        </div>
    );
}
