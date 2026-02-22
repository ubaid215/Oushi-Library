"use client";

import Link from "next/link";
import { Download, ArrowRight, BookOpen } from "lucide-react";

interface Book {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  language: string;
  downloadCount: number;
  publishYear: number | null;
  author: { name: string; slug: string };
  category: { name: string } | null;
  coverImage: { url: string } | null;
  tags: { tag: { name: string } }[];
}

interface FeaturedBooksProps {
  books: Book[];
}

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

export default function FeaturedBooks({ books }: FeaturedBooksProps) {
  if (!books.length) return null;

  const [featured, ...rest] = books;

  return (
    <section style={{ padding: "6rem 0", background: "var(--color-parchment-50)" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 2rem" }}>
        {/* Section header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "3rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "0.6875rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--color-dusty-500)",
                marginBottom: "0.75rem",
              }}
            >
              Featured Collection
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 700,
                color: "var(--color-slate-warm-800)",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              Curated books
            </h2>
          </div>
          <Link
            href="/books"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "var(--color-dusty-500)",
              textDecoration: "none",
              padding: "0.5rem 0",
              borderBottom: "1.5px solid var(--color-dusty-300)",
              transition: "all 0.15s",
            }}
          >
            View all books
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Layout: Hero book + grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: "1.5rem",
            alignItems: "start",
          }}
          className="featured-books-grid"
        >
          {/* Featured (large) card */}
          <Link
            href={`/books/${featured.slug}`}
            style={{ textDecoration: "none", display: "block" }}
          >
            <div
              style={{
                background: "white",
                borderRadius: "20px",
                overflow: "hidden",
                border: "1px solid var(--color-parchment-200)",
                boxShadow: "0 4px 24px rgba(39,33,24,0.06)",
                transition: "all 0.3s cubic-bezier(0.25,0.46,0.45,0.94)",
                display: "grid",
                gridTemplateColumns: "180px 1fr",
              }}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 48px rgba(39,33,24,0.12)";
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(39,33,24,0.06)";
              }}
            >
              {/* Cover */}
              <div
                style={{
                  background: featured.coverImage?.url
                    ? `url(${featured.coverImage.url}) center/cover no-repeat`
                    : COVER_GRADIENTS[0],
                  minHeight: "280px",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "16px",
                    background: "linear-gradient(to right, rgba(0,0,0,0.18), transparent)",
                  }}
                />
                {!featured.coverImage?.url && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "2rem 1.5rem",
                      textAlign: "center",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1rem",
                        fontWeight: 700,
                        color: "var(--color-slate-warm-700)",
                        lineHeight: 1.3,
                      }}
                    >
                      {featured.title}
                    </p>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--color-slate-warm-400)",
                        marginTop: "0.5rem",
                      }}
                    >
                      {featured.author.name}
                    </p>
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ padding: "2rem" }}>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                  <span
                    style={{
                      fontSize: "0.6875rem",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--color-dusty-500)",
                      background: "var(--color-dusty-50)",
                      padding: "0.25rem 0.625rem",
                      borderRadius: "999px",
                      border: "1px solid var(--color-dusty-200)",
                    }}
                  >
                    {LANG_LABELS[featured.language] ?? featured.language}
                  </span>
                  {featured.category && (
                    <span
                      style={{
                        fontSize: "0.6875rem",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "var(--color-slate-warm-400)",
                        padding: "0.25rem 0.625rem",
                        borderRadius: "999px",
                        border: "1px solid var(--color-parchment-300)",
                      }}
                    >
                      {featured.category.name}
                    </span>
                  )}
                </div>

                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "var(--color-slate-warm-800)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.25,
                    marginBottom: "0.5rem",
                  }}
                >
                  {featured.title}
                </h3>

                <p style={{ fontSize: "0.875rem", color: "var(--color-dusty-500)", fontWeight: 600, marginBottom: "1rem" }}>
                  {featured.author.name}
                  {featured.publishYear && (
                    <span style={{ color: "var(--color-slate-warm-400)", fontWeight: 400, marginLeft: "0.5rem" }}>
                      · {featured.publishYear}
                    </span>
                  )}
                </p>

                {featured.description && (
                  <p
                    style={{
                      fontSize: "0.875rem",
                      lineHeight: 1.7,
                      color: "var(--color-slate-warm-500)",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical" as any,
                      overflow: "hidden",
                      marginBottom: "1.5rem",
                    }}
                  >
                    {featured.description}
                  </p>
                )}

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "var(--color-slate-warm-400)", fontSize: "0.8125rem" }}>
                    <Download size={13} />
                    {featured.downloadCount.toLocaleString()} downloads
                  </div>
                  <span
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: 700,
                      color: "var(--color-dusty-500)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    Read now <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Right column: smaller cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {rest.slice(0, 4).map((book, idx) => (
              <Link
                key={book.id}
                href={`/books/${book.slug}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    overflow: "hidden",
                    border: "1px solid var(--color-parchment-200)",
                    boxShadow: "0 2px 12px rgba(39,33,24,0.04)",
                    transition: "all 0.25s",
                    display: "flex",
                    gap: 0,
                  }}
                  onMouseOver={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateX(4px)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(39,33,24,0.08)";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--color-dusty-200)";
                  }}
                  onMouseOut={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateX(0)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(39,33,24,0.04)";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--color-parchment-200)";
                  }}
                >
                  {/* Mini cover */}
                  <div
                    style={{
                      width: "72px",
                      minWidth: "72px",
                      background: book.coverImage?.url
                        ? `url(${book.coverImage.url}) center/cover`
                        : COVER_GRADIENTS[(idx + 1) % COVER_GRADIENTS.length],
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: "10px",
                        background: "linear-gradient(to right, rgba(0,0,0,0.15), transparent)",
                      }}
                    />
                    {!book.coverImage?.url && (
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "1.25rem",
                          fontWeight: 700,
                          color: "rgba(39,33,24,0.25)",
                          zIndex: 1,
                        }}
                      >
                        {book.title.charAt(0)}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ padding: "1rem 1.25rem", flex: 1, minWidth: 0 }}>
                    <h4
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "0.9375rem",
                        fontWeight: 700,
                        color: "var(--color-slate-warm-800)",
                        lineHeight: 1.3,
                        letterSpacing: "-0.01em",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {book.title}
                    </h4>
                    <p style={{ fontSize: "0.8125rem", color: "var(--color-slate-warm-400)", fontWeight: 500, marginBottom: "0.5rem" }}>
                      {book.author.name}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <span
                        style={{
                          fontSize: "0.6875rem",
                          color: "var(--color-dusty-500)",
                          fontWeight: 600,
                          background: "var(--color-dusty-50)",
                          padding: "1px 8px",
                          borderRadius: "999px",
                        }}
                      >
                        {LANG_LABELS[book.language] ?? book.language}
                      </span>
                      <span style={{ fontSize: "0.6875rem", color: "var(--color-slate-warm-400)", display: "flex", alignItems: "center", gap: "3px" }}>
                        <Download size={10} />
                        {book.downloadCount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", padding: "0 1rem 0 0" }}>
                    <ArrowRight size={15} style={{ color: "var(--color-parchment-400)" }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .featured-books-grid {
            grid-template-columns: 1fr !important;
          }
          .featured-books-grid > a:first-child > div {
            grid-template-columns: 140px 1fr !important;
          }
        }
        @media (max-width: 540px) {
          .featured-books-grid > a:first-child > div {
            grid-template-columns: 1fr !important;
          }
          .featured-books-grid > a:first-child > div > div:first-child {
            min-height: 200px !important;
          }
        }
      `}</style>
    </section>
  );
}
