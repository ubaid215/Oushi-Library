"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ScrollText,
  Users,
  FolderTree,
  Tag,
  BarChart3,
  Settings,
  Home,
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import type { AdminUserSession } from "@/types";

interface SidebarProps {
  user: AdminUserSession;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: <Home size={17} />,
  },
  {
    label: "Books",
    href: "/admin/books",
    icon: <BookOpen size={17} />,
    children: [
      { label: "All Books", href: "/admin/books" },
      { label: "Add Book", href: "/admin/books/new" },
    ],
  },
  {
    label: "Fatawa",
    href: "/admin/fatawa",
    icon: <ScrollText size={17} />,
    children: [
      { label: "All Fatawa", href: "/admin/fatawa" },
      { label: "Add Fatwa", href: "/admin/fatawa/new" },
    ],
  },
  {
    label: "Authors",
    href: "/admin/authors",
    icon: <Users size={17} />,
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: <FolderTree size={17} />,
  },
  {
    label: "Tags",
    href: "/admin/tags",
    icon: <Tag size={17} />,
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: <BarChart3 size={17} />,
  },
];

const bottomItems: NavItem[] = [
  {
    label: "Settings",
    href: "/admin/settings",
    icon: <Settings size={17} />,
  },
];

export default function AdminSidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(["/admin/books", "/admin/fatawa"]);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const toggleExpanded = (href: string) => {
    setExpandedItems((prev) =>
      prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href]
    );
  };

  const initials =
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ??
    user.email?.[0]?.toUpperCase() ??
    "A";

  return (
    <>
      {/* Mobile hamburger button - using design tokens */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-[401] w-[38px] h-[38px] flex lg:hidden items-center justify-center rounded-lg border border-border bg-surface text-text-primary cursor-pointer shadow-sm hover:bg-surface-raised transition-colors"
        aria-label="Open navigation menu"
      >
        <Menu size={18} />
      </button>

      {/* Backdrop - using design tokens */}
      {mobileOpen && (
        <div
          className="sidebar-backdrop fixed inset-0 z-[400] lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - using design system classes */}
      <aside className={`sidebar ${mobileOpen ? "sidebar--open" : ""}`}>

        {/* Mobile close button */}
        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
            className="absolute top-4 right-3 z-10 w-[28px] h-[28px] flex items-center justify-center rounded-full border border-border-subtle bg-surface-raised text-text-tertiary cursor-pointer hover:bg-border-subtle hover:text-text-primary transition-all lg:hidden"
          >
            <X size={14} />
          </button>
        )}

        {/* Logo - using sidebar__logo class from design system */}
        <Link href="/admin" className="sidebar__logo">
          <div className="sidebar__logo-mark">
            <BookOpen size={18} color="white" />
          </div>
          <span className="sidebar__logo-text">Oushi Library</span>
        </Link>

        {/* Navigation */}
        <nav className="sidebar__nav">
          <div className="sidebar__nav-section">
            <span className="sidebar__nav-label">Main</span>
          </div>

          {navItems.map((item) => {
            const active = isActive(item.href);
            const expanded = expandedItems.includes(item.href);

            if (item.children) {
              return (
                <div key={item.href} className="sidebar__nav-group">
                  <button
                    onClick={() => toggleExpanded(item.href)}
                    className={`sidebar__nav-item ${active ? "sidebar__nav-item--active" : ""}`}
                    aria-expanded={expanded}
                  >
                    <span className="sidebar__nav-icon">{item.icon}</span>
                    <span className="flex-1">{item.label}</span>
                    {expanded ? (
                      <ChevronDown size={13} className="opacity-50" />
                    ) : (
                      <ChevronRight size={13} className="opacity-50" />
                    )}
                  </button>

                  {expanded && (
                    <div className="sidebar__nav-children">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`sidebar__nav-item sidebar__nav-item--child ${pathname === child.href ? "sidebar__nav-item--active" : ""
                            }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar__nav-item ${active ? "sidebar__nav-item--active" : ""}`}
              >
                <span className="sidebar__nav-icon">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.badge !== undefined && (
                  <span className="sidebar__nav-badge">{item.badge}</span>
                )}
              </Link>
            );
          })}

          <div className="sidebar__nav-section">
            <span className="sidebar__nav-label">System</span>
          </div>

          {bottomItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar__nav-item ${isActive(item.href) ? "sidebar__nav-item--active" : ""}`}
            >
              <span className="sidebar__nav-icon">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer with user info - using design system classes */}
        <div className="sidebar__footer">
          <div className="sidebar__user-info">
            <div
              className={`avatar avatar--sm ${!user.image ? "avatar--initials" : ""}`}
            >
              {user.image ? (
                <img src={user.image} alt={user.name ?? ""} />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <div className="sidebar__user-details">
              <div className="sidebar__user-name">
                {user.name ?? "Admin"}
              </div>
              <div className="sidebar__user-role">
                {user.role?.replace("_", " ") ?? "Administrator"}
              </div>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="sidebar__nav-item sidebar__nav-item--signout"
            aria-label="Sign out"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Add CSS for missing sidebar elements */}
      <style jsx>{`
        /* Additional styles to complement the design system */
        .sidebar__nav-group {
          margin-bottom: var(--space-1);
        }

        .sidebar__nav-children {
          padding-left: var(--space-8);
          margin-top: var(--space-1);
          margin-bottom: var(--space-1);
        }

        .sidebar__nav-item--child {
          font-size: var(--text-xs);
          padding-left: var(--space-3) !important;
        }

        .sidebar__user-info {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-2) var(--space-3);
        }

        .sidebar__user-details {
          flex: 1;
          min-width: 0;
        }

        .sidebar__user-name {
          font-size: var(--text-xs);
          font-weight: var(--font-semibold);
          color: var(--color-text-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .sidebar__user-role {
          font-size: 10px;
          color: var(--color-text-tertiary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .sidebar__nav-item--signout {
          color: var(--color-terracotta-400) !important;
          border: none;
          cursor: pointer;
          width: 100%;
          text-align: left;
        }

        .sidebar__nav-item--signout:hover {
          background: var(--color-error-subtle) !important;
        }

        .avatar--initials {
          background: linear-gradient(
            135deg,
            var(--color-dusty-300),
            var(--color-dusty-500)
          );
        }

        .avatar--initials span {
          font-size: var(--text-xs);
          color: white;
          font-weight: var(--font-semibold);
        }
      `}</style>
    </>
  );
}