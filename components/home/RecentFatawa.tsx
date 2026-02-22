"use client";

import Link from "next/link";
import { ArrowRight, Eye, ScrollText } from "lucide-react";

interface Fatwa {
  id: string;
  title: string;
  slug: string;
  question: string;
  language: string;
  viewCount: number;
  publishedAt: Date | null;
  author: { name: string; slug: string };
  category: { name: string };
  tags: { tag: { name: string } }[];
}

interface RecentFatawaProps {
  fatawa: Fatwa[];
}

const LANG_LABELS: Record<string, string> = {
  ur: "اردو",
  ar: "عربي",
  en: "English",
};

export default function RecentFatawa({ fatawa }: RecentFatawaProps) {
  if (!fatawa.length) return null;

  return (
    <section style={{ padding: "6rem 0", background: "var(--color-parchment-50)" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 2rem" }}>
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
                color: "var(--color-terracotta-400)",
                marginBottom: "0.75rem",
              }}
            >
              Islamic Rulings
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
              Recent Fatawa
            </h2>
          </div>
          <Link
            href="/fatawa"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "var(--color-terracotta-400)",
              textDecoration: "none",
              padding: "0.5rem 0",
              borderBottom: "1.5px solid var(--color-terracotta-200)",
            }}
          >
            View all fatawa
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Fatawa list */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1rem",
          }}
          className="fatawa-grid"
        >
          {fatawa.map((f, idx) => (
            <Link
              key={f.id}
              href={`/fatawa/${f.slug}`}
              style={{ textDecoration: "none" }}
            >
              <article
                style={{
                  background: "white",
                  border: "1px solid var(--color-parchment-200)",
                  borderRadius: "16px",
                  padding: "1.75rem",
                  transition: "all 0.25s",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.875rem",
                  cursor: "pointer",
                }}
                onMouseOver={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(-3px)";
                  el.style.boxShadow = "0 12px 32px rgba(39,33,24,0.09)";
                  el.style.borderColor = "var(--color-terracotta-200)";
                }}
                onMouseOut={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "none";
                  el.style.borderColor = "var(--color-parchment-200)";
                }}
              >
                {/* Top: category + lang */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
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

                {/* Question icon */}
                <div style={{ display: "flex", gap: "0.875rem", alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
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
                    <ScrollText size={16} style={{ color: "var(--color-terracotta-400)" }} />
                  </div>

                  <div>
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.0625rem",
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
                        fontSize: "0.875rem",
                        color: "var(--color-slate-warm-400)",
                        lineHeight: 1.65,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical" as any,
                        overflow: "hidden",
                      }}
                    >
                      {f.question.slice(0, 140)}…
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "0.875rem",
                    borderTop: "1px solid var(--color-parchment-100)",
                    marginTop: "auto",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.8125rem",
                      color: "var(--color-dusty-500)",
                      fontWeight: 600,
                    }}
                  >
                    {f.author.name}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "var(--color-slate-warm-400)", fontSize: "0.8125rem" }}>
                    <Eye size={13} />
                    {f.viewCount.toLocaleString()}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .fatawa-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
