import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatFileSize, formatDate } from "@/lib/utils";
import Link from "next/link";
import { Download, Eye, BookOpen, User, Tag, Calendar } from "lucide-react";
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

    return (
        <div className="container" style={{ maxWidth: 1000, margin: "0 auto", padding: "var(--space-8) var(--space-4)" }}>
            {/* Back button */}
            <div style={{ marginBottom: "var(--space-6)" }}>
                <Link href="/admin/books" className="btn btn--outline btn--sm" style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)" }}>
                    &larr; Back to Admin
                </Link>
            </div>

            <div style={{
                display: "grid",
                gridTemplateColumns: "300px 1fr",
                gap: "var(--space-8)",
                alignItems: "start"
            }}>
                {/* Left Side: Cover Image & Download */}
                <div style={{ position: "sticky", top: "var(--space-8)" }}>
                    <div style={{
                        borderRadius: "var(--radius-xl)",
                        overflow: "hidden",
                        boxShadow: "var(--shadow-lg)",
                        aspectRatio: "2/3",
                        background: book.coverImage?.url ? `url(${book.coverImage.url}) center/cover` : "linear-gradient(135deg, var(--color-dusty-200), var(--color-dusty-300))",
                        marginBottom: "var(--space-6)"
                    }} />

                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                        {book.pdfFile && (
                            <a
                                href={`/api/files/${book.pdfFileId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn--primary btn--full"
                                style={{ padding: "var(--space-4)", fontSize: "var(--text-base)", display: "flex", justifyContent: "center", alignItems: "center", gap: "var(--space-2)" }}
                            >
                                <Download size={18} />
                                Read PDF ({formatFileSize(book.pdfFile.compressedSize ?? book.pdfFile.size)})
                            </a>
                        )}
                        <ShareButton
                            title={book.title}
                            text={`Read ${book.title} by ${book.author.name} on Oushi Books.`}
                            className="btn btn--outline btn--full"
                            style={{ padding: "var(--space-4)", fontSize: "var(--text-base)", display: "flex", justifyContent: "center", alignItems: "center", gap: "var(--space-2)" }}
                        />
                    </div>
                </div>

                {/* Right Side: Content */}
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
                    <div>
                        <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
                            <span className="badge badge--default">{book.language.toUpperCase()}</span>
                            {book.category && <span className="badge badge--info">{book.category.name}</span>}
                        </div>
                        <h1 style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "3rem",
                            fontWeight: 700,
                            lineHeight: 1.1,
                            color: "var(--color-text-primary)",
                            marginBottom: "var(--space-4)"
                        }}>
                            {book.title}
                        </h1>

                        <div style={{
                            display: "flex",
                            gap: "var(--space-6)",
                            color: "var(--color-text-secondary)",
                            fontSize: "var(--text-sm)",
                            flexWrap: "wrap",
                            paddingBottom: "var(--space-6)",
                            borderBottom: "1px solid var(--color-border-subtle)"
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                                <User size={16} /> {book.author.name}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                                <Calendar size={16} /> Published {book.publishedAt ? formatDate(book.publishedAt) : "Draft"}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                                <Eye size={16} /> {book.viewCount} views
                            </div>
                        </div>
                    </div>

                    {book.description && (
                        <div>
                            <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 600, marginBottom: "var(--space-3)" }}>Description</h3>
                            <p style={{
                                fontSize: "var(--text-base)",
                                lineHeight: 1.7,
                                color: "var(--color-text-secondary)",
                                whiteSpace: "pre-wrap"
                            }}>
                                {book.description}
                            </p>
                        </div>
                    )}

                    {/* Additional Metadata */}
                    <div style={{
                        background: "var(--color-surface)",
                        padding: "var(--space-6)",
                        borderRadius: "var(--radius-lg)",
                        border: "1px solid var(--color-border-subtle)",
                        marginTop: "var(--space-4)",
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "var(--space-4)"
                    }}>
                        {book.publisher && <div><strong>Publisher:</strong> {book.publisher}</div>}
                        {book.edition && <div><strong>Edition:</strong> {book.edition}</div>}
                        {book.isbn && <div><strong>ISBN:</strong> {book.isbn}</div>}
                    </div>

                    {/* Tags */}
                    {book.tags.length > 0 && (
                        <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center", flexWrap: "wrap", marginTop: "var(--space-4)" }}>
                            <Tag size={16} style={{ color: "var(--color-text-tertiary)" }} />
                            {book.tags.map((t) => (
                                <span key={t.tag.id} className="badge bg-dusty-100 text-dusty-700">
                                    {t.tag.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
