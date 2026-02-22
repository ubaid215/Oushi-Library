"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  type: string;
  _count: { books: number; fatawa: number };
}

interface CategoryBrowserProps {
  categories: Category[];
}

const CATEGORY_ACCENTS = [
  { bg: "var(--color-dusty-100)", border: "var(--color-dusty-200)", text: "var(--color-dusty-600)", dot: "var(--color-dusty-400)" },
  { bg: "var(--color-terracotta-50)", border: "var(--color-terracotta-100)", text: "var(--color-terracotta-500)", dot: "var(--color-terracotta-300)" },
  { bg: "var(--color-sage-50)", border: "var(--color-sage-200)", text: "var(--color-sage-600)", dot: "var(--color-sage-400)" },
  { bg: "var(--color-parchment-100)", border: "var(--color-parchment-300)", text: "var(--color-parchment-500)", dot: "var(--color-parchment-400)" },
  { bg: "var(--color-dusty-50)", border: "var(--color-dusty-100)", text: "var(--color-dusty-500)", dot: "var(--color-dusty-300)" },
  { bg: "var(--color-terracotta-50)", border: "var(--color-terracotta-100)", text: "var(--color-terracotta-400)", dot: "var(--color-terracotta-200)" },
];

export default function CategoryBrowser({ categories }: CategoryBrowserProps) {
  if (!categories.length) return null;

  return (
    <section
      style={{
        padding: "6rem 0",
        background: "linear-gradient(180deg, var(--color-parchment-100) 0%, var(--color-parchment-50) 100%)",
        borderTop: "1px solid var(--color-parchment-200)",
        borderBottom: "1px solid var(--color-parchment-200)",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 2rem" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <p
            style={{
              fontSize: "0.6875rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--color-terracotta-400)",
              marginBottom: "0.875rem",
            }}
          >
            Explore by Subject
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "var(--color-slate-warm-800)",
              lineHeight: 1.15,
              marginBottom: "1rem",
            }}
          >
            Browse by category
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--color-slate-warm-400)",
              maxWidth: "480px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            From classical fiqh to contemporary fatawa — navigate our organized collection.
          </p>
        </div>

        {/* Category grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "1rem",
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
                  style={{
                    background: "white",
                    border: `1px solid ${accent.border}`,
                    borderRadius: "16px",
                    padding: "1.5rem",
                    transition: "all 0.25s cubic-bezier(0.25,0.46,0.45,0.94)",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseOver={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = "translateY(-3px)";
                    el.style.boxShadow = "0 12px 32px rgba(39,33,24,0.1)";
                    el.style.background = accent.bg;
                  }}
                  onMouseOut={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = "translateY(0)";
                    el.style.boxShadow = "none";
                    el.style.background = "white";
                  }}
                >
                  {/* Decorative dot */}
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "10px",
                      background: accent.bg,
                      border: `1px solid ${accent.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: accent.dot,
                      }}
                    />
                  </div>

                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.0625rem",
                      fontWeight: 700,
                      color: "var(--color-slate-warm-800)",
                      letterSpacing: "-0.01em",
                      marginBottom: "0.375rem",
                      lineHeight: 1.3,
                    }}
                  >
                    {cat.name}
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: "1rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.8125rem",
                        color: "var(--color-slate-warm-400)",
                        fontWeight: 500,
                      }}
                    >
                      {count} {isBook ? "books" : "fatawa"}
                    </span>
                    <ArrowRight
                      size={14}
                      style={{ color: accent.text }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
