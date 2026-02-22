"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, Plus } from "lucide-react";
import { useState } from "react";
import type { AdminUserSession } from "@/types";

interface TopbarProps {
  user: AdminUserSession;
}

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/books": "Books",
  "/admin/books/new": "Add Book",
  "/admin/fatawa": "Fatawa",
  "/admin/fatawa/new": "Add Fatwa",
  "/admin/authors": "Authors",
  "/admin/categories": "Categories",
  "/admin/tags": "Tags",
  "/admin/analytics": "Analytics",
  "/admin/settings": "Settings",
  "/admin/profile": "Profile",
};

const quickCreateItems = [
  { label: "New Book", href: "/admin/books/new" },
  { label: "New Fatwa", href: "/admin/fatawa/new" },
  { label: "New Author", href: "/admin/authors/new" },
  { label: "New Category", href: "/admin/categories/new" },
];

export default function AdminTopbar({ user }: TopbarProps) {
  const pathname = usePathname();
  const [showCreate, setShowCreate] = useState(false);

  const title = pageTitles[pathname] ??
    pathname.split("/").pop()?.replace(/-/g, " ") ??
    "Admin";

  return (
    <header className="topbar">
      {/* Page title */}
      <div style={{ flexShrink: 0 }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-xl)",
            fontWeight: 700,
            color: "var(--color-text-primary)",
            letterSpacing: "var(--tracking-snug)",
            textTransform: "capitalize",
          }}
        >
          {title}
        </h1>
      </div>

      {/* Search */}
      <div className="topbar__search">
        <div className="input-wrapper">
          <Search
            size={14}
            className="input-icon input-icon--left"
            style={{ color: "var(--color-text-tertiary)" }}
          />
          <input
            type="search"
            placeholder="Search books, fatawa, authors..."
            className="search-input"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="topbar__actions">
        {/* Quick create */}
        <div className="dropdown" style={{ position: "relative" }}>
          <button
            className="btn btn--primary btn--sm"
            onClick={() => setShowCreate(!showCreate)}
            style={{ gap: "var(--space-2)" }}
          >
            <Plus size={14} />
            Create
          </button>

          {showCreate && (
            <>
              <div
                style={{
                  position: "fixed",
                  inset: 0,
                  zIndex: "var(--z-dropdown)" as any,
                }}
                onClick={() => setShowCreate(false)}
              />
              <div
                className="dropdown__menu dropdown__menu--right"
                style={{ zIndex: "calc(var(--z-dropdown) + 1)" as any }}
              >
                {quickCreateItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="dropdown__item"
                    onClick={() => setShowCreate(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Notifications */}
        <button
          className="btn btn--ghost btn--icon btn--icon-sm"
          style={{ position: "relative" }}
          title="Notifications"
        >
          <Bell size={17} />
          <span
            style={{
              position: "absolute",
              top: 4,
              right: 4,
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "var(--color-terracotta-400)",
              border: "1.5px solid var(--color-surface)",
            }}
          />
        </button>

        {/* Profile */}
        <Link
          href="/admin/profile"
          className="avatar avatar--sm"
          style={{
            textDecoration: "none",
            background: user.image
              ? "transparent"
              : "linear-gradient(135deg, var(--color-dusty-300), var(--color-dusty-500))",
          }}
          title={user.name ?? "Profile"}
        >
          {user.image ? (
            <img src={user.image} alt={user.name ?? "Profile"} />
          ) : (
            <span style={{ fontSize: "var(--text-xs)", color: "white", fontWeight: 700 }}>
              {(user.name ?? user.email ?? "A")
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
