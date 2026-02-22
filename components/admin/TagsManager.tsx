"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, Tag, Loader2 } from "lucide-react";
import { createSlug } from "@/lib/utils";

interface TagItem {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export default function TagsManager({ initialTags }: { initialTags: TagItem[] }) {
  const [tags, setTags] = useState<TagItem[]>(initialTags);
  const [newTag, setNewTag] = useState("");
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const createTag = async () => {
    if (!newTag.trim()) return;
    setCreating(true);

    try {
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTag.trim(), slug: createSlug(newTag.trim()) }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create tag");

      setTags((prev) => [data, ...prev]);
      setNewTag("");
      toast.success(`Tag "${data.name}" created!`);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setCreating(false);
    }
  };

  const deleteTag = async (tag: TagItem) => {
    if (!confirm(`Delete tag "${tag.name}"? This will remove it from all content.`)) return;

    setDeletingId(tag.id);
    try {
      const res = await fetch(`/api/tags/${tag.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete tag");

      setTags((prev) => prev.filter((t) => t.id !== tag.id));
      toast.success(`Tag "${tag.name}" deleted`);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">
      {/* Create Tag */}
      <div className="card" style={{ position: "sticky", top: "calc(var(--topbar-height) + var(--space-6))" }}>
        <div className="card__header">
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", color: "var(--color-text-primary)" }}>
            New Tag
          </h3>
        </div>
        <div className="card__body" style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <div className="form-group">
            <label className="form-label">Tag Name</label>
            <input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createTag()}
              className="input"
              placeholder="e.g. Fiqh, Hadith..."
            />
            {newTag && (
              <p className="form-hint">Slug: {createSlug(newTag)}</p>
            )}
          </div>
          <button
            onClick={createTag}
            disabled={creating || !newTag.trim()}
            className="btn btn--primary btn--full"
          >
            {creating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            Create Tag
          </button>
        </div>
      </div>

      {/* Tags List */}
      <div className="card">
        <div className="card__header">
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", color: "var(--color-text-primary)" }}>
            All Tags
          </h3>
          <span className="badge badge--default">{tags.length} tags</span>
        </div>
        <div className="card__body">
          {tags.length === 0 ? (
            <div className="empty-state" style={{ padding: "var(--space-10)" }}>
              <Tag size={36} style={{ opacity: 0.2, margin: "0 auto var(--space-4)" }} />
              <p className="empty-state__title">No tags yet</p>
              <p className="empty-state__body">Create your first tag on the left.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                    background: "var(--color-parchment-100)",
                    border: "1px solid var(--color-border-subtle)",
                    borderRadius: "var(--radius-full)",
                    padding: "var(--space-1-5) var(--space-3)",
                    fontSize: "var(--text-sm)",
                  }}
                >
                  <span style={{ color: "var(--color-text-primary)", fontWeight: 500 }}>
                    {tag.name}
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      background: "var(--color-dusty-100)",
                      color: "var(--color-dusty-600)",
                      borderRadius: "var(--radius-full)",
                      padding: "1px 6px",
                      fontWeight: 600,
                    }}
                  >
                    {tag.count}
                  </span>
                  <button
                    onClick={() => deleteTag(tag)}
                    disabled={deletingId === tag.id}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      padding: 2,
                      display: "flex",
                      alignItems: "center",
                      color: "var(--color-text-tertiary)",
                      transition: "color var(--duration-fast)",
                    }}
                    title="Delete tag"
                  >
                    {deletingId === tag.id ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Trash2 size={12} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
