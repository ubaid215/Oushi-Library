// ============================================================
// BIBLIOTHECA ADMIN — TypeScript Types
// ============================================================

import type { AdminRole, CategoryType, ContentStatus, FileStorage, SettingType } from "@prisma/client";

// ── Re-export Prisma enums ──────────────────────────────────
export { AdminRole, CategoryType, ContentStatus, FileStorage, SettingType };

// ── Admin User ─────────────────────────────────────────────
export interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: AdminRole;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompressedPdfResult {
  buffer: Buffer;
  originalSize: number;
  compressedSize: number;
  ratio: number;
  strategy: string;
}

export interface AdminUserSession {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: AdminRole;
}

// ── File ───────────────────────────────────────────────────
export interface FileRecord {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  publicId: string | null;
  mimeType: string;
  size: number;
  compressedSize: number | null;
  storage: FileStorage;
  isPublic: boolean;
  createdAt: Date;
}

export interface UploadResult {
  fileId: string;
  url: string;
  publicId: string;
  size: number;
  compressedSize: number;
}

// ── Author ─────────────────────────────────────────────────
export interface Author {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  birthYear: number | null;
  deathYear: number | null;
  nationality: string | null;
  isActive: boolean;
  imageId: string | null;
  image: FileRecord | null;
  _count?: { fatawa: number; books: number };
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthorFormData {
  name: string;
  slug?: string;
  bio?: string;
  birthYear?: number;
  deathYear?: number;
  nationality?: string;
  isActive?: boolean;
  imageId?: string;
}

// ── Category ───────────────────────────────────────────────
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  type: CategoryType;
  parentId: string | null;
  order: number;
  isActive: boolean;
  parent?: Category | null;
  children?: Category[];
  _count?: { fatawa: number; books: number };
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryFormData {
  name: string;
  slug?: string;
  description?: string;
  type: CategoryType;
  parentId?: string | null;
  order?: number;
  isActive?: boolean;
}

export interface CategoryTree extends Category {
  children: CategoryTree[];
  depth: number;
}

// ── Tag ────────────────────────────────────────────────────
export interface Tag {
  id: string;
  name: string;
  slug: string;
  count: number;
  createdAt: Date;
}

export interface TagFormData {
  name: string;
  slug?: string;
}

// ── Fatwa ──────────────────────────────────────────────────
export interface Fatwa {
  id: string;
  title: string;
  slug: string;
  question: string;
  answer: string;
  language: string;
  status: ContentStatus;
  categoryId: string;
  category: Category;
  authorId: string;
  author: Author;
  pdfFileId: string | null;
  pdfFile: FileRecord | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string[];
  isPublished: boolean;
  publishedAt: Date | null;
  viewCount: number;
  shareCount: number;
  tags: FatwaTag[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FatwaTag {
  fatwaId: string;
  tagId: string;
  tag: Tag;
}

export interface FatwaFormData {
  title: string;
  slug?: string;
  question: string;
  answer: string;
  language?: string;
  status?: ContentStatus;
  categoryId: string;
  authorId: string;
  pdfFileId?: string | null;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  tagIds?: string[];
  isPublished?: boolean;
}

export interface FatwaRevision {
  id: string;
  fatwaId: string;
  title: string;
  question: string;
  answer: string;
  editedBy: string;
  reason: string | null;
  createdAt: Date;
}

// ── Book ───────────────────────────────────────────────────
export interface Book {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  language: string;
  isbn: string | null;
  publisher: string | null;
  edition: string | null;
  status: ContentStatus;
  authorId: string;
  author: Author;
  categoryId: string | null;
  category: Category | null;
  pdfFileId: string;
  pdfFile: FileRecord;
  coverImageId: string | null;
  coverImage: FileRecord | null;
  downloadCount: number;
  viewCount: number;
  isPublished: boolean;
  publishedAt: Date | null;
  isFeatured: boolean;
  tags: BookTag[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BookTag {
  bookId: string;
  tagId: string;
  tag: Tag;
}

export interface BookFormData {
  title: string;
  slug?: string;
  description?: string;
  language?: string;
  isbn?: string;
  publisher?: string;
  edition?: string;
  status?: ContentStatus;
  authorId: string;
  categoryId?: string | null;
  pdfFileId: string;
  coverImageId?: string | null;
  tagIds?: string[];
  isPublished?: boolean;
  isFeatured?: boolean;
}

// ── Dashboard Stats ────────────────────────────────────────
export interface DashboardStats {
  totalBooks: number;
  totalFatawa: number;
  totalAuthors: number;
  totalCategories: number;
  totalDownloads: number;
  totalViews: number;
  recentBooks: BookSummary[];
  recentFatawa: FatwaSummary[];
  topBooks: BookSummary[];
  monthlyDownloads: ChartDataPoint[];
  monthlyViews: ChartDataPoint[];
  statusBreakdown: StatusBreakdown[];
  languageBreakdown: LanguageBreakdown[];
}

export interface BookSummary {
  id: string;
  title: string;
  slug: string;
  author: { name: string };
  downloadCount: number;
  viewCount: number;
  status: ContentStatus;
  coverImage: { url: string } | null;
  createdAt: Date;
}

export interface FatwaSummary {
  id: string;
  title: string;
  slug: string;
  author: { name: string };
  viewCount: number;
  status: ContentStatus;
  createdAt: Date;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  date: string;
}

export interface StatusBreakdown {
  status: ContentStatus;
  count: number;
}

export interface LanguageBreakdown {
  language: string;
  count: number;
}

// ── API Response Types ─────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// ── Settings ───────────────────────────────────────────────
export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  type: SettingType;
  group: string;
}

export interface SiteSettingsGroup {
  general: {
    siteName: string;
    siteDescription: string;
    siteUrl: string;
    logo: string;
    favicon: string;
  };
  appearance: {
    primaryColor: string;
    theme: "light" | "dark" | "auto";
  };
  upload: {
    maxPdfSizeMb: number;
    maxImageSizeMb: number;
    allowedMimeTypes: string;
  };
  analytics: {
    googleAnalyticsId: string;
    enableTracking: boolean;
  };
}

// ── Navigation ─────────────────────────────────────────────
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
  children?: NavItem[];
  roles?: AdminRole[];
}

// ── Table ──────────────────────────────────────────────────
export interface TableColumn<T = Record<string, unknown>> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: unknown, row: T) => React.ReactNode;
}

export interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

// ── Upload ─────────────────────────────────────────────────
export interface UploadProgress {
  loaded: number;
  total: number;
  percent: number;
}

// ── Form ───────────────────────────────────────────────────
export type FormMode = "create" | "edit";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// ── Analytics ──────────────────────────────────────────────
export interface AnalyticsData {
  totalViews: number;
  totalDownloads: number;
  uniqueVisitors: number;
  avgSessionDuration: number;
  viewsOverTime: ChartDataPoint[];
  downloadsOverTime: ChartDataPoint[];
  topPages: { path: string; views: number }[];
  topBooks: { title: string; downloads: number }[];
  geographyData: { country: string; count: number }[];
  deviceData: { device: string; count: number }[];
}
