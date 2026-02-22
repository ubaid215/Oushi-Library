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
        borderTop: "1px solid rgba(196,157,84,0.12)",
        color: "rgba(245,237,224,0.4)",
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
          height: 1,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(196,157,84,0.5) 30%, rgba(196,157,84,0.8) 50%, rgba(196,157,84,0.5) 70%, transparent 100%)",
        }}
      />

      {/* Decorative arabic ornament — faint watermark */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: "4%",
          bottom: "10%",
          fontSize: "clamp(5rem, 12vw, 10rem)",
          fontFamily: "Georgia, serif",
          color: "rgba(196,157,84,0.04)",
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
            "clamp(2.5rem, 5vw, 4rem) clamp(1.25rem, 4vw, 2.5rem) clamp(1.5rem, 3vw, 2.5rem)",
        }}
      >
        {/* Top row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr",
            gap: "clamp(2rem, 5vw, 5rem)",
            marginBottom: "clamp(2rem, 4vw, 3rem)",
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
                gap: "0.625rem",
                textDecoration: "none",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "7px",
                  background: "linear-gradient(135deg, #c49d54, #a07830)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <BookOpen size={14} color="white" strokeWidth={2} />
              </div>
              <div>
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "rgba(245,237,224,0.85)",
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
                    fontSize: "0.52rem",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#c49d54",
                    display: "block",
                    marginTop: "2px",
                  }}
                >
                  Library
                </span>
              </div>
            </Link>

            <p
              style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: "0.8rem",
                lineHeight: 1.7,
                color: "rgba(245,237,224,0.3)",
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
                  fontSize: "0.62rem",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#c49d54",
                  marginBottom: "0.875rem",
                  opacity: 0.8,
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
                  gap: "0.5rem",
                }}
              >
                {col.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      style={{
                        fontFamily: "system-ui, sans-serif",
                        fontSize: "0.82rem",
                        color: "rgba(245,237,224,0.35)",
                        textDecoration: "none",
                        transition: "color 0.18s",
                        display: "inline-block",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.color =
                          "rgba(245,237,224,0.75)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.color =
                          "rgba(245,237,224,0.35)";
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
              "linear-gradient(90deg, transparent, rgba(196,157,84,0.15), transparent)",
            marginBottom: "1.25rem",
          }}
        />

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <p
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: "0.72rem",
              color: "rgba(245,237,224,0.2)",
            }}
          >
            © {year} Oushi · Islamic Library Management System
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.25rem",
            }}
          >
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                fontFamily: "system-ui, sans-serif",
                fontSize: "0.72rem",
                color: "rgba(245,237,224,0.22)",
                textDecoration: "none",
                transition: "color 0.18s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  "rgba(245,237,224,0.55)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  "rgba(245,237,224,0.22)";
              }}
            >
              <Github size={12} />
              Source
              <ExternalLink size={10} />
            </a>

            <Link
              href="/admin"
              style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: "0.72rem",
                color: "rgba(196,157,84,0.35)",
                textDecoration: "none",
                transition: "color 0.18s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  "rgba(196,157,84,0.7)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  "rgba(196,157,84,0.35)";
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