"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Loader2, Image as ImageIcon, X, User, Calendar, Globe, BookOpen } from "lucide-react";
import { createSlug } from "@/lib/utils";
import type { AuthorFormData } from "@/types";

const authorSchema = z.object({
    name: z.string().min(2, "Name is required"),
    slug: z.string().optional(),
    bio: z.string().optional(),
    birthYear: z.coerce.number().int().min(100).max(2100).optional().nullable(),
    deathYear: z.coerce.number().int().min(100).max(2100).optional().nullable(),
    nationality: z.string().optional(),
    isActive: z.boolean().default(true),
});

type AuthorFormValues = z.infer<typeof authorSchema>;

interface AuthorFormProps {
    mode: "create" | "edit";
    initialData?: Partial<AuthorFormValues & { id: string; imageId?: string | null }>;
}

export default function AuthorForm({ mode, initialData }: AuthorFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState<{ fileId: string; url: string } | null>(null);
    const [imageUploading, setImageUploading] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<AuthorFormValues>({
        resolver: zodResolver(authorSchema) as any,
        defaultValues: {
            name: initialData?.name ?? "",
            slug: initialData?.slug ?? "",
            bio: initialData?.bio ?? "",
            birthYear: initialData?.birthYear,
            deathYear: initialData?.deathYear,
            nationality: initialData?.nationality ?? "",
            isActive: initialData?.isActive ?? true,
        },
    });

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setValue("name", val);
        if (mode === "create") {
            setValue("slug", createSlug(val));
        }
    };

    const uploadImage = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Only image files are allowed");
            return;
        }

        setImageUploading(true);
        const tid = toast.loading("Uploading author image...");

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

            setImageFile({
                fileId: data.fileId,
                url: data.url,
            });

            toast.success("Image uploaded!", { id: tid });
        } catch (err) {
            toast.error((err as Error).message, { id: tid });
        } finally {
            setImageUploading(false);
        }
    };

    const onSubmit = async (values: AuthorFormValues) => {
        setIsSubmitting(true);
        const tid = toast.loading(mode === "create" ? "Creating author..." : "Updating author...");

        try {
            const payload: AuthorFormData = {
                ...values,
                birthYear: values.birthYear ?? undefined,
                deathYear: values.deathYear ?? undefined,
                slug: values.slug || createSlug(values.name),
                imageId: imageFile?.fileId ?? initialData?.imageId ?? undefined,
            };

            const url = mode === "create" ? "/api/authors" : `/api/authors/${initialData?.id}`;
            const method = mode === "create" ? "POST" : "PUT";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to save author");

            toast.success(
                mode === "create" ? "Author created successfully!" : "Author updated!",
                { id: tid }
            );

            router.push(`/admin/authors`);
            router.refresh();
        } catch (err) {
            toast.error((err as Error).message, { id: tid });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit as any)} className="author-form">
            <div className="author-form__layout">
                {/* Main Content - Left Column */}
                <div className="author-form__main">
                    {/* Basic Information Card */}
                    <div className="card">
                        <div className="card__header">
                            <div className="card__header-left">
                                <User size={18} className="card__header-icon" />
                                <h3 className="card__title">Author Details</h3>
                            </div>
                        </div>
                        <div className="card__body">
                            <div className="form-group">
                                <label className="form-label form-label--required">
                                    Full Name
                                </label>
                                <input
                                    {...register("name")}
                                    onChange={handleNameChange}
                                    className={`input ${errors.name ? "input--error" : ""}`}
                                    placeholder="e.g., Imam Al-Ghazali"
                                />
                                {errors.name && (
                                    <p className="form-error">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    URL Slug
                                    <span className="form-label__hint">(auto-generated from name)</span>
                                </label>
                                <input
                                    {...register("slug")}
                                    className="input"
                                    placeholder="imam-al-ghazali"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Biography</label>
                                <textarea
                                    {...register("bio")}
                                    className="textarea"
                                    rows={6}
                                    placeholder="Write a brief biography of the author, including their contributions, notable works, and legacy..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Stats Preview Card - Shows when editing existing author */}
                    {mode === "edit" && initialData?.id && (
                        <div className="card card--flat">
                            <div className="card__body">
                                <div className="stats-preview">
                                    <div className="stat-preview-item">
                                        <BookOpen size={16} className="stat-preview-item__icon" />
                                        <div className="stat-preview-item__content">
                                            <span className="stat-preview-item__label">Books</span>
                                            <span className="stat-preview-item__value">0</span>
                                        </div>
                                    </div>
                                    <div className="stat-preview-item">
                                        <BookOpen size={16} className="stat-preview-item__icon" />
                                        <div className="stat-preview-item__content">
                                            <span className="stat-preview-item__label">Fatawa</span>
                                            <span className="stat-preview-item__value">0</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar - Right Column */}
                <div className="author-form__sidebar">
                    {/* Publish Card */}
                    <div className="card">
                        <div className="card__header">
                            <h3 className="card__title">Publishing</h3>
                        </div>
                        <div className="card__body">
                            <div className="toggle-field">
                                <label className="toggle-label">
                                    <input
                                        type="checkbox"
                                        {...register("isActive")}
                                        className="toggle-input"
                                    />
                                    <span className="toggle-switch"></span>
                                    <span className="toggle-text">Author is Active</span>
                                </label>
                                <p className="toggle-hint">
                                    Inactive authors won't appear in public listings
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn btn--primary btn--full"
                            >
                                {isSubmitting ? (
                                    <><Loader2 size={14} className="animate-spin" /> Saving...</>
                                ) : mode === "create" ? (
                                    "Create Author"
                                ) : (
                                    "Update Author"
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Profile Information Card */}
                    <div className="card">
                        <div className="card__header">
                            <div className="card__header-left">
                                <Calendar size={18} className="card__header-icon" />
                                <h3 className="card__title">Biographical Info</h3>
                            </div>
                        </div>
                        <div className="card__body">
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Birth Year</label>
                                    <div className="input-wrapper">
                                        <input
                                            {...register("birthYear")}
                                            type="number"
                                            className="input"
                                            placeholder="e.g., 1058"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Death Year</label>
                                    <div className="input-wrapper">
                                        <input
                                            {...register("deathYear")}
                                            type="number"
                                            className="input"
                                            placeholder="e.g., 1111"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Nationality
                                    <span className="form-label__hint">(optional)</span>
                                </label>
                                <div className="input-wrapper">
                                    <Globe size={16} className="input-icon input-icon--left" />
                                    <input
                                        {...register("nationality")}
                                        className="input input--icon-left"
                                        placeholder="e.g., Persian, Arab"
                                    />
                                </div>
                            </div>

                            <p className="form-help-text">
                                Years can be entered in Hijri or Common Era format
                            </p>
                        </div>
                    </div>

                    {/* Profile Image Card */}
                    <div className="card">
                        <div className="card__header">
                            <div className="card__header-left">
                                <ImageIcon size={18} className="card__header-icon" />
                                <h3 className="card__title">Profile Image</h3>
                            </div>
                        </div>
                        <div className="card__body">
                            {imageFile || initialData?.imageId ? (
                                <div className="image-preview">
                                    <img
                                        src={imageFile?.url || `/api/files/${initialData?.imageId}`}
                                        alt="Author Profile"
                                        className="image-preview__img"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setImageFile(null)}
                                        className="image-preview__remove"
                                    >
                                        <X size={14} />
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <label className="upload-area">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="upload-area__input"
                                        onChange={(e) => {
                                            const f = e.target.files?.[0];
                                            if (f) uploadImage(f);
                                        }}
                                        disabled={imageUploading}
                                    />
                                    {imageUploading ? (
                                        <div className="upload-area__uploading">
                                            <Loader2 size={32} className="upload-area__spinner" />
                                            <p className="upload-area__title">Uploading...</p>
                                        </div>
                                    ) : (
                                        <div className="upload-area__content">
                                            <ImageIcon size={32} className="upload-area__icon" />
                                            <p className="upload-area__title">
                                                Drop image or click to upload
                                            </p>
                                            <p className="upload-area__hint">
                                                Recommended: Square image, at least 400x400px
                                            </p>
                                        </div>
                                    )}
                                </label>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .author-form {
                    width: 100%;
                }

                .author-form__layout {
                    display: grid;
                    grid-template-columns: 1fr 360px;
                    gap: var(--space-6);
                    align-items: start;
                }

                .author-form__main {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-6);
                }

                .author-form__sidebar {
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

                .card--flat {
                    background: var(--color-parchment-50);
                    border-color: var(--color-border-subtle);
                }

                .card__header {
                    padding: var(--space-4) var(--space-6);
                    border-bottom: 1px solid var(--color-border-subtle);
                    background: var(--color-parchment-50);
                }

                .card__header-left {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                }

                .card__header-icon {
                    color: var(--color-dusty-500);
                    opacity: 0.7;
                }

                .card__title {
                    font-family: var(--font-display);
                    font-size: var(--text-base);
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
                }

                .form-label {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    font-size: var(--text-sm);
                    font-weight: var(--font-semibold);
                    color: var(--color-text-primary);
                }

                .form-label--required::after {
                    content: "*";
                    color: var(--color-error);
                    margin-left: 2px;
                }

                .form-label__hint {
                    font-size: var(--text-xs);
                    font-weight: var(--font-regular);
                    color: var(--color-text-tertiary);
                    margin-left: var(--space-1);
                }

                .form-help-text {
                    font-size: var(--text-xs);
                    color: var(--color-text-tertiary);
                    margin-top: var(--space-1);
                    padding-top: var(--space-2);
                    border-top: 1px dashed var(--color-border-subtle);
                }

                .input {
                    width: 100%;
                    height: 40px;
                    padding: 0 var(--space-3);
                    font-family: var(--font-body);
                    font-size: var(--text-sm);
                    color: var(--color-text-primary);
                    background: var(--color-surface);
                    border: 1px solid var(--color-border);
                    border-radius: var(--radius-lg);
                    transition: all var(--duration-base) var(--ease-default);
                }

                .input:focus {
                    outline: none;
                    border-color: var(--color-dusty-400);
                    box-shadow: 0 0 0 3px rgba(110, 99, 158, 0.15);
                }

                .input--error {
                    border-color: var(--color-error);
                }

                .input--icon-left {
                    padding-left: var(--space-8);
                }

                .input-wrapper {
                    position: relative;
                }

                .input-icon {
                    position: absolute;
                    left: var(--space-2-5);
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--color-text-tertiary);
                    pointer-events: none;
                }

                .textarea {
                    width: 100%;
                    padding: var(--space-3);
                    font-family: var(--font-body);
                    font-size: var(--text-sm);
                    color: var(--color-text-primary);
                    background: var(--color-surface);
                    border: 1px solid var(--color-border);
                    border-radius: var(--radius-lg);
                    resize: vertical;
                    transition: all var(--duration-base) var(--ease-default);
                }

                .textarea:focus {
                    outline: none;
                    border-color: var(--color-dusty-400);
                    box-shadow: 0 0 0 3px rgba(110, 99, 158, 0.15);
                }

                .form-error {
                    font-size: var(--text-xs);
                    color: var(--color-error);
                    margin-top: var(--space-1);
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--space-3);
                }

                .toggle-field {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-2);
                    padding-bottom: var(--space-4);
                    border-bottom: 1px solid var(--color-border-subtle);
                }

                .toggle-label {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    cursor: pointer;
                }

                .toggle-input {
                    display: none;
                }

                .toggle-switch {
                    position: relative;
                    width: 40px;
                    height: 22px;
                    background: var(--color-parchment-300);
                    border-radius: var(--radius-full);
                    transition: background var(--duration-base) var(--ease-default);
                }

                .toggle-switch::after {
                    content: "";
                    position: absolute;
                    left: 3px;
                    top: 3px;
                    width: 16px;
                    height: 16px;
                    background: white;
                    border-radius: var(--radius-full);
                    transition: transform var(--duration-base) var(--ease-bounce);
                    box-shadow: var(--shadow-sm);
                }

                .toggle-input:checked + .toggle-switch {
                    background: var(--color-dusty-500);
                }

                .toggle-input:checked + .toggle-switch::after {
                    transform: translateX(18px);
                }

                .toggle-text {
                    font-size: var(--text-sm);
                    font-weight: var(--font-medium);
                    color: var(--color-text-primary);
                }

                .toggle-hint {
                    font-size: var(--text-xs);
                    color: var(--color-text-tertiary);
                    margin-left: 42px;
                }

                .btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: var(--space-2);
                    padding: var(--space-2-5) var(--space-5);
                    font-size: var(--text-sm);
                    font-weight: var(--font-semibold);
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

                .btn--full {
                    width: 100%;
                }

                .btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .stats-preview {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: var(--space-3);
                }

                .stat-preview-item {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    padding: var(--space-3);
                    background: var(--color-surface);
                    border: 1px solid var(--color-border-subtle);
                    border-radius: var(--radius-lg);
                }

                .stat-preview-item__icon {
                    color: var(--color-dusty-400);
                }

                .stat-preview-item__content {
                    display: flex;
                    flex-direction: column;
                }

                .stat-preview-item__label {
                    font-size: var(--text-xs);
                    color: var(--color-text-tertiary);
                }

                .stat-preview-item__value {
                    font-size: var(--text-lg);
                    font-weight: var(--font-bold);
                    color: var(--color-text-primary);
                    line-height: 1.2;
                }

                .image-preview {
                    position: relative;
                    width: 100%;
                }

                .image-preview__img {
                    width: 100%;
                    aspect-ratio: 1;
                    border-radius: var(--radius-lg);
                    object-fit: cover;
                    border: 1px solid var(--color-border);
                    box-shadow: var(--shadow-sm);
                }

                .image-preview__remove {
                    position: absolute;
                    top: var(--space-2);
                    right: var(--space-2);
                    display: flex;
                    align-items: center;
                    gap: var(--space-1);
                    padding: var(--space-1-5) var(--space-3);
                    background: white;
                    border: 1px solid var(--color-border);
                    border-radius: var(--radius-full);
                    font-size: var(--text-xs);
                    font-weight: var(--font-medium);
                    color: var(--color-error);
                    cursor: pointer;
                    transition: all var(--duration-fast) var(--ease-default);
                    box-shadow: var(--shadow-sm);
                }

                .image-preview__remove:hover {
                    background: var(--color-error);
                    color: white;
                    border-color: var(--color-error);
                }

                .upload-area {
                    display: block;
                    cursor: pointer;
                }

                .upload-area__input {
                    display: none;
                }

                .upload-area__content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: var(--space-8) var(--space-4);
                    border: 2px dashed var(--color-border);
                    border-radius: var(--radius-xl);
                    transition: all var(--duration-base) var(--ease-default);
                }

                .upload-area:hover .upload-area__content {
                    border-color: var(--color-dusty-400);
                    background: var(--color-dusty-50);
                }

                .upload-area__icon {
                    color: var(--color-dusty-400);
                    margin-bottom: var(--space-3);
                }

                .upload-area__title {
                    font-size: var(--text-sm);
                    font-weight: var(--font-medium);
                    color: var(--color-text-primary);
                    text-align: center;
                    margin-bottom: var(--space-1);
                }

                .upload-area__hint {
                    font-size: var(--text-xs);
                    color: var(--color-text-tertiary);
                    text-align: center;
                }

                .upload-area__uploading {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: var(--space-8) var(--space-4);
                    border: 2px dashed var(--color-dusty-400);
                    border-radius: var(--radius-xl);
                    background: var(--color-dusty-50);
                }

                .upload-area__spinner {
                    color: var(--color-dusty-400);
                    margin-bottom: var(--space-3);
                    animation: spin 0.7s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                @media (max-width: 1023px) {
                    .author-form__layout {
                        grid-template-columns: 1fr;
                    }

                    .author-form__sidebar {
                        position: static;
                    }
                }

                @media (max-width: 767px) {
                    .form-row {
                        grid-template-columns: 1fr;
                    }

                    .stats-preview {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </form>
    );
}