"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useEffect, useRef } from "react";

interface HeroProps {
  totalBooks?: number;
  totalFatawa?: number;
  totalDownloads?: number;
}

export default function Hero({ totalBooks = 2400, totalFatawa = 8000, totalDownloads = 0 }: HeroProps) {
  const decoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (decoRef.current) {
        decoRef.current.style.transform = `translateY(${window.scrollY * 0.15}px)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(0)}k+` : `${n}+`;

  return (
    <section className="hero-section">
      {/* Background decorations */}
      <div ref={decoRef} className="hero-deco" aria-hidden>
        <div className="hero-deco-circle hero-deco-circle--a" />
        <div className="hero-deco-circle hero-deco-circle--b" />
        {/* Geometric lines */}
        <svg className="hero-deco-lines" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <line x1="0" y1="0" x2="100%" y2="35%" stroke="var(--parchment-300)" strokeWidth="1" opacity="0.5" />
          <line x1="100%" y1="0" x2="25%" y2="100%" stroke="var(--parchment-200)" strokeWidth="0.5" opacity="0.5" />
        </svg>
        {/* Arabic ornament watermark */}
        <div className="hero-watermark">بسم الله</div>
      </div>

      <div className="hero-inner">
        {/* Left column */}
        <div className="hero-text">
          {/* Eyebrow badge */}
          <div className="hero-badge animate-hero-1">
            <span className="hero-badge-dot" />
            <span>Free Islamic Library</span>
          </div>

          {/* Headline */}
          <h1 className="hero-h1 animate-hero-2">
            Centuries of{" "}
            <span className="hero-h1-em">
              Islamic wisdom
              <svg className="hero-h1-underline" viewBox="0 0 220 12" preserveAspectRatio="none">
                <path d="M4,9 Q60,2 110,8 Q165,14 216,7" fill="none" stroke="var(--violet-300)" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </span>
            {" "}in your hands.
          </h1>

          <p className="hero-body animate-hero-3">
            Browse thousands of books and scholarly fatawa — from classical texts to contemporary scholarship — free to read and download.
          </p>

          {/* CTAs */}
          <div className="hero-ctas animate-hero-4">
            <Link href="/books" className="hero-btn hero-btn--primary">
              Browse Books
              <ArrowRight size={15} />
            </Link>
            <Link href="/fatawa" className="hero-btn hero-btn--ghost">
              Read Fatawa
            </Link>
          </div>

          {/* Stats */}
          <div className="hero-stats animate-hero-5">
            {[
              { val: fmt(totalBooks),   label: "Books" },
              { val: fmt(totalFatawa),  label: "Fatawa" },
              { val: "Free",             label: "Always" },
            ].map((s) => (
              <div key={s.label} className="hero-stat">
                <span className="hero-stat-val">{s.val}</span>
                <span className="hero-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — book stack */}
        <div className="hero-visual animate-hero-visual" aria-hidden>
          <BookStack />
        </div>
      </div>

      {/* Scroll hint */}
      <a href="#features" className="hero-scroll animate-hero-scroll">
        <span>Scroll</span>
        <ChevronDown size={15} className="hero-scroll-arrow" />
      </a>

      <style>{`
        .hero-section {
          min-height: 100svh;
          display: flex; flex-direction: column; justify-content: center;
          position: relative; overflow: hidden;
          background: var(--parchment-50);
          padding-top: 66px;
        }

        /* deco */
        .hero-deco {
          position: absolute; inset: 0; pointer-events: none;
          will-change: transform;
        }
        .hero-deco-circle {
          position: absolute; border-radius: 50%;
        }
        .hero-deco-circle--a {
          top: -18%; right: -10%; width: 52vw; max-width: 680px; aspect-ratio: 1;
          background: radial-gradient(circle, var(--violet-100) 0%, transparent 70%);
          opacity: 0.65;
        }
        .hero-deco-circle--b {
          bottom: 0; left: -8%; width: 32vw; max-width: 400px; aspect-ratio: 1;
          background: radial-gradient(circle, var(--parchment-200) 0%, transparent 70%);
        }
        .hero-deco-lines {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.3;
        }
        .hero-watermark {
          position: absolute; right: 4%; bottom: 8%;
          font-family: var(--font-display); font-size: clamp(4rem, 8vw, 8rem);
          color: var(--parchment-200); font-weight: 400; line-height: 1;
          direction: rtl; user-select: none; letter-spacing: 0.1em;
        }

        /* layout */
        .hero-inner {
          max-width: var(--container); margin: 0 auto; width: 100%;
          padding: clamp(3rem,6vw,5rem) clamp(1.25rem,4vw,2.5rem);
          display: grid; grid-template-columns: 1fr 1fr;
          gap: clamp(3rem,6vw,5rem); align-items: center;
          position: relative; z-index: 1;
        }

        /* badge */
        .hero-badge {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: var(--violet-50); border: 1px solid var(--violet-100);
          border-radius: 999px; padding: 0.375rem 0.875rem 0.375rem 0.625rem;
          margin-bottom: 1.5rem;
        }
        .hero-badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--violet-500);
          animation: pulse 2.5s ease-in-out infinite;
        }
        .hero-badge span:last-child {
          font-family: var(--font-ui); font-size: 0.72rem;
          font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--violet-600);
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }

        /* headline */
        .hero-h1 {
          font-family: var(--font-display);
          font-size: clamp(2.5rem, 5.5vw, 4.75rem);
          font-weight: 800; line-height: 1.04;
          letter-spacing: -0.03em;
          color: var(--ink-800);
          margin-bottom: 1.25rem;
        }
        .hero-h1-em {
          color: var(--violet-500); position: relative;
          font-style: italic; display: inline-block;
        }
        .hero-h1-underline {
          position: absolute; bottom: -4px; left: 0;
          width: 100%; height: 10px; overflow: visible;
        }

        /* body */
        .hero-body {
          font-family: var(--font-body); font-size: clamp(1rem,1.8vw,1.15rem);
          color: var(--ink-500); line-height: 1.8;
          max-width: 48ch; margin-bottom: 2rem;
        }

        /* ctas */
        .hero-ctas { display: flex; gap: 0.875rem; flex-wrap: wrap; margin-bottom: 2.75rem; }
        .hero-btn {
          display: inline-flex; align-items: center; gap: 0.4rem;
          padding: 0.8125rem 1.625rem; border-radius: var(--r-xl);
          font-family: var(--font-ui); font-size: 0.875rem; font-weight: 700;
          text-decoration: none; letter-spacing: -0.01em;
          transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
        }
        .hero-btn--primary {
          background: var(--ink-800); color: var(--parchment-50);
          box-shadow: 0 4px 16px rgba(26,22,16,0.2);
        }
        .hero-btn--primary:hover {
          background: var(--violet-600);
          transform: translateY(-3px);
          box-shadow: 0 10px 28px rgba(110,99,158,0.35);
        }
        .hero-btn--ghost {
          background: transparent; color: var(--ink-700);
          border: 1.5px solid var(--parchment-300);
        }
        .hero-btn--ghost:hover {
          border-color: var(--ink-600); background: var(--parchment-100);
          transform: translateY(-2px);
        }

        /* stats */
        .hero-stats { display: flex; gap: 2rem; }
        .hero-stat { display: flex; flex-direction: column; }
        .hero-stat-val {
          font-family: var(--font-display); font-size: clamp(1.5rem,2.5vw,2rem);
          font-weight: 700; letter-spacing: -0.04em; line-height: 1;
          color: var(--ink-800);
        }
        .hero-stat-label {
          font-family: var(--font-ui); font-size: 0.65rem;
          font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--ink-400); margin-top: 0.25rem;
        }

        /* visual */
        .hero-visual {
          display: flex; justify-content: center; align-items: center;
          position: relative;
        }

        /* scroll hint */
        .hero-scroll {
          position: absolute; bottom: 1.75rem; left: 50%; transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 0.375rem;
          color: var(--ink-300); text-decoration: none;
          font-family: var(--font-ui); font-size: 0.65rem;
          font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
          z-index: 1; transition: color 0.2s;
        }
        .hero-scroll:hover { color: var(--ink-500); }
        .hero-scroll-arrow { animation: bounceY 2s ease-in-out infinite; }
        @keyframes bounceY {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(4px); }
        }

        /* entrance animations */
        .animate-hero-1 { animation: fadeUp 0.6s 0.05s ease both; }
        .animate-hero-2 { animation: fadeUp 0.7s 0.12s ease both; }
        .animate-hero-3 { animation: fadeUp 0.6s 0.22s ease both; }
        .animate-hero-4 { animation: fadeUp 0.6s 0.3s  ease both; }
        .animate-hero-5 { animation: fadeUp 0.6s 0.38s ease both; }
        .animate-hero-visual { animation: fadeUp 0.8s 0.2s ease both; }
        .animate-hero-scroll { animation: fadeIn 1s 1.1s ease both; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }

        /* responsive */
        @media (max-width: 899px) {
          .hero-inner { grid-template-columns: 1fr; }
          .hero-visual { display: none; }
          .hero-h1 { font-size: clamp(2.25rem, 7vw, 3.5rem); }
        }
        @media (max-width: 599px) {
          .hero-watermark { display: none; }
          .hero-stats { gap: 1.25rem; }
        }
      `}</style>
    </section>
  );
}

/* ── Book Stack ───────────────────────────────── */
function BookStack() {
  const books = [
    { title: "مجموع الفتاوى",      color: "#c8c2e0", spine: "#9d95c4", angle: -9,  x: -42, y: 18  },
    { title: "صحيح البخاري",       color: "#b8d4b8", spine: "#8ab28a", angle:  5,  x:  22, y: -14 },
    { title: "إحياء علوم الدين",   color: "#e8b89c", spine: "#c08060", angle: -3,  x: -12, y:  38 },
    { title: "رياض الصالحين",      color: "#dfc88a", spine: "#b8a060", angle:  7,  x:  48, y: -28 },
    { title: "تفسير ابن كثير",     color: "#b5c8d8", spine: "#88a8c0", angle: -1,  x:   4, y:   8 },
  ];

  return (
    <div style={{ position: "relative", width: 300, height: 380 }}>
      {books.map((b, i) => (
        <div
          key={i}
          className="book-card"
          style={{
            position: "absolute", left: "50%", top: "50%",
            width: 170, height: 230, zIndex: i + 1,
            transform: `translate(calc(-50% + ${b.x}px), calc(-50% + ${b.y}px)) rotate(${b.angle}deg)`,
            borderRadius: "3px 12px 12px 3px",
            background: b.color,
            boxShadow: `${i + 3}px ${i + 6}px ${i * 4 + 14}px rgba(26,22,16,0.16), inset -6px 0 12px rgba(0,0,0,0.08)`,
            transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease",
            cursor: "default",
            display: "flex", flexDirection: "column",
            justifyContent: "space-between",
            padding: "1rem 0.875rem",
            overflow: "hidden",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.transform = `translate(calc(-50% + ${b.x}px), calc(-50% + ${b.y - 14}px)) rotate(${b.angle * 0.4}deg) scale(1.04)`;
            el.style.boxShadow = `${i + 6}px ${i + 14}px ${i * 5 + 24}px rgba(26,22,16,0.22)`;
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.transform = `translate(calc(-50% + ${b.x}px), calc(-50% + ${b.y}px)) rotate(${b.angle}deg)`;
            el.style.boxShadow = `${i + 3}px ${i + 6}px ${i * 4 + 14}px rgba(26,22,16,0.16), inset -6px 0 12px rgba(0,0,0,0.08)`;
          }}
        >
          {/* Spine */}
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 10, background: b.spine, opacity: 0.7 }} />
          {/* Top rule */}
          <div style={{ width: "100%", height: 2, background: "rgba(255,255,255,0.4)", borderRadius: 2 }} />
          {/* Title */}
          <div style={{
            fontFamily: "var(--font-display)", fontSize: "0.8rem", fontWeight: 700,
            color: "rgba(26,22,16,0.68)", textAlign: "center",
            lineHeight: 1.5, direction: "rtl", wordBreak: "break-word",
          }}>
            {b.title}
          </div>
          {/* Bottom rule */}
          <div style={{ width: "55%", margin: "0 auto", height: 2, background: "rgba(0,0,0,0.12)", borderRadius: 2 }} />
        </div>
      ))}

      <style>{`
        .book-card { animation: bookAppear 0.6s calc(var(--i, 0) * 80ms + 0.3s) ease both; }
        @keyframes bookAppear {
          from { opacity: 0; transform: translate(-50%, calc(-50% + 30px)) rotate(0deg) scale(0.9); }
        }
      `}</style>
    </div>
  );
}
