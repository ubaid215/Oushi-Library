import { BookOpen, Download, Search, Globe, ScrollText, Shield } from "lucide-react";

const features = [
  { Icon: BookOpen,   title: "Curated Collection",  body: "Every book and fatwa is carefully reviewed before being added.",        clr: "var(--violet-500)", bg: "var(--violet-50)"  },
  { Icon: Download,   title: "Free to Download",    body: "Every PDF is freely available. No account, no paywall, no signup.",      clr: "var(--sage-500)",   bg: "var(--sage-50)"    },
  { Icon: Search,     title: "Powerful Search",     body: "Find what you need across books, fatawa, and authors — instantly.",      clr: "var(--terra-500)",  bg: "var(--terra-50)"   },
  { Icon: Globe,      title: "Multiple Languages",  body: "Urdu, Arabic, English, and Farsi — serving the global Muslim world.",    clr: "var(--gold-500)",   bg: "var(--gold-50)"    },
  { Icon: ScrollText, title: "Scholarly Fatawa",    body: "An archive organized by topic, author, and school of thought.",          clr: "var(--violet-500)", bg: "var(--violet-50)"  },
  { Icon: Shield,     title: "Trusted Sources",     body: "Works sourced from reputable publishers and academic institutions only.", clr: "var(--sage-500)",   bg: "var(--sage-50)"    },
];

export default function WhyBibliotheca() {
  return (
    <section id="features" className="wy">
      <div className="wy-rule" aria-hidden />
      <div className="wy-inner">
        <div className="wy-header">
          <p className="wy-eyebrow">Why Oushi-Books</p>
          <h2 className="wy-h2">
            A library built for{" "}
            <em style={{ fontStyle: "italic", color: "var(--violet-500)" }}>seekers of knowledge</em>
          </h2>
          <p className="wy-sub">
            We believe Islamic knowledge should be freely accessible to everyone. No paywalls, no subscriptions.
          </p>
        </div>

        <div className="wy-grid">
          {features.map(({ Icon, title, body, clr, bg }) => (
            <div key={title} className="wy-card">
              <div className="wy-icon" style={{ background: bg, color: clr }}>
                <Icon size={20} strokeWidth={1.75} />
              </div>
              <h3 className="wy-card-title">{title}</h3>
              <p className="wy-card-body">{body}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .wy {
          padding: var(--section-y) 0;
          background: var(--parchment-50);
          position: relative;
        }
        .wy-rule {
          position: absolute; top: 0; left: 50%; transform: translateX(-50%);
          width: 65%; max-width: 500px; height: 1px;
          background: linear-gradient(90deg, transparent, var(--parchment-300), transparent);
        }
        .wy-inner {
          max-width: var(--container); margin: 0 auto;
          padding: 0 clamp(1.25rem,4vw,2.5rem);
        }
        .wy-header {
          text-align: center;
          margin-bottom: clamp(2.5rem,5vw,4rem);
          max-width: 560px; margin-left: auto; margin-right: auto;
        }
        .wy-eyebrow {
          font-family: var(--font-ui); font-size: 0.68rem;
          font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--violet-500); margin-bottom: 0.75rem;
        }
        .wy-h2 {
          font-family: var(--font-display);
          font-size: clamp(1.75rem,3.5vw,2.75rem);
          font-weight: 700; letter-spacing: -0.03em;
          color: var(--ink-800); line-height: 1.1; margin-bottom: 0.875rem;
        }
        .wy-sub {
          font-family: var(--font-body); font-size: 0.95rem;
          color: var(--ink-400); line-height: 1.75;
        }
        .wy-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1.125rem;
        }
        .wy-card {
          background: white; border: 1px solid var(--parchment-200);
          border-radius: var(--r-2xl); padding: 1.75rem 1.5rem;
          display: flex; flex-direction: column; gap: 0.875rem;
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease, border-color 0.25s;
          cursor: default;
        }
        .wy-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
          border-color: var(--parchment-300);
        }
        .wy-icon {
          width: 48px; height: 48px; border-radius: var(--r-lg);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .wy-card-title {
          font-family: var(--font-display); font-size: 1.05rem;
          font-weight: 600; letter-spacing: -0.02em; color: var(--ink-800);
        }
        .wy-card-body {
          font-family: var(--font-body); font-size: 0.875rem;
          color: var(--ink-500); line-height: 1.75;
        }
        @media (max-width: 1023px) { .wy-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 599px)  { .wy-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}
