"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";

interface SearchFilterProps {
    categories: { id: string; name: string; slug: string }[];
    currentCategory?: string;
    currentSearch?: string;
    placeholder?: string;
}

export default function SearchFilter({ cats, currentCategory = "", currentSearch = "", placeholder = "Search..." }: { cats: { id: string; name: string; slug: string }[], currentCategory?: string, currentSearch?: string, placeholder?: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [searchQuery, setSearchQuery] = useState(currentSearch);
    const [selectedCategory, setSelectedCategory] = useState(currentCategory);

    // Sync state with URL if it changes from back/forward navigation
    useEffect(() => {
        setSearchQuery(currentSearch);
        setSelectedCategory(currentCategory);
    }, [currentSearch, currentCategory]);

    const updateFilters = useCallback(
        (newSearch: string, newCategory: string) => {
            const params = new URLSearchParams(searchParams.toString());

            if (newSearch) params.set("search", newSearch);
            else params.delete("search");

            if (newCategory) params.set("category", newCategory);
            else params.delete("category");

            router.push(`${pathname}?${params.toString()}`);
        },
        [pathname, router, searchParams]
    );

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateFilters(searchQuery, selectedCategory);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setSelectedCategory(val);
        updateFilters(searchQuery, val);
    };

    return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "2.5rem" }}>
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} style={{ flex: "1 1 min(300px, 100%)", position: "relative" }}>
                <input
                    type="text"
                    placeholder={placeholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "0.875rem 1rem 0.875rem 2.75rem",
                        borderRadius: "12px",
                        border: "1px solid var(--color-parchment-200)",
                        background: "white",
                        fontSize: "0.95rem",
                        color: "var(--color-slate-warm-800)",
                        outline: "none",
                        boxShadow: "0 2px 8px rgba(39,33,24,0.02)",
                        transition: "border-color 0.2s, box-shadow 0.2s"
                    }}
                    onFocus={(e) => {
                        e.target.style.borderColor = "var(--color-dusty-400)";
                        e.target.style.boxShadow = "0 4px 12px rgba(39,33,24,0.05)";
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = "var(--color-parchment-200)";
                        e.target.style.boxShadow = "0 2px 8px rgba(39,33,24,0.02)";
                    }}
                />
                <Search
                    size={18}
                    style={{
                        position: "absolute",
                        left: "1rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "var(--color-slate-warm-400)",
                        pointerEvents: "none"
                    }}
                />
            </form>

            {/* Category Dropdown */}
            <div style={{ position: "relative", minWidth: "200px", flex: "1 1 auto", maxWidth: "300px" }}>
                <select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    style={{
                        width: "100%",
                        padding: "0.875rem 2.5rem 0.875rem 1rem",
                        borderRadius: "12px",
                        border: "1px solid var(--color-parchment-200)",
                        background: "white",
                        fontSize: "0.95rem",
                        color: "var(--color-slate-warm-800)",
                        appearance: "none",
                        outline: "none",
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(39,33,24,0.02)",
                        transition: "border-color 0.2s, box-shadow 0.2s"
                    }}
                    onFocus={(e) => {
                        e.target.style.borderColor = "var(--color-dusty-400)";
                        e.target.style.boxShadow = "0 4px 12px rgba(39,33,24,0.05)";
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = "var(--color-parchment-200)";
                        e.target.style.boxShadow = "0 2px 8px rgba(39,33,24,0.02)";
                    }}
                >
                    <option value="">All Categories</option>
                    {cats.map((c) => (
                        <option key={c.id} value={c.slug}>
                            {c.name}
                        </option>
                    ))}
                </select>
                <ChevronDown
                    size={18}
                    style={{
                        position: "absolute",
                        right: "1rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "var(--color-slate-warm-400)",
                        pointerEvents: "none"
                    }}
                />
            </div>
        </div>
    );
}
