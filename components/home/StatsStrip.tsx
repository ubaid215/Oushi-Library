interface StatsProps {
  totalBooks?: number;
  totalFatawa?: number;
  totalAuthors?: number;
  totalDownloads?: number;
}

export default function StatsStrip({ totalBooks = 2400, totalFatawa = 8000, totalAuthors = 400, totalDownloads = 0 }: StatsProps) {
  const stats = [
    { val: totalBooks.toLocaleString() + "+",   label: "Books in Library" },
    { val: totalFatawa.toLocaleString() + "+",  label: "Scholarly Fatawa" },
    { val: totalAuthors.toLocaleString() + "+", label: "Authors" },
    { val: "Free",                               label: "Always & Forever" },
  ];

  return (
    <div className="ss">
      <div className="ss-inner">
        {stats.map((s, i) => (
          <div key={i} className="ss-item">
            <span className="ss-val">{s.val}</span>
            <span className="ss-label">{s.label}</span>
          </div>
        ))}
      </div>
      <style>{`
        .ss {
          background: var(--parchment-100);
          border-top: 1px solid var(--parchment-200);
          border-bottom: 1px solid var(--parchment-200);
        }
        .ss-inner {
          max-width: var(--container); margin: 0 auto;
          padding: 0 clamp(1.25rem,4vw,2.5rem);
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 0;
        }
        .ss-item {
          display: flex; flex-direction: column; align-items: center;
          padding: 1.5rem 1rem;
          border-right: 1px solid var(--parchment-200);
        }
        .ss-item:last-child { border-right: none; }
        .ss-val {
          font-family: var(--font-display); font-size: clamp(1.5rem,3vw,2.25rem);
          font-weight: 700; letter-spacing: -0.04em; line-height: 1;
          color: var(--ink-800);
        }
        .ss-label {
          font-family: var(--font-ui); font-size: 0.68rem;
          font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--ink-400); margin-top: 0.375rem;
        }
        @media (max-width: 767px) {
          .ss-inner { grid-template-columns: repeat(2, 1fr); }
          .ss-item:nth-child(2) { border-right: none; }
          .ss-item:nth-child(1), .ss-item:nth-child(2) { border-bottom: 1px solid var(--parchment-200); }
        }
        @media (max-width: 399px) {
          .ss-inner { grid-template-columns: 1fr; }
          .ss-item { border-right: none; border-bottom: 1px solid var(--parchment-200); }
          .ss-item:last-child { border-bottom: none; }
          .ss-item:nth-child(1), .ss-item:nth-child(2) { border-right: none; }
        }
      `}</style>
    </div>
  );
}
