import Link from "next/link";
import { Download, Eye, BookOpen } from "lucide-react";

interface Book {
  id: string;
  title: string;
  slug: string;
  language: string;
  downloadCount: number;
  viewCount: number;
  publishYear: number | null;
  totalPages: number | null;
  author: { name: string; slug: string };
  category: { name: string; slug: string } | null;
  coverImage: { url: string } | null;
  tags: { tag: { name: string } }[];
}

const LANG_LABELS: Record<string, string> = {
  ur: "اردو", ar: "عربي", en: "EN", fa: "فارسی",
};

const COVER_PALETTES = [
  { from: "#eae8f2", to: "#b5afd0", text: "#6e639e" },
  { from: "#faeae6", to: "#e4a285", text: "#a04535" },
  { from: "#e4ede4", to: "#9dbf9d", text: "#4a6b4a" },
  { from: "#f8f2e0", to: "#d9bc85", text: "#7a5c10" },
  { from: "#f0edf8", to: "#9188b8", text: "#4e4574" },
  { from: "#fdf5f3", to: "#d47878", text: "#8b3939" },
];

function fmt(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

function CoverFallback({ title, index }: { title: string; index: number }) {
  const p = COVER_PALETTES[index % COVER_PALETTES.length];
  return (
    <div
      style={{
        height: "100%",
        background: `linear-gradient(155deg, ${p.from}, ${p.to})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem 1.25rem",
        textAlign: "center",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "2.5rem",
          fontWeight: 700,
          color: p.text,
          opacity: 0.4,
          lineHeight: 1,
          marginBottom: "0.75rem",
        }}
      >
        {title.charAt(0)}
      </span>
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "0.75rem",
          fontWeight: 600,
          color: p.text,
          opacity: 0.7,
          lineHeight: 1.35,
          display: "-webkit-box",
          WebkitLineClamp: 4,
          WebkitBoxOrient: "vertical" as any,
          overflow: "hidden",
        }}
      >
        {title}
      </p>
    </div>
  );
}

export default function BookGrid({ books }: { books: Book[] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        gap: "1.25rem",
      }}
    >
      {books.map((book, idx) => (
        <Link
          key={book.id}
          href={`/books/${book.slug}`}
          style={{ textDecoration: "none" }}
        >
          <article className="book-card" style={{ height: "100%" }}>
            {/* Cover */}
            <div className="book-cover" style={{ aspectRatio: "2/3" }}>
              {book.coverImage?.url ? (
                <img src={book.coverImage.url} alt={book.title} loading="lazy" />
              ) : (
                <CoverFallback title={book.title} index={idx} />
              )}
              {/* Language badge */}
              <div
                style={{
                  position: "absolute",
                  top: "0.625rem",
                  right: "0.625rem",
                  zIndex: 2,
                  background: "rgba(26,22,16,0.65)",
                  backdropFilter: "blur(4px)",
                  color: "rgba(255,255,255,0.9)",
                  fontSize: "0.625rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  padding: "0.1875rem 0.4375rem",
                  borderRadius: "4px",
                  fontFamily: "var(--font-ui)",
                }}
              >
                {LANG_LABELS[book.language] ?? book.language.toUpperCase()}
              </div>
            </div>

            {/* Info */}
            <div className="book-info">
              <h3 className="book-title">{book.title}</h3>
              <p className="book-author">{book.author.name}</p>
              {book.category && (
                <span
                  style={{
                    display: "inline-block",
                    fontFamily: "var(--font-ui)",
                    fontSize: "0.625rem",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--ink-400)",
                    background: "var(--parchment-100)",
                    padding: "2px 7px",
                    borderRadius: "4px",
                    alignSelf: "flex-start",
                  }}
                >
                  {book.category.name}
                </span>
              )}
              <div className="book-meta">
                <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                  <Download size={11} />
                  {fmt(book.downloadCount)}
                </span>
                {book.publishYear && (
                  <span style={{ color: "var(--ink-300)" }}>{book.publishYear}</span>
                )}
              </div>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}
