import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate, formatFileSize } from "@/lib/utils";
import Link from "next/link";
import { Eye, ScrollText, User, Tag, Calendar, ChevronRight, Download } from "lucide-react";
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

    const isRtl = fatwa.language === "ur" || fatwa.language === "ar" || fatwa.language === "fa";
    const isUrdu = fatwa.language === "ur";

    return (
        <div className="container" style={{ maxWidth: 800, margin: "0 auto", padding: "var(--space-8) var(--space-4)" }}>

            {/* Back button & Breadcrumbs */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-6)" }}>
                <Link href="/admin/fatawa" className="btn btn--outline btn--sm" style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)" }}>
                    &larr; Back to Admin
                </Link>

                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-tertiary)" }}>
                    <ScrollText size={14} /> Fatawa <ChevronRight size={14} /> <span style={{ color: "var(--color-text-primary)" }}>{fatwa.category.name}</span>
                </div>
            </div>

            <article style={{
                background: "var(--color-surface)",
                borderRadius: "var(--radius-xl)",
                boxShadow: "var(--shadow-md)",
                padding: "var(--space-8)",
                border: "1px solid var(--color-border-subtle)"
            }}>

                {/* Header */}
                <header style={{ borderBottom: "1px solid var(--color-border-subtle)", paddingBottom: "var(--space-6)", marginBottom: "var(--space-6)" }}>
                    <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-4)" }}>
                        <span className="badge badge--default">{fatwa.language.toUpperCase()}</span>
                        {fatwa.category && <span className="badge badge--info">{fatwa.category.name}</span>}
                    </div>

                    <h1 style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "2.5rem",
                        fontWeight: 700,
                        lineHeight: 1.2,
                        color: "var(--color-text-primary)",
                        marginBottom: "var(--space-4)"
                    }}>
                        {fatwa.title}
                    </h1>

                    <div style={{
                        display: "flex",
                        gap: "var(--space-6)",
                        color: "var(--color-text-secondary)",
                        fontSize: "var(--text-sm)",
                        flexWrap: "wrap",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                            <User size={16} /> <strong>Mufti:</strong> {fatwa.author.name}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                            <Calendar size={16} /> <strong>Date:</strong> {formatDate(fatwa.createdAt)}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                            <Eye size={16} /> {formatNumber(fatwa.viewCount)} views
                        </div>
                    </div>

                    <div style={{
                        display: "flex",
                        gap: "var(--space-4)",
                        marginTop: "var(--space-6)",
                        paddingTop: "var(--space-6)",
                        borderTop: "1px dashed var(--color-border-subtle)",
                        flexWrap: "wrap"
                    }}>
                        {fatwa.pdfFile && (
                            <a
                                href={`/api/files/${fatwa.pdfFileId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn--primary"
                                style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)" }}
                            >
                                <Download size={18} />
                                Download PDF ({formatFileSize(fatwa.pdfFile.compressedSize ?? fatwa.pdfFile.size)})
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
                    <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 700, color: "var(--color-brand-600)", marginBottom: "var(--space-3)", display: "flex", alignItems: "center", gap: "var(--space-2)", direction: isRtl ? "rtl" : "ltr" }}>
                        Answer
                    </h2>
                    <div
                        className={`fatwa-rich-content fatwa-answer-content ${isUrdu ? 'content-urdu' : ''}`}
                        dir={isRtl ? "rtl" : "ltr"}
                        dangerouslySetInnerHTML={{ __html: fatwa.answer }}
                    />
                </div>

                {/* Footer info */}
                {fatwa.tags.length > 0 && (
                    <footer style={{ marginTop: "var(--space-8)", paddingTop: "var(--space-6)", borderTop: "1px solid var(--color-border-subtle)" }}>
                        <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center", flexWrap: "wrap" }}>
                            <Tag size={16} style={{ color: "var(--color-text-tertiary)" }} />
                            {fatwa.tags.map((t) => (
                                <span key={t.tag.id} className="badge bg-dusty-100 text-dusty-700">
                                    {t.tag.name}
                                </span>
                            ))}
                        </div>
                    </footer>
                )}

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
        </div>
    );
}

function formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num.toString();
}
