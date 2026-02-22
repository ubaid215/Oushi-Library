"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { X, FileText, CheckCircle2, Loader2, AlertCircle, Eye } from "lucide-react";
import { createSlug, formatFileSize } from "@/lib/utils";
import { RichTextEditor } from "./RichTextEditor";
import type { FatwaFormData } from "@/types";

const fatwaSchema = z.object({
    title: z.string().min(2, "Title is required"),
    slug: z.string().optional(),
    question: z.string().min(10, "Question is required"),
    answer: z.string().min(10, "Answer is required"),
    language: z.string().default("ur"),
    status: z.enum(["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
    authorId: z.string().min(1, "Author is required"),
    categoryId: z.string().min(1, "Category is required"),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    seoKeywords: z.array(z.string()).default([]),
    isPublished: z.boolean().default(false),
    tagIds: z.array(z.string()).default([]),
});

type FatwaFormValues = z.infer<typeof fatwaSchema>;

interface FatwaFormProps {
    mode: "create" | "edit";
    initialData?: Partial<FatwaFormValues & { id: string; pdfFileId?: string | null }>;
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

export default function FatwaForm({ mode, initialData, authors, categories, tags }: FatwaFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pdfFile, setPdfFile] = useState<UploadedFile | null>(null);
    const [pdfUploading, setPdfUploading] = useState(false);
    const [pdfDragging, setPdfDragging] = useState(false);
    const [selectedTags, setSelectedTags] = useState<string[]>(initialData?.tagIds ?? []);
    const [keywordInput, setKeywordInput] = useState("");

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        control,
        formState: { errors },
    } = useForm<FatwaFormValues>({
        resolver: zodResolver(fatwaSchema) as any,
        defaultValues: {
            title: initialData?.title ?? "",
            slug: initialData?.slug ?? "",
            question: initialData?.question ?? "",
            answer: initialData?.answer ?? "",
            language: initialData?.language ?? "ur",
            status: initialData?.status ?? "DRAFT",
            authorId: initialData?.authorId ?? "",
            categoryId: initialData?.categoryId ?? "",
            seoTitle: initialData?.seoTitle ?? "",
            seoDescription: initialData?.seoDescription ?? "",
            seoKeywords: initialData?.seoKeywords ?? [],
            isPublished: initialData?.isPublished ?? false,
        },
    });

    const title = watch("title");
    const seoKeywords = watch("seoKeywords");

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setValue("title", val);
        if (mode === "create") {
            setValue("slug", createSlug(val));
        }
    };

    const uploadPdf = async (file: File) => {
        if (!file.type.includes("pdf")) {
            toast.error("Only PDF files are allowed");
            return;
        }

        const MAX_MB = 20;
        if (file.size > MAX_MB * 1024 * 1024) {
            toast.error(`File too large. Maximum ${MAX_MB}MB before compression.`);
            return;
        }

        setPdfUploading(true);
        const tid = toast.loading("Uploading PDF...");

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

            toast.success("PDF uploaded!", { id: tid });
        } catch (err) {
            toast.error((err as Error).message, { id: tid });
        } finally {
            setPdfUploading(false);
        }
    };

    const onSubmit = async (values: FatwaFormValues) => {
        setIsSubmitting(true);
        const tid = toast.loading(mode === "create" ? "Creating fatwa..." : "Updating fatwa...");

        try {
            const payload: Omit<FatwaFormData, "seoKeywords"> & { seoKeywords?: string[] } = {
                ...values,
                pdfFileId: pdfFile?.fileId ?? initialData?.pdfFileId ?? null,
                tagIds: selectedTags,
                slug: values.slug || createSlug(values.title),
                seoKeywords: values.seoKeywords,
            };

            const url = mode === "create" ? "/api/fatawa" : `/api/fatawa/${initialData?.id}`;
            const method = mode === "create" ? "POST" : "PUT";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to save fatwa");

            toast.success(
                mode === "create" ? "Fatwa created successfully!" : "Fatwa updated!",
                { id: tid }
            );

            router.push(`/admin/fatawa/${data.slug}`);
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

    const handleKeywordAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && keywordInput.trim() !== "") {
            e.preventDefault();
            const newKeywords = [...seoKeywords, keywordInput.trim()];
            setValue("seoKeywords", newKeywords);
            setKeywordInput("");
        }
    };

    const removeKeyword = (idx: number) => {
        const newKeywords = seoKeywords.filter((_, i) => i !== idx);
        setValue("seoKeywords", newKeywords);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit as any)} className="fatwa-form">
            <div className="fatwa-form__layout">
                <div className="fatwa-form__main">
                    {/* Basic Information */}
                    <div className="card">
                        <div className="card__header">
                            <h3 className="card__title">Fatwa Focus</h3>
                        </div>
                        <div className="card__body">
                            <div className="form-group">
                                <label className="form-label form-label--required">Title / Subject</label>
                                <input
                                    {...register("title")}
                                    onChange={handleTitleChange}
                                    className={`input ${errors.title ? "input--error" : ""}`}
                                    placeholder="Short, descriptive title..."
                                />
                                {errors.title && <p className="form-error">{errors.title.message}</p>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Slug (URL)</label>
                                <input {...register("slug")} className="input" placeholder="auto-generated-from-title" />
                            </div>

                            <div className="form-group">
                                <label className="form-label form-label--required">Question</label>
                                <Controller
                                    name="question"
                                    control={control}
                                    render={({ field }) => (
                                        <div className={errors.question ? "input--error" : ""}>
                                            <RichTextEditor
                                                value={field.value}
                                                onChange={field.onChange}
                                                minHeight="100px"
                                            />
                                        </div>
                                    )}
                                />
                                {errors.question && <p className="form-error">{errors.question.message}</p>}
                            </div>

                            <div className="form-group">
                                <label className="form-label form-label--required">Answer</label>
                                <Controller
                                    name="answer"
                                    control={control}
                                    render={({ field }) => (
                                        <div className={errors.answer ? "input--error" : ""}>
                                            <RichTextEditor
                                                value={field.value}
                                                onChange={field.onChange}
                                                minHeight="300px"
                                            />
                                        </div>
                                    )}
                                />
                                {errors.answer && <p className="form-error">{errors.answer.message}</p>}
                            </div>
                        </div>
                    </div>

                    {/* SEO Metadata Card */}
                    <div className="card">
                        <div className="card__header">
                            <h3 className="card__title">SEO & Metadata</h3>
                        </div>
                        <div className="card__body">
                            <div className="form-group">
                                <label className="form-label">SEO Title</label>
                                <input {...register("seoTitle")} className="input" placeholder="Optimized title for search engines..." />
                            </div>
                            <div className="form-group">
                                <label className="form-label">SEO Description</label>
                                <textarea {...register("seoDescription")} className="textarea" rows={3} placeholder="Meta description..." />
                            </div>
                            <div className="form-group">
                                <label className="form-label">SEO Keywords</label>
                                <input
                                    type="text"
                                    value={keywordInput}
                                    onChange={(e) => setKeywordInput(e.target.value)}
                                    onKeyDown={handleKeywordAdd}
                                    className="input"
                                    placeholder="Type a keyword and hit Enter..."
                                />
                                <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-2)", flexWrap: "wrap" }}>
                                    {seoKeywords.map((kw, idx) => (
                                        <span key={idx} className="badge bg-dusty-100 text-dusty-600" style={{ display: "flex", alignItems: "center", gap: "var(--space-1)", padding: "2px var(--space-2)", borderRadius: "var(--radius-sm)", fontSize: "var(--text-xs)" }}>
                                            {kw}
                                            <button type="button" onClick={() => removeKeyword(idx)} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", opacity: 0.7 }}>
                                                <X size={12} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card__header">
                            <h3 className="card__title">Optional PDF Document</h3>
                        </div>
                        <div className="card__body">
                            {pdfFile || initialData?.pdfFileId ? (
                                <div className="upload-success">
                                    <CheckCircle2 size={24} className="upload-success__icon" />
                                    <div className="upload-success__info">
                                        <p className="upload-success__name">{pdfFile?.name || "Original PDF attached"}</p>
                                    </div>
                                    <button type="button" onClick={() => setPdfFile(null)} className="btn btn--ghost btn--icon-sm"><X size={14} /></button>
                                </div>
                            ) : (
                                <label
                                    className={`file-upload ${pdfDragging ? "file-upload--active" : ""}`}
                                    onDragOver={(e) => { e.preventDefault(); setPdfDragging(true); }}
                                    onDragLeave={() => setPdfDragging(false)}
                                    onDrop={(e) => { e.preventDefault(); setPdfDragging(false); const f = e.dataTransfer.files[0]; if (f) uploadPdf(f); }}
                                >
                                    <input type="file" accept=".pdf" className="file-upload__input" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadPdf(f); }} disabled={pdfUploading} />
                                    {pdfUploading ? (
                                        <Loader2 size={36} className="file-upload__spinner" />
                                    ) : (
                                        <>
                                            <FileText size={36} className="file-upload__icon" />
                                            <p className="file-upload__title">Attach related PDF (Optional)</p>
                                        </>
                                    )}
                                </label>
                            )}
                        </div>
                    </div>

                </div>

                {/* Sidebar */}
                <div className="fatwa-form__sidebar">
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
                                <label className="checkbox-item" style={{ display: "flex", gap: "var(--space-2)", alignItems: "center", marginTop: "var(--space-3)" }}>
                                    <input type="checkbox" {...register("isPublished")} />
                                    <span className="checkbox-item__label">Publicly visible</span>
                                </label>
                            </div>

                            {mode === "edit" && initialData?.slug && (
                                <a
                                    href={`/fatawa/${initialData.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn--outline btn--full"
                                    style={{ marginTop: "var(--space-4)", display: "flex", justifyContent: "center", gap: "var(--space-2)" }}
                                >
                                    <Eye size={16} /> Preview on Website
                                </a>
                            )}
                            <button type="submit" disabled={isSubmitting} className="btn btn--primary btn--full" style={{ marginTop: "var(--space-2)" }}>
                                {isSubmitting ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : mode === "create" ? "Publish Fatwa" : "Update"}
                            </button>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card__header">
                            <h3 className="card__title">Classification</h3>
                        </div>
                        <div className="card__body">
                            <div className="form-group">
                                <label className="form-label form-label--required">Mufti / Author</label>
                                <select {...register("authorId")} className={`select ${errors.authorId ? "input--error" : ""}`}>
                                    <option value="">Select author...</option>
                                    {authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                                </select>
                                {errors.authorId && <p className="form-error">{errors.authorId.message}</p>}
                            </div>

                            <div className="form-group">
                                <label className="form-label form-label--required">Category</label>
                                <select {...register("categoryId")} className={`select ${errors.categoryId ? "input--error" : ""}`}>
                                    <option value="">Select category...</option>
                                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                {errors.categoryId && <p className="form-error">{errors.categoryId.message}</p>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Language</label>
                                <select {...register("language")} className="select">
                                    <option value="ur">اردو</option>
                                    <option value="ar">عربي</option>
                                    <option value="en">English</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card__header">
                            <h3 className="card__title">Tags</h3>
                        </div>
                        <div className="card__body">
                            <div className="tags-container" style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                                {tags.map((tag) => (
                                    <button
                                        key={tag.id}
                                        type="button"
                                        onClick={() => toggleTag(tag.id)}
                                        className={`tag ${selectedTags.includes(tag.id) ? "tag--active" : ""}`}
                                        style={{
                                            padding: "var(--space-1) var(--space-3)",
                                            borderRadius: "var(--radius-full)",
                                            fontSize: "var(--text-xs)",
                                            border: `1px solid ${selectedTags.includes(tag.id) ? "var(--color-dusty-400)" : "var(--color-border-subtle)"}`,
                                            background: selectedTags.includes(tag.id) ? "var(--color-dusty-100)" : "transparent",
                                            color: selectedTags.includes(tag.id) ? "var(--color-dusty-600)" : "var(--color-text-secondary)",
                                            cursor: "pointer",
                                            transition: "all var(--duration-fast) ease"
                                        }}
                                    >
                                        {tag.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .fatwa-form { width: 100%; }
        .fatwa-form__layout { display: grid; grid-template-columns: 1fr 320px; gap: var(--space-6); align-items: start; }
        .fatwa-form__main { display: flex; flex-direction: column; gap: var(--space-6); }
        .fatwa-form__sidebar { display: flex; flex-direction: column; gap: var(--space-5); position: sticky; top: calc(var(--topbar-height) + var(--space-6)); }
        
        .card { background: var(--color-surface); border: 1px solid var(--color-border-subtle); border-radius: var(--radius-xl); box-shadow: var(--shadow-xs); }
        .card__header { padding: var(--space-5) var(--space-6); border-bottom: 1px solid var(--color-border-subtle); background: var(--color-surface-raised); }
        .card__title { font-family: var(--font-display); font-size: var(--text-lg); font-weight: var(--font-semibold); margin: 0; }
        .card__body { padding: var(--space-6); display: flex; flex-direction: column; gap: var(--space-5); }
        
        .form-group { display: flex; flex-direction: column; gap: var(--space-1-5); }
        .form-label { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--color-text-primary); }
        .form-label--required::after { content: "*"; color: var(--color-error); margin-left: var(--space-1); }
        .form-error { font-size: var(--text-xs); color: var(--color-error); margin-top: var(--space-1); }
        
        .input, .textarea, .select {
          width: 100%; font-family: var(--font-body); font-size: var(--text-sm);
          padding: var(--space-2-5) var(--space-4); border: 1px solid var(--color-border);
          border-radius: var(--radius-lg); background: var(--color-surface);
          transition: border-color var(--duration-base);
        }
        .input:focus, .textarea:focus, .select:focus { outline: none; border-color: var(--color-dusty-400); box-shadow: 0 0 0 3px rgba(110, 99, 158, 0.15); }
        .input--error { border-color: var(--color-error); }
        .select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b6259' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right var(--space-4) center; }

        .file-upload { display: flex; flex-direction: column; align-items: center; justify-content: center; border: 2px dashed var(--color-border); border-radius: var(--radius-xl); padding: var(--space-8); cursor: pointer; text-align: center; }
        .file-upload--active { border-color: var(--color-dusty-400); background: var(--color-dusty-50); }
        .file-upload__input { display: none; }
        .file-upload__icon { color: var(--color-dusty-400); margin-bottom: var(--space-3); }
        .file-upload__title { font-size: var(--text-sm); font-weight: var(--font-semibold); margin-bottom: var(--space-1); }
        .file-upload__spinner { color: var(--color-dusty-400); animation: spin 0.7s linear infinite; }
        
        .upload-success { display: flex; alignItems: center; gap: var(--space-4); padding: var(--space-4); background: var(--color-success-subtle); border-radius: var(--radius-xl); border: 1px solid var(--color-success-border); }
        .upload-success__icon { color: var(--color-sage-500); }
        .upload-success__info { flex: 1; min-width: 0; }
        .upload-success__name { font-size: var(--text-sm); font-weight: var(--font-semibold); margin: 0; overflow: hidden; text-overflow: ellipsis; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
        </form>
    );
}
