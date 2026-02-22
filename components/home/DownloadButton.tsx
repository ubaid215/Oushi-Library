"use client";

import { useState } from "react";
import { Download, CheckCircle2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface DownloadButtonProps {
  bookId: string;
  pdfUrl: string;
  title: string;
  fileSize?: number;
}

function fmtSize(bytes?: number): string {
  if (!bytes) return "";
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024).toFixed(0)} KB`;
}

export default function DownloadButton({ bookId, pdfUrl, title, fileSize }: DownloadButtonProps) {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  const handleDownload = async () => {
    setState("loading");

    try {
      // Track the download
      await fetch(`/api/books/${bookId}/download`, { method: "POST" }).catch(() => {});

      // Trigger file download
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `${title}.pdf`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setState("done");
      toast.success("Download started!", {
        icon: "📖",
        style: {
          fontFamily: "var(--font-ui)",
          borderRadius: "12px",
          background: "#1a1610",
          color: "#f8f2e6",
        },
      });

      setTimeout(() => setState("idle"), 3000);
    } catch {
      setState("idle");
      toast.error("Download failed. Try again.");
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={state === "loading"}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.625rem",
        padding: "1rem 1.5rem",
        background:
          state === "done"
            ? "var(--sage-500)"
            : "var(--violet-500)",
        color: "white",
        border: "none",
        borderRadius: "var(--r-lg)",
        fontFamily: "var(--font-ui)",
        fontSize: "1rem",
        fontWeight: 700,
        cursor: state === "loading" ? "wait" : "pointer",
        boxShadow:
          state === "done"
            ? "0 4px 16px rgba(106,143,106,0.35)"
            : "0 4px 20px rgba(110,99,158,0.4)",
        transition: "all 0.3s var(--ease)",
        transform: state === "idle" ? "translateY(0)" : "translateY(0)",
      }}
      onMouseOver={(e) => {
        if (state === "idle") {
          (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(110,99,158,0.5)";
        }
      }}
      onMouseOut={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.boxShadow = state === "done"
          ? "0 4px 16px rgba(106,143,106,0.35)"
          : "0 4px 20px rgba(110,99,158,0.4)";
      }}
    >
      {state === "loading" ? (
        <>
          <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
          Preparing…
        </>
      ) : state === "done" ? (
        <>
          <CheckCircle2 size={18} />
          Downloaded!
        </>
      ) : (
        <>
          <Download size={18} />
          Download Free PDF
          {fileSize ? ` · ${fmtSize(fileSize)}` : ""}
        </>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </button>
  );
}
