# Bibliotheca Admin

Islamic Books & Fatawa Library — Next.js 15 Admin Dashboard

## Stack

- **Framework**: Next.js 15 (App Router)
- **Auth**: NextAuth v5 (Credentials + Google OAuth)
- **Database**: PostgreSQL + Prisma ORM
- **Storage**: Cloudinary (free tier, with PDF compression)
- **UI**: Custom design system (global.css) + Tailwind v4
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **Toasts**: react-hot-toast
- **Language**: TypeScript

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env.local
# Fill in all values in .env.local
```

### 3. Set up database
```bash
npm run db:push       # Push schema to DB
npm run db:generate   # Generate Prisma client
```

### 4. Create first admin user
```bash
npm run create-admin
```
Follow the prompts to create a SUPER_ADMIN account.

### 5. Start development server
```bash
npm run dev
```

Visit: http://localhost:3000/admin/login

---

## PDF Compression

PDFs are automatically compressed using `pdf-lib` before uploading to Cloudinary to stay within the **10MB free tier limit**:

1. User uploads PDF (up to 50MB)
2. Server compresses with `pdf-lib` (removes thumbnails, re-encodes streams)
3. Compressed PDF is uploaded to Cloudinary
4. Compression ratio is shown to the user via toast

Typical compression: **20–60%** reduction on unoptimized PDFs.

---

## Directory Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx          # Admin shell with auth check
│   │   ├── page.tsx            # Dashboard
│   │   ├── login/              # Login page (separate layout)
│   │   ├── books/              # Books CRUD
│   │   ├── fatawa/             # Fatawa CRUD
│   │   ├── authors/            # Authors management
│   │   ├── categories/         # Category tree
│   │   ├── tags/               # Tag management
│   │   ├── analytics/          # Charts & stats
│   │   ├── settings/           # Site settings
│   │   └── profile/            # Admin profile
│   └── api/
│       ├── auth/               # NextAuth handler
│       ├── upload/             # PDF compression + Cloudinary
│       ├── books/              # Books REST API
│       ├── fatawa/             # Fatawa REST API
│       ├── tags/               # Tags API
│       └── admin/              # Profile & password
├── components/
│   └── admin/                  # All admin components
├── lib/
│   ├── auth.ts                 # NextAuth config
│   ├── prisma.ts               # Prisma singleton
│   ├── cloudinary.ts           # Upload + PDF compression
│   └── utils.ts                # Helpers
├── types/
│   └── index.ts                # All TypeScript types
└── styles/
    └── global.css              # Design system (from Bibliotheca)
scripts/
└── create-admin.ts             # Admin creation CLI
prisma/
└── schema.prisma               # Extended scalable schema
```

---

## Admin Roles

| Role | Permissions |
|------|-------------|
| `SUPER_ADMIN` | Full access, manage users |
| `ADMIN` | All content, settings |
| `EDITOR` | Create/edit content |
| `VIEWER` | Read-only access |

---

## Cloudinary Setup

1. Create account at cloudinary.com
2. Go to Dashboard → Copy `Cloud name`, `API Key`, `API Secret`
3. Add to `.env.local`

Free tier limits:
- 25GB storage
- 25GB bandwidth/month
- 10MB max file per upload (PDFs are compressed to fit)
