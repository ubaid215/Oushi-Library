"use client";

import Link from "next/link";
import { BookOpen, Github, ExternalLink } from "lucide-react";

const FOOTER_LINKS = [
  {
    heading: "Library",
    items: [
      { label: "Books", href: "/books" },
      { label: "Fatawa", href: "/fatawa" },
      { label: "Authors", href: "/authors" },
      { label: "Categories", href: "/categories" },
      { label: "Tags", href: "/tags" },
    ],
  },
  {
    heading: "Site",
    items: [
      { label: "Home", href: "/" },
      { label: "Admin Panel", href: "/admin" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "#080705",
        borderTop: "1px solid rgba(196,157,84,0.2)",
        color: "rgba(245,237,224,0.7)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Gradient accent line */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(196,157,84,0.6) 30%, rgba(196,157,84,1) 50%, rgba(196,157,84,0.6) 70%, transparent 100%)",
        }}
      />

      {/* Decorative arabic ornament — faint watermark */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: "4%",
          bottom: "10%",
          fontSize: "clamp(6rem, 15vw, 12rem)",
          fontFamily: "Georgia, serif",
          color: "rgba(196,157,84,0.06)",
          lineHeight: 1,
          direction: "rtl",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        ﷽
      </div>

      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding:
            "clamp(2.5rem, 5vw, 4rem) clamp(1.5rem, 4vw, 2.5rem) clamp(1.5rem, 3vw, 2.5rem)",
        }}
      >
        {/* Top row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr",
            gap: "clamp(2rem, 5vw, 5rem)",
            marginBottom: "clamp(2.5rem, 4vw, 3.5rem)",
            alignItems: "start",
          }}
          className="ft-grid"
        >
          {/* Brand */}
          <div>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.75rem",
                textDecoration: "none",
                marginBottom: "1.25rem",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #c49d54, #a07830)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <BookOpen size={18} color="white" strokeWidth={2} />
              </div>
              <div>
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "1.3rem",
                    fontWeight: 700,
                    color: "rgba(245,237,224,0.95)",
                    letterSpacing: "-0.01em",
                    display: "block",
                    lineHeight: 1,
                  }}
                >
                  Oushi
                </span>
                <span
                  style={{
                    fontFamily: "system-ui, sans-serif",
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#c49d54",
                    display: "block",
                    marginTop: "3px",
                  }}
                >
                  Library
                </span>
              </div>
            </Link>

            <p
              style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: "0.9rem",
                lineHeight: 1.7,
                color: "rgba(245,237,224,0.6)",
                maxWidth: "32ch",
              }}
            >
              Islamic Books &amp; Fatawa Library Management System. Curate,
              publish, and manage the knowledge archive.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((col) => (
            <div key={col.heading}>
              <p
                style={{
                  fontFamily: "system-ui, sans-serif",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#c49d54",
                  marginBottom: "1.1rem",
                  opacity: 0.9,
                }}
              >
                {col.heading}
              </p>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.7rem",
                }}
              >
                {col.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      style={{
                        fontFamily: "system-ui, sans-serif",
                        fontSize: "0.95rem",
                        color: "rgba(245,237,224,0.7)",
                        textDecoration: "none",
                        transition: "color 0.2s, padding-left 0.2s",
                        display: "inline-block",
                        padding: "2px 0",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.color =
                          "#c49d54";
                        (e.currentTarget as HTMLElement).style.paddingLeft =
                          "4px";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.color =
                          "rgba(245,237,224,0.7)";
                        (e.currentTarget as HTMLElement).style.paddingLeft =
                          "0";
                      }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(196,157,84,0.25), transparent)",
            marginBottom: "1.5rem",
          }}
        />

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1.25rem",
            flexWrap: "wrap",
          }}
        >
          <p
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: "0.85rem",
              color: "rgba(245,237,224,0.5)",
            }}
          >
            © {year} Oushi · Islamic Library Management System
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
            }}
          >
            <Link
              href="/admin"
              style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: "0.85rem",
                color: "#c49d54",
                textDecoration: "none",
                transition: "color 0.2s, gap 0.2s",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
                fontWeight: 500,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#e5b76e";
                (e.currentTarget as HTMLElement).style.gap = "0.5rem";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#c49d54";
                (e.currentTarget as HTMLElement).style.gap = "0.25rem";
              }}
            >
              Admin Panel →
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&display=swap');

        @media (max-width: 767px) {
          .ft-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .ft-grid > :first-child {
            grid-column: 1 / -1;
          }
        }
        @media (max-width: 479px) {
          .ft-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}