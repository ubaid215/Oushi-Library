"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { createSlug } from "@/lib/utils";
import type { CategoryFormData } from "@/types";

const categorySchema = z.object({
    name: z.string().min(2, "Name is required"),
    slug: z.string().optional(),
    description: z.string().optional(),
    type: z.enum(["BOOK", "FATWA", "BOTH"]),
    parentId: z.string().optional().nullable(),
    order: z.coerce.number().int().default(0),
    isActive: z.boolean().default(true),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
    mode: "create" | "edit";
    initialData?: Partial<CategoryFormValues & { id: string }>;
    categories: { id: string; name: string; type: string; parentId: string | null }[];
}

export default function CategoryForm({ mode, initialData, categories }: CategoryFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema) as any,
        defaultValues: {
            name: initialData?.name ?? "",
            slug: initialData?.slug ?? "",
            description: initialData?.description ?? "",
            type: initialData?.type ?? "BOTH",
            parentId: initialData?.parentId ?? null,
            order: initialData?.order ?? 0,
            isActive: initialData?.isActive ?? true,
        },
    });

    const selectedType = watch("type");

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setValue("name", val);
        if (mode === "create") {
            setValue("slug", createSlug(val));
        }
    };

    const onSubmit = async (values: CategoryFormValues) => {
        setIsSubmitting(true);
        const tid = toast.loading(mode === "create" ? "Creating category..." : "Updating category...");

        try {
            const payload: CategoryFormData = {
                ...values,
                slug: values.slug || createSlug(values.name),
                parentId: values.parentId || null,
            };

            const url = mode === "create" ? "/api/categories" : `/api/categories/${initialData?.id}`;
            const method = mode === "create" ? "POST" : "PUT";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to save category");

            toast.success(
                mode === "create" ? "Category created successfully!" : "Category updated!",
                { id: tid }
            );

            router.push(`/admin/categories`);
            router.refresh();
        } catch (err) {
            toast.error((err as Error).message, { id: tid });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Filter possible parents based on matching type (or BOTH)
    // And prevent cycle by filtering out self in 'edit' mode
    const validParents = categories.filter((c) => {
        if (mode === "edit" && c.id === initialData?.id) return false;
        return c.type === "BOTH" || selectedType === "BOTH" || c.type === selectedType;
    });

    return (
        <form onSubmit={handleSubmit(onSubmit as any)} className="w-full flex flex-col lg:flex-row gap-6 items-start">
            <div className="flex-1 flex flex-col gap-6 w-full">
                <div className="card">
                    <div className="card__header">
                        <h3 className="card__title">Category Details</h3>
                    </div>
                    <div className="card__body">
                        <div className="form-group">
                            <label className="form-label form-label--required">Name</label>
                            <input
                                {...register("name")}
                                onChange={handleNameChange}
                                className={`input ${errors.name ? "input--error" : ""}`}
                                placeholder="E.g. Fiqh, Seerah, Hadith"
                            />
                            {errors.name && <p className="form-error">{errors.name.message}</p>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Slug (URL)</label>
                            <input {...register("slug")} className="input" placeholder="auto-generated-slug" />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                {...register("description")}
                                className="textarea"
                                rows={4}
                                placeholder="Optional description for context..."
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-[320px] flex flex-col gap-5 sticky top-[calc(var(--topbar-height)+1.5rem)]">
                <div className="card">
                    <div className="card__header">
                        <h3 className="card__title">Publish & Routing</h3>
                    </div>
                    <div className="card__body">
                        <label className="checkbox-item flex items-center gap-2 mb-4">
                            <input type="checkbox" {...register("isActive")} />
                            <span className="checkbox-item__label">Category is Active</span>
                        </label>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn--primary btn--full"
                        >
                            {isSubmitting ? (
                                <><Loader2 size={14} className="animate-spin" /> Saving...</>
                            ) : mode === "create" ? (
                                "Save Category"
                            ) : (
                                "Update Category"
                            )}
                        </button>
                    </div>
                </div>

                <div className="card">
                    <div className="card__header">
                        <h3 className="card__title">Hierarchy</h3>
                    </div>
                    <div className="card__body">
                        <div className="form-group mb-4">
                            <label className="form-label form-label--required">Content Type</label>
                            <select {...register("type")} className="select">
                                <option value="BOTH">Both (Books & Fatawa)</option>
                                <option value="BOOK">Books Only</option>
                                <option value="FATWA">Fatawa Only</option>
                            </select>
                        </div>

                        <div className="form-group mb-4">
                            <label className="form-label">Parent Category</label>
                            <select {...register("parentId")} className="select">
                                <option value="">None (Top Level)</option>
                                {validParents.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name} ({c.type})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Sorting Order</label>
                            <input {...register("order")} type="number" className="input" placeholder="0" />
                            <p className="form-hint pt-1 text-xs text-gray-500">Lower numbers appear first.</p>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
