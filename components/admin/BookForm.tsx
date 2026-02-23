"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Upload, X, FileText, Image, CheckCircle2, Loader2, AlertCircle, Eye } from "lucide-react";
import { createSlug, formatFileSize } from "@/lib/utils";
import type { BookFormData } from "@/types";

const bookSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z.string().optional(),
  description: z.string().optional(),
  language: z.string().default("ur"),
  isbn: z.string().optional(),
  publisher: z.string().optional(),
  edition: z.string().optional(),
  status: z.enum(["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  authorId: z.string().min(1, "Author is required"),
  categoryId: z.string().optional(),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  tagIds: z.array(z.string()).default([]),
});

type BookFormValues = z.infer<typeof bookSchema>;

interface BookFormProps {
  mode: "create" | "edit";
  initialData?: Partial<BookFormValues & { id: string; pdfFileId: string; coverImageId: string }>;
  authors: { id: string; name: string }[];
  categories: { id: string; name: string; parentId: string | null }[];
  tags: { id: string; name: string }[];
}

interface UploadedFile {
  fileId: string;
  url: string;
  name: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio?: number;
}

export default function BookForm({ mode, initialData, authors, categories, tags }: BookFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pdfFile, setPdfFile] = useState<UploadedFile | null>(null);
  const [coverFile, setCoverFile] = useState<UploadedFile | null>(null);
  const [pdfUploading, setPdfUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [pdfDragging, setPdfDragging] = useState(false);
  const [coverDragging, setCoverDragging] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialData?.tagIds ?? []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema) as any,
    defaultValues: {
      title: initialData?.title ?? "",
      slug: initialData?.slug ?? "",
      description: initialData?.description ?? "",
      language: initialData?.language ?? "ur",
      isbn: initialData?.isbn ?? "",
      publisher: initialData?.publisher ?? "",
      edition: initialData?.edition ?? "",
      status: initialData?.status ?? "DRAFT",
      authorId: initialData?.authorId ?? "",
      categoryId: initialData?.categoryId ?? "",
      isPublished: initialData?.isPublished ?? false,
      isFeatured: initialData?.isFeatured ?? false,
    },
  });

  const title = watch("title");

  // Auto-slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue("title", val);
    if (mode === "create") {
      setValue("slug", createSlug(val));
    }
  };

  // Upload PDF
  const uploadPdf = async (file: File) => {
    if (!file.type.includes("pdf")) {
      toast.error("Only PDF files are allowed");
      return;
    }

    const MAX_MB = 50; // Before compression
    if (file.size > MAX_MB * 1024 * 1024) {
      toast.error(`File too large. Maximum ${MAX_MB}MB before compression.`);
      return;
    }

    setPdfUploading(true);
    const tid = toast.loading("Compressing & uploading PDF...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "pdf");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed");

      setPdfFile({
        fileId: data.fileId,
        url: data.url,
        name: file.name,
        originalSize: data.size,
        compressedSize: data.compressedSize,
        compressionRatio: data.compressionRatio,
      });

      toast.success(
        `PDF uploaded! Compressed ${data.compressionRatio?.toFixed(1) ?? 0}% → ${formatFileSize(data.compressedSize)}`,
        { id: tid }
      );
    } catch (err) {
      toast.error((err as Error).message, { id: tid });
    } finally {
      setPdfUploading(false);
    }
  };

  // Upload Cover Image
  const uploadCover = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    setCoverUploading(true);
    const tid = toast.loading("Uploading cover image...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "image");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setCoverFile({
        fileId: data.fileId,
        url: data.url,
        name: file.name,
        originalSize: data.size,
        compressedSize: data.compressedSize,
      });

      toast.success("Cover uploaded!", { id: tid });
    } catch (err) {
      toast.error((err as Error).message, { id: tid });
    } finally {
      setCoverUploading(false);
    }
  };

  const onSubmit = async (values: BookFormValues) => {
    if (!pdfFile && !initialData?.pdfFileId) {
      toast.error("Please upload a PDF file");
      return;
    }

    setIsSubmitting(true);
    const tid = toast.loading(mode === "create" ? "Creating book..." : "Updating book...");

    try {
      const payload: BookFormData = {
        ...values,
        pdfFileId: pdfFile?.fileId ?? initialData?.pdfFileId ?? "",
        coverImageId: coverFile?.fileId ?? initialData?.coverImageId ?? undefined,
        tagIds: selectedTags,
        slug: values.slug || createSlug(values.title),
      };

      const url = mode === "create" ? "/api/books" : `/api/books/${initialData?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save book");

      toast.success(
        mode === "create" ? "Book created successfully!" : "Book updated!",
        { id: tid }
      );

      router.push(`/admin/books/${data.slug}`);
      router.refresh();
    } catch (err) {
      toast.error((err as Error).message, { id: tid });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="book-form">
      <div className="book-form__layout">
        {/* Main Content Area */}
        <div className="book-form__main">
          {/* Basic Information Card */}
          <div className="card">
            <div className="card__header">
              <h3 className="card__title">Book Information</h3>
            </div>
            <div className="card__body">
              <div className="form-group">
                <label className="form-label form-label--required">Title</label>
                <input
                  {...register("title")}
                  onChange={handleTitleChange}
                  className={`input ${errors.title ? "input--error" : ""}`}
                  placeholder="Book title..."
                />
                {errors.title && <p className="form-error">{errors.title.message}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Slug (URL)</label>
                <input {...register("slug")} className="input" placeholder="auto-generated-from-title" />
                <p className="form-hint">Leave blank to auto-generate from title</p>
              </div>

              <div className="form-group">
                <label className="form-label">Description (optional)</label>
                <textarea
                  {...register("description")}
                  className="textarea"
                  rows={5}
                  placeholder="Brief description of the book..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Publisher</label>
                  <input {...register("publisher")} className="input" placeholder="Publisher name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Edition</label>
                  <input {...register("edition")} className="input" placeholder="1st, 2nd..." />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">ISBN</label>
                  <input {...register("isbn")} className="input" placeholder="ISBN number" />
                </div>
                <div className="form-group">
                  <label className="form-label">Language</label>
                  <select {...register("language")} className="select">
                    <option value="ur">اردو</option>
                    <option value="ar">عربي</option>
                    <option value="en">English</option>
                    <option value="fa">فارسی</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* PDF Upload Card */}
          <div className="card">
            <div className="card__header">
              <h3 className="card__title">PDF File</h3>
            </div>
            <div className="card__body">
              {pdfFile || initialData?.pdfFileId ? (
                <div className="upload-success">
                  <CheckCircle2 size={24} className="upload-success__icon" />
                  <div className="upload-success__info">
                    <p className="upload-success__name">
                      {pdfFile?.name || "PDF uploaded"}
                    </p>
                    {pdfFile && (
                      <p className="upload-success__size">
                        {formatFileSize(pdfFile.originalSize)} → {formatFileSize(pdfFile.compressedSize)}
                        {pdfFile.compressionRatio ? ` (${pdfFile.compressionRatio.toFixed(1)}% compressed)` : ""}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setPdfFile(null)}
                    className="btn btn--ghost btn--icon-sm"
                    aria-label="Remove PDF"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <label
                    className={`file-upload ${pdfDragging ? "file-upload--active" : ""}`}
                    onDragOver={(e) => { e.preventDefault(); setPdfDragging(true); }}
                    onDragLeave={() => setPdfDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setPdfDragging(false);
                      const f = e.dataTransfer.files[0];
                      if (f) uploadPdf(f);
                    }}
                  >
                    <input
                      type="file"
                      accept=".pdf"
                      className="file-upload__input"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) uploadPdf(f);
                      }}
                      disabled={pdfUploading}
                    />
                    {pdfUploading ? (
                      <>
                        <Loader2 size={36} className="file-upload__spinner" />
                        <p className="file-upload__title">uploading...</p>
                        <p className="file-upload__hint">PDF is being optimized for Cloudinary free tier</p>
                      </>
                    ) : (
                      <>
                        <FileText size={36} className="file-upload__icon" />
                        <p className="file-upload__title">Drop PDF here or click to browse</p>
                        <p className="file-upload__hint">Maximum 10 mb file can be upload</p>
                      </>
                    )}
                  </label>
                </>
              )}
            </div>
          </div>

          {/* Tags Card */}
          <div className="card">
            <div className="card__header">
              <h3 className="card__title">Tags</h3>
            </div>
            <div className="card__body">
              <div className="tags-container">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`tag ${selectedTags.includes(tag.id) ? "tag--active" : ""}`}
                  >
                    {tag.name}
                  </button>
                ))}
                {tags.length === 0 && (
                  <p className="empty-tags-message">
                    No tags yet. <a href="/admin/tags" className="link">Create tags</a>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="book-form__sidebar">
          {/* Publish Card */}
          <div className="card">
            <div className="card__header">
              <h3 className="card__title">Publish</h3>
            </div>
            <div className="card__body">
              <div className="form-group">
                <label className="form-label">Status</label>
                <select {...register("status")} className="select">
                  <option value="DRAFT">Draft</option>
                  <option value="REVIEW">In Review</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>

              <div className="checkbox-group">
                <label className="checkbox-item">
                  <input type="checkbox" {...register("isPublished")} />
                  <span className="checkbox-item__label">Publicly visible</span>
                </label>
                <label className="checkbox-item">
                  <input type="checkbox" {...register("isFeatured")} />
                  <span className="checkbox-item__label">Featured book</span>
                </label>
              </div>

              {mode === "edit" && initialData?.slug && (
                <a
                  href={`/books/${initialData.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--outline btn--full"
                  style={{ marginBottom: "var(--space-3)", display: "flex", justifyContent: "center", gap: "var(--space-2)" }}
                >
                  <Eye size={16} /> Preview on Website
                </a>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn--primary btn--full"
              >
                {isSubmitting ? (
                  <><Loader2 size={14} className="animate-spin" /> Saving...</>
                ) : mode === "create" ? (
                  "Publish Book"
                ) : (
                  "Update Book"
                )}
              </button>
            </div>
          </div>

          {/* Author & Category Card */}
          <div className="card">
            <div className="card__header">
              <h3 className="card__title">Categorize</h3>
            </div>
            <div className="card__body">
              <div className="form-group">
                <label className="form-label form-label--required">Author</label>
                <select {...register("authorId")} className={`select ${errors.authorId ? "input--error" : ""}`}>
                  <option value="">Select author...</option>
                  {authors.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
                {errors.authorId && <p className="form-error">{errors.authorId.message}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select {...register("categoryId")} className="select">
                  <option value="">Select category...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Cover Image Card */}
          <div className="card">
            <div className="card__header">
              <h3 className="card__title">Cover Image</h3>
            </div>
            <div className="card__body">
              {coverFile || initialData?.coverImageId ? (
                <div className="cover-preview">
                  <img
                    src={coverFile?.url || `/api/files/${initialData?.coverImageId}`}
                    alt="Cover"
                    className="cover-preview__image"
                  />
                  <button
                    type="button"
                    onClick={() => setCoverFile(null)}
                    className="btn btn--secondary btn--xs cover-preview__remove"
                  >
                    <X size={12} /> Remove
                  </button>
                </div>
              ) : (
                <label
                  className={`file-upload file-upload--compact ${coverDragging ? "file-upload--active" : ""}`}
                  onDragOver={(e) => { e.preventDefault(); setCoverDragging(true); }}
                  onDragLeave={() => setCoverDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setCoverDragging(false);
                    const f = e.dataTransfer.files[0];
                    if (f) uploadCover(f);
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="file-upload__input"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) uploadCover(f);
                    }}
                    disabled={coverUploading}
                  />
                  {coverUploading ? (
                    <Loader2 size={24} className="file-upload__spinner" />
                  ) : (
                    <>
                      <Image size={24} className="file-upload__icon" />
                      <p className="file-upload__hint">
                        Drop image or click to upload
                      </p>
                    </>
                  )}
                </label>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .book-form {
          width: 100%;
        }

        .book-form__layout {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: var(--space-6);
          align-items: start;
        }

        .book-form__main {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .book-form__sidebar {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
          position: sticky;
          top: calc(var(--topbar-height) + var(--space-6));
        }

        .card {
          background: var(--color-surface);
          border: 1px solid var(--color-border-subtle);
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-xs);
        }

        .card__header {
          padding: var(--space-5) var(--space-6);
          border-bottom: 1px solid var(--color-border-subtle);
          background: var(--color-surface-raised);
        }

        .card__title {
          font-family: var(--font-display);
          font-size: var(--text-lg);
          font-weight: var(--font-semibold);
          color: var(--color-text-primary);
          margin: 0;
        }

        .card__body {
          padding: var(--space-6);
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--space-1-5);
          width: 100%;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-4);
        }

        .form-label {
          font-size: var(--text-sm);
          font-weight: var(--font-semibold);
          color: var(--color-text-primary);
        }

        .form-label--required::after {
          content: "*";
          color: var(--color-error);
          margin-left: var(--space-1);
        }

        .form-hint {
          font-size: var(--text-xs);
          color: var(--color-text-tertiary);
          margin-top: var(--space-1);
        }

        .form-error {
          font-size: var(--text-xs);
          color: var(--color-error);
          margin-top: var(--space-1);
        }

        .input,
        .select,
        .textarea {
          width: 100%;
          font-family: var(--font-body);
          font-size: var(--text-sm);
          color: var(--color-text-primary);
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--space-2-5) var(--space-4);
          transition: all var(--duration-base) var(--ease-default);
        }

        .input:focus,
        .select:focus,
        .textarea:focus {
          outline: none;
          border-color: var(--color-dusty-400);
          box-shadow: 0 0 0 3px rgba(110, 99, 158, 0.15);
        }

        .input--error {
          border-color: var(--color-error);
        }

        .select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b6259' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right var(--space-4) center;
        }

        .file-upload {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 2px dashed var(--color-border);
          border-radius: var(--radius-xl);
          padding: var(--space-8) var(--space-6);
          cursor: pointer;
          transition: all var(--duration-base) var(--ease-default);
          text-align: center;
        }

        .file-upload--compact {
          padding: var(--space-6);
        }

        .file-upload--active {
          border-color: var(--color-dusty-400);
          background: var(--color-dusty-50);
        }

        .file-upload__input {
          display: none;
        }

        .file-upload__icon {
          color: var(--color-dusty-400);
          margin-bottom: var(--space-3);
        }

        .file-upload__spinner {
          color: var(--color-dusty-400);
          margin-bottom: var(--space-3);
          animation: spin 0.7s linear infinite;
        }

        .file-upload__title {
          font-size: var(--text-sm);
          font-weight: var(--font-semibold);
          color: var(--color-text-primary);
          margin-bottom: var(--space-1);
        }

        .file-upload__hint {
          font-size: var(--text-xs);
          color: var(--color-text-tertiary);
        }

        .file-upload__types {
          font-size: var(--text-xs);
          color: var(--color-text-tertiary);
          margin-top: var(--space-2);
        }

        .upload-info {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-top: var(--space-3);
          padding: var(--space-3) var(--space-4);
          background: var(--color-info-subtle);
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-info-border);
        }

        .upload-info__icon {
          color: var(--color-dusty-500);
          flex-shrink: 0;
        }

        .upload-info__text {
          font-size: var(--text-xs);
          color: var(--color-dusty-600);
          margin: 0;
        }

        .upload-success {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          padding: var(--space-4);
          background: var(--color-success-subtle);
          border-radius: var(--radius-xl);
          border: 1px solid var(--color-success-border);
        }

        .upload-success__icon {
          color: var(--color-sage-500);
          flex-shrink: 0;
        }

        .upload-success__info {
          flex: 1;
          min-width: 0;
        }

        .upload-success__name {
          font-size: var(--text-sm);
          font-weight: var(--font-semibold);
          color: var(--color-text-primary);
          margin: 0 0 var(--space-1) 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .upload-success__size {
          font-size: var(--text-xs);
          color: var(--color-text-secondary);
          margin: 0;
        }

        .tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
        }

        .tag {
          display: inline-flex;
          align-items: center;
          padding: var(--space-1-5) var(--space-3);
          font-size: var(--text-xs);
          font-weight: var(--font-medium);
          color: var(--color-text-secondary);
          background: var(--color-parchment-100);
          border: 1px solid var(--color-border-subtle);
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-default);
        }

        .tag:hover {
          background: var(--color-dusty-100);
          color: var(--color-dusty-600);
          border-color: var(--color-dusty-200);
        }

        .tag--active {
          background: var(--color-dusty-500);
          color: white;
          border-color: var(--color-dusty-500);
        }

        .empty-tags-message {
          font-size: var(--text-sm);
          color: var(--color-text-tertiary);
          margin: 0;
        }

        .link {
          color: var(--color-dusty-500);
          text-decoration: none;
          font-weight: var(--font-medium);
        }

        .link:hover {
          color: var(--color-dusty-600);
          text-decoration: underline;
        }

        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .checkbox-item {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          cursor: pointer;
        }

        .checkbox-item input[type="checkbox"] {
          width: 16px;
          height: 16px;
          accent-color: var(--color-dusty-500);
        }

        .checkbox-item__label {
          font-size: var(--text-sm);
          color: var(--color-text-secondary);
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          font-family: var(--font-body);
          font-size: var(--text-sm);
          font-weight: var(--font-semibold);
          padding: var(--space-2-5) var(--space-5);
          border-radius: var(--radius-lg);
          border: 1px solid transparent;
          cursor: pointer;
          transition: all var(--duration-base) var(--ease-default);
        }

        .btn--primary {
          background: var(--color-dusty-500);
          color: white;
        }

        .btn--primary:hover:not(:disabled) {
          background: var(--color-dusty-600);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        .btn--secondary {
          background: var(--color-surface);
          color: var(--color-text-primary);
          border-color: var(--color-border);
        }

        .btn--secondary:hover:not(:disabled) {
          background: var(--color-parchment-100);
          border-color: var(--color-border-strong);
        }

        .btn--ghost {
          background: transparent;
          color: var(--color-text-secondary);
          border-color: transparent;
        }

        .btn--ghost:hover:not(:disabled) {
          background: var(--color-parchment-100);
          color: var(--color-text-primary);
        }

        .btn--xs {
          font-size: var(--text-xs);
          padding: var(--space-1-5) var(--space-3);
        }

        .btn--icon-sm {
          padding: var(--space-2);
          aspect-ratio: 1;
        }

        .btn--full {
          width: 100%;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .cover-preview {
          position: relative;
        }

        .cover-preview__image {
          width: 100%;
          border-radius: var(--radius-lg);
          aspect-ratio: 2 / 3;
          object-fit: cover;
          box-shadow: var(--shadow-md);
        }

        .cover-preview__remove {
          position: absolute;
          top: var(--space-2);
          right: var(--space-2);
        }

        .animate-spin {
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 1023px) {
          .book-form__layout {
            grid-template-columns: 1fr;
          }

          .book-form__sidebar {
            position: static;
          }
        }
      `}</style>
    </form>
  );
}