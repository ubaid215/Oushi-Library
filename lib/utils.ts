import slugifyLib from "slugify";
import { format, formatDistanceToNow, isValid } from "date-fns";
import { clsx, type ClassValue } from "clsx";

// ── CSS class merge ─────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// ── Slug generation ─────────────────────────────────────────
export function createSlug(text: string): string {
  return slugifyLib(text, {
    lower: true,
    strict: true,
    locale: "en",
    remove: /[*+~.()'"!:@]/g,
  });
}

// ── Date formatting ────────────────────────────────────────
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (!isValid(d)) return "—";
  return format(d, "dd MMM yyyy");
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (!isValid(d)) return "—";
  return format(d, "dd MMM yyyy, HH:mm");
}

export function timeAgo(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (!isValid(d)) return "—";
  return formatDistanceToNow(d, { addSuffix: true });
}

// ── Number formatting ──────────────────────────────────────
export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

// ── File helpers ───────────────────────────────────────────
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() ?? "";
}

// ── Status helpers ─────────────────────────────────────────
export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    DRAFT: "badge--default",
    REVIEW: "badge--warning",
    PUBLISHED: "badge--success",
    ARCHIVED: "badge--error",
  };
  return map[status] ?? "badge--default";
}

export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    DRAFT: "Draft",
    REVIEW: "In Review",
    PUBLISHED: "Published",
    ARCHIVED: "Archived",
  };
  return map[status] ?? status;
}

// ── Language helpers ───────────────────────────────────────
export function getLanguageLabel(code: string): string {
  const map: Record<string, string> = {
    ur: "اردو",
    ar: "عربي",
    en: "English",
    fa: "فارسی",
  };
  return map[code] ?? code.toUpperCase();
}

// ── Truncate ───────────────────────────────────────────────
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
}

// ── Pagination ─────────────────────────────────────────────
export function getPaginationRange(current: number, total: number, delta = 2) {
  const range: (number | "...")[] = [];
  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  range.push(1);
  if (left > 2) range.push("...");
  for (let i = left; i <= right; i++) range.push(i);
  if (right < total - 1) range.push("...");
  if (total > 1) range.push(total);

  return range;
}

// ── Debounce ───────────────────────────────────────────────
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// ── API helpers ────────────────────────────────────────────
export async function fetchApi<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}`);
  }

  return data;
}

// ── Check permissions ──────────────────────────────────────
type AdminRole = "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "VIEWER";

const ROLE_HIERARCHY: Record<AdminRole, number> = {
  SUPER_ADMIN: 4,
  ADMIN: 3,
  EDITOR: 2,
  VIEWER: 1,
};

export function hasPermission(
  userRole: AdminRole,
  requiredRole: AdminRole
): boolean {
  return (ROLE_HIERARCHY[userRole] ?? 0) >= (ROLE_HIERARCHY[requiredRole] ?? 0);
}
