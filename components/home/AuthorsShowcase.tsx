"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, ScrollText } from "lucide-react";

interface Author {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  nationality: string | null;
  birthYear: number | null;
  deathYear: number | null;
  image: { url: string } | null;
  _count: { books: number; fatawa: number };
}

interface AuthorsShowcaseProps {
  authors: Author[];
}

export default function AuthorsShowcase({ authors }: AuthorsShowcaseProps) {
  if (!authors.length) return null;

  return (
    <section
      style={{
        padding: "6rem 0",
        background: "var(--color-slate-warm-800)",
        color: "var(--color-parchment-100)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(110,99,158,0.12) 0%, transparent 50%), radial-gradient(circle at 80% 30%, rgba(202,166,96,0.06) 0%, transparent 50%)`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 2rem",
          position: "relative",
        }}
      >
        {/* Header */}
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
                color: "var(--color-dusty-400)",
                marginBottom: "0.75rem",
              }}
            >
              Islamic Scholars
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 700,
                color: "var(--color-parchment-100)",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              Authors & Scholars
            </h2>
          </div>
          <Link
            href="/authors"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "var(--color-parchment-300)",
              textDecoration: "none",
              borderBottom: "1px solid rgba(240,232,216,0.25)",
              paddingBottom: "2px",
              transition: "color 0.15s",
            }}
          >
            View all scholars
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Authors grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "1rem",
          }}
        >
          {authors.map((author, idx) => (
            <Link
              key={author.id}
              href={`/authors/${author.slug}`}
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(240,232,216,0.1)",
                  borderRadius: "16px",
                  padding: "1.5rem",
                  transition: "all 0.25s",
                  cursor: "pointer",
                }}
                onMouseOver={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "rgba(255,255,255,0.08)";
                  el.style.borderColor = "rgba(240,232,216,0.2)";
                  el.style.transform = "translateY(-3px)";
                }}
                onMouseOut={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "rgba(255,255,255,0.04)";
                  el.style.borderColor = "rgba(240,232,216,0.1)";
                  el.style.transform = "translateY(0)";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                  {/* Avatar */}
                  <div
                    style={{
                      width: 52,
                      height: 52,
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
                      <img
                        src={author.image.url}
                        alt={author.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "1.25rem",
                          fontWeight: 700,
                          color: "rgba(240,232,216,0.7)",
                        }}
                      >
                        {author.name.charAt(0)}
                      </span>
                    )}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1rem",
                        fontWeight: 700,
                        color: "var(--color-parchment-100)",
                        letterSpacing: "-0.01em",
                        lineHeight: 1.3,
                        marginBottom: "0.25rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {author.name}
                    </h3>
                    {(author.nationality || author.birthYear) && (
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: "rgba(240,232,216,0.4)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {author.nationality}
                        {author.birthYear && ` · ${author.birthYear}${author.deathYear ? `–${author.deathYear}` : ""}`}
                      </p>
                    )}
                  </div>
                </div>

                {author.bio && (
                  <p
                    style={{
                      fontSize: "0.8125rem",
                      color: "rgba(240,232,216,0.45)",
                      lineHeight: 1.65,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical" as any,
                      overflow: "hidden",
                      marginBottom: "1rem",
                    }}
                  >
                    {author.bio}
                  </p>
                )}

                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    paddingTop: "0.875rem",
                    borderTop: "1px solid rgba(240,232,216,0.07)",
                  }}
                >
                  {author._count.books > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                      <BookOpen size={12} style={{ color: "rgba(240,232,216,0.35)" }} />
                      <span style={{ fontSize: "0.75rem", color: "rgba(240,232,216,0.4)", fontWeight: 500 }}>
                        {author._count.books} books
                      </span>
                    </div>
                  )}
                  {author._count.fatawa > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                      <ScrollText size={12} style={{ color: "rgba(240,232,216,0.35)" }} />
                      <span style={{ fontSize: "0.75rem", color: "rgba(240,232,216,0.4)", fontWeight: 500 }}>
                        {author._count.fatawa} fatawa
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
