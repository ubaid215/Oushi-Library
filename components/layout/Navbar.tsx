"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  BookOpen,
  ScrollText,
  Users,
  LayoutDashboard,
  Settings,
  Tag,
  FolderOpen,
  BarChart3,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: LayoutDashboard },
  { label: "Books", href: "/books", icon: BookOpen },
  { label: "Fatawa", href: "/fatawa", icon: ScrollText },
  { label: "Authors", href: "/authors", icon: Users },
  { label: "Categories", href: "/categories", icon: FolderOpen },
  { label: "Tags", href: "/tags", icon: Tag },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* ─── Top bar ────────────────────────────────────────────── */}
      <header
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 400,
          height: "var(--navbar-h, 60px)",
          display: "flex",
          alignItems: "center",
          padding: "0 clamp(1rem, 3vw, 2rem)",
          gap: "1.5rem",
          background: scrolled
            ? "rgba(12, 10, 8, 0.96)"
            : "rgba(12, 10, 8, 0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: `1px solid ${scrolled ? "rgba(196,157,84,0.2)" : "rgba(196,157,84,0.1)"}`,
          boxShadow: scrolled ? "0 2px 32px rgba(0,0,0,0.4)" : "none",
          transition: "background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.625rem",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <div style={{
            width: 32, height: 32,
            borderRadius: "8px",
            background: "linear-gradient(135deg, #c49d54 0%, #a07830 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 12px rgba(196,157,84,0.4)",
            flexShrink: 0,
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Geometric diamond inset */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(45deg, rgba(255,255,255,0.12) 0%, transparent 60%)",
            }} />
            <BookOpen size={15} color="white" strokeWidth={2} />
          </div>
          <div style={{ lineHeight: 1 }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "1.2rem",
              fontWeight: 700,
              letterSpacing: "-0.01em",
              color: "#f5ede0",
            }}>
              Oushi
            </div>
            <div style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: "0.55rem",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#c49d54",
              marginTop: "1px",
            }}>
              Library
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav
          className="nb-desktop"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.125rem",
            flex: 1,
          }}
        >
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  padding: "0.4rem 0.75rem",
                  borderRadius: "6px",
                  fontSize: "0.78rem",
                  fontFamily: "system-ui, sans-serif",
                  fontWeight: active ? 600 : 500,
                  letterSpacing: "0.01em",
                  color: active ? "#c49d54" : "rgba(245,237,224,0.55)",
                  textDecoration: "none",
                  background: active ? "rgba(196,157,84,0.12)" : "transparent",
                  border: `1px solid ${active ? "rgba(196,157,84,0.25)" : "transparent"}`,
                  transition: "color 0.15s, background 0.15s, border-color 0.15s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    const el = e.currentTarget as HTMLElement;
                    el.style.color = "rgba(245,237,224,0.85)";
                    el.style.background = "rgba(245,237,224,0.06)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    const el = e.currentTarget as HTMLElement;
                    el.style.color = "rgba(245,237,224,0.55)";
                    el.style.background = "transparent";
                  }
                }}
              >
                <Icon size={13} strokeWidth={active ? 2.2 : 1.8} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0, marginLeft: "auto" }}>
          {/* Mobile burger */}
          <button
            className="nb-burger"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            style={{
              width: 36, height: 36,
              borderRadius: "8px",
              border: "1px solid rgba(196,157,84,0.2)",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 0,
              padding: 0,
              position: "relative",
              transition: "border-color 0.18s, background 0.18s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "rgba(196,157,84,0.45)";
              el.style.background = "rgba(196,157,84,0.08)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "rgba(196,157,84,0.2)";
              el.style.background = "transparent";
            }}
          >
            {/* Three bars that animate to X */}
            {[
              { top: "calc(50% - 5.5px)", rotate: open ? "45deg" : "0", moveY: open ? "5.5px" : "0" },
              { top: "calc(50% - 0.75px)", opacity: open ? 0 : 1, scaleX: open ? 0 : 1 },
              { top: "calc(50% + 4px)", rotate: open ? "-45deg" : "0", moveY: open ? "-4.75px" : "0" },
            ].map((bar, i) => (
              <span
                key={i}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: bar.top,
                  width: 16,
                  height: 1.5,
                  borderRadius: 2,
                  background: "#c49d54",
                  marginLeft: -8,
                  opacity: bar.opacity ?? 1,
                  transform: `translateY(${bar.moveY ?? "0"}) rotate(${bar.rotate ?? "0"}) scaleX(${bar.scaleX ?? 1})`,
                  transition:
                    "transform 0.35s cubic-bezier(0.23,1,0.32,1), opacity 0.2s ease",
                }}
              />
            ))}
          </button>
        </div>
      </header>

      {/* ─── Mobile Drawer ───────────────────────────────────────── */}
      <div
        aria-hidden={!open}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 399,
          pointerEvents: open ? "auto" : "none",
        }}
      >
        {/* Backdrop */}
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(4px)",
            opacity: open ? 1 : 0,
            transition: "opacity 0.35s ease",
          }}
        />

        {/* Drawer panel */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: "min(320px, 88vw)",
            background: "#0e0c09",
            borderLeft: "1px solid rgba(196,157,84,0.2)",
            transform: open ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.42s cubic-bezier(0.23,1,0.32,1)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Drawer header */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem 1.25rem",
            borderBottom: "1px solid rgba(196,157,84,0.12)",
            height: "60px",
          }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "1.15rem",
              fontWeight: 700,
              color: "#f5ede0",
              letterSpacing: "-0.01em",
            }}>
              Navigation
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                width: 32, height: 32,
                borderRadius: "8px",
                border: "1px solid rgba(196,157,84,0.2)",
                background: "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
                color: "rgba(245,237,224,0.5)",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = "#c49d54";
                el.style.borderColor = "rgba(196,157,84,0.4)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = "rgba(245,237,224,0.5)";
                el.style.borderColor = "rgba(196,157,84,0.2)";
              }}
            >
              <X size={15} />
            </button>
          </div>

          {/* Nav items */}
          <nav style={{
            flex: 1,
            overflowY: "auto",
            padding: "0.75rem 0.75rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
          }}>
            {NAV_ITEMS.map(({ label, href, icon: Icon }, i) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.75rem 1rem",
                    borderRadius: "10px",
                    textDecoration: "none",
                    color: active ? "#c49d54" : "rgba(245,237,224,0.6)",
                    background: active ? "rgba(196,157,84,0.1)" : "transparent",
                    border: `1px solid ${active ? "rgba(196,157,84,0.22)" : "transparent"}`,
                    fontFamily: "system-ui, sans-serif",
                    fontSize: "0.9rem",
                    fontWeight: active ? 600 : 500,
                    letterSpacing: "0.01em",
                    transition: "all 0.18s",
                    opacity: open ? 1 : 0,
                    transform: open ? "translateX(0)" : "translateX(20px)",
                    // stagger using inline style — we handle with CSS animation delay
                  }}
                  className="drawer-link"
                  // @ts-ignore
                  style2={{ animationDelay: `${i * 40}ms` }}
                >
                  <div style={{
                    width: 32, height: 32,
                    borderRadius: "8px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: active ? "rgba(196,157,84,0.18)" : "rgba(245,237,224,0.05)",
                    color: active ? "#c49d54" : "rgba(245,237,224,0.4)",
                    flexShrink: 0,
                    transition: "all 0.18s",
                  }}>
                    <Icon size={15} strokeWidth={active ? 2.2 : 1.8} />
                  </div>
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Drawer footer */}
          <div style={{
            padding: "1rem 1.25rem",
            borderTop: "1px solid rgba(196,157,84,0.1)",
          }}>
            <Link
              href="/admin"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.625rem 0.875rem",
                borderRadius: "10px",
                border: "1px solid rgba(196,157,84,0.15)",
                background: "rgba(196,157,84,0.06)",
                textDecoration: "none",
                transition: "all 0.18s",
              }}
            >
              <div style={{
                width: 36, height: 36,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #c49d54, #7a5e2a)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.8rem",
                fontWeight: 700,
                color: "white",
                fontFamily: "system-ui, sans-serif",
                flexShrink: 0,
              }}>
                A
              </div>
              <div>
                <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.85rem", fontWeight: 600, color: "#f5ede0" }}>
                  Admin Panel
                </div>
                <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.7rem", color: "rgba(245,237,224,0.4)" }}>
                  Staff Only
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&display=swap');

        :root { --navbar-h: 60px; }

        /* hide burger on desktop, show on mobile */
        .nb-burger { display: none !important; }
        @media (max-width: 1023px) {
          .nb-desktop { display: none !important; }
          .nb-burger  { display: flex !important; }
        }

        /* Drawer link stagger */
        .drawer-link {
          opacity: 0;
          transform: translateX(20px);
          animation: none;
        }
      `}</style>
    </>
  );
}