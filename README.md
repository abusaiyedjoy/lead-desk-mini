# LeadDesk Mini

A production-ready full-stack lead capture and management platform built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, **Prisma ORM**, **PostgreSQL (Neon)**, and **JWT session authentication**.

> **Built for [Digital Heroes Training Task](https://digitalheroesco.com)**

---

## 🚀 Live Deployment

| Resource | URL |
| :--- | :--- |
| **Public Site** | https://lead-desk-mini.vercel.app |
| **Admin Portal** | https://lead-desk-mini.vercel.app/admin |

### Test Credentials

| Field | Value |
| :--- | :--- |
| **Email** | `admin@leaddesk.com` |
| **Password** | `LeadDesk2025!` |

---

## 📐 Data Model

The application uses two database tables in PostgreSQL:

```
┌─────────────────────────────────────────┐
│                  leads                   │
├─────────────────┬────────────────────────┤
│ id              │ String (cuid, PK)       │
│ name            │ String                  │
│ email           │ String                  │
│ budgetRange     │ String                  │
│ message         │ Text                    │
│ status          │ Enum: NEW|CONTACTED|CLOSED (default: NEW) │
│ createdAt       │ DateTime (auto)         │
│ updatedAt       │ DateTime (auto-update)  │
└─────────────────┴────────────────────────┘

┌─────────────────────────────────────────┐
│              admin_users                 │
├─────────────────┬────────────────────────┤
│ id              │ String (cuid, PK)       │
│ email           │ String (unique)         │
│ passwordHash    │ String (bcrypt, cost 12)│
│ createdAt       │ DateTime (auto)         │
└─────────────────┴────────────────────────┘
```

### Relationships
- `leads` ← submitted by public visitors via the landing page form
- `admin_users` ← authenticated administrators who manage leads
- No foreign key between them — leads are not associated with individual admins (single-admin system)

---

## 🔐 Authentication Approach

### Strategy: Stateless JWT Sessions

LeadDesk Mini uses a **custom stateless session implementation** built on:
- **`jose`** — W3C-compliant JWT library (Edge Runtime compatible)
- **`bcryptjs`** — password hashing (cost factor 12)
- **Next.js Middleware** — server-side route protection

### Auth Flow

```
1. Admin visits /admin
         │
         ▼
2. middleware.ts intercepts
   → reads "leaddesk_session" cookie
   → decrypts JWT with AUTH_SECRET
   → if invalid/missing: redirect to /admin/login
         │
         ▼
3. Admin submits login form (/admin/login)
   → loginAction (Server Action)
   → Zod validates email + password fields
   → prisma.adminUser.findUnique(email)
   → bcrypt.compare(password, passwordHash)
   → if match: createSession() → set HttpOnly cookie
   → redirect to /admin
         │
         ▼
4. Admin dashboard loads
   → getSession() reads + decrypts cookie
   → displays admin email in header
   → "Sign Out" button calls logoutAction()
   → deleteSession() removes cookie
   → redirect to /admin/login
```

### Session Cookie Properties

| Property | Value | Reason |
| :--- | :--- | :--- |
| `httpOnly` | `true` | Prevents JavaScript access (XSS mitigation) |
| `secure` | `true` in production | HTTPS-only transmission |
| `sameSite` | `lax` | CSRF protection |
| `expires` | 7 days | Persistent login window |
| `path` | `/` | Available to all routes |

### API Protection

| Endpoint | Auth Required | Reason |
| :--- | :---: | :--- |
| `POST /api/leads` | ❌ No | Public lead submission |
| `GET /api/leads` | ✅ Yes | Admin-only lead listing |
| `PATCH /api/leads/:id` | ✅ Yes | Admin-only status updates |
| `GET /api/health` | ❌ No | Monitoring endpoint |

Protected endpoints return `401 Unauthorized` for requests without a valid session cookie.

### Why Not next-auth?

Next-auth v5 is still in beta and its API has numerous breaking changes. The Next.js documentation itself recommends using `jose` + manual session management for full control. This custom approach is:
- **Simpler** — fewer abstractions, easier to debug
- **Edge-compatible** — `jose` works in Vercel Edge middleware
- **Transparent** — every line is in the repo, no black box

---

## 🏗️ Architecture & Folder Structure

```
lead-desk-mini/
├── middleware.ts                    # Route protection — runs on every /admin/** request
├── prisma/
│   ├── schema.prisma                # DB schema: Lead model + AdminUser model + LeadStatus enum
│   ├── seed.ts                      # Sample lead data seeder
│   └── seed-admin.ts                # Admin user seeder (upsert — safe for production)
├── src/
│   ├── app/
│   │   ├── (public)/                # Public route group
│   │   │   ├── layout.tsx           # Public header navbar
│   │   │   └── page.tsx             # Landing page with lead form
│   │   ├── admin/
│   │   │   ├── login/
│   │   │   │   ├── page.tsx         # Admin login page (useActionState, glassmorphism UI)
│   │   │   │   └── actions.ts       # loginAction + logoutAction (Server Actions)
│   │   │   ├── loading.tsx          # Skeleton loader
│   │   │   └── page.tsx             # Admin dashboard (server component, requires auth)
│   │   ├── api/
│   │   │   ├── health/route.ts      # Health check
│   │   │   └── leads/
│   │   │       ├── route.ts         # POST (public), GET (auth-protected)
│   │   │       └── [id]/route.ts    # PATCH (auth-protected)
│   │   ├── globals.css
│   │   └── layout.tsx               # Root layout with Footer
│   ├── components/
│   │   ├── admin/
│   │   │   ├── LeadsTable.tsx       # Full-featured leads table with stats, search, filter, CSV export
│   │   │   ├── LogoutButton.tsx     # Client logout with useTransition
│   │   │   ├── SearchBar.tsx        # Debounced search input
│   │   │   ├── StatusBadge.tsx      # Colored status chip
│   │   │   └── StatusToggle.tsx     # 3-state status cycle button
│   │   ├── forms/
│   │   │   └── LeadForm.tsx         # Public lead capture form (RHF + Zod)
│   │   └── ui/
│   │       └── Footer.tsx           # Global footer with Digital Heroes credit
│   ├── lib/
│   │   ├── prisma.ts                # Singleton Prisma client (pg pool adapter)
│   │   ├── session.ts               # JWT encrypt/decrypt, createSession/getSession/deleteSession
│   │   ├── utils.ts                 # cn() class merging utility
│   │   └── validations/
│   │       └── lead.ts              # Shared Zod schemas (form + status update)
│   └── types/
│       └── lead.ts                  # TypeScript interfaces: Lead, LeadStatus, BUDGET_RANGES
├── .env.example                     # Environment variable template
└── package.json
```

---

## ⚙️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Forms** | [React Hook Form](https://react-hook-form.com/) + [Zod v4](https://zod.dev/) |
| **ORM** | [Prisma v7](https://www.prisma.io/) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) via [Neon](https://neon.tech/) |
| **Auth** | Custom JWT sessions with [jose](https://github.com/panva/jose) + [bcryptjs](https://github.com/dcodeIO/bcrypt.js) |
| **Deployment** | [Vercel](https://vercel.com/) (App) + [Neon](https://neon.tech/) (DB) |

---

## 🖥️ API Reference

| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/leads` | ❌ | Submit a new lead (Zod validated) |
| `GET` | `/api/leads` | ✅ | List/search leads (`?q=query`) |
| `PATCH` | `/api/leads/:id` | ✅ | Update lead status (`NEW`/`CONTACTED`/`CLOSED`) |
| `GET` | `/api/health` | ❌ | Database health check |

### Example: Submit a Lead
```bash
curl -X POST https://lead-desk-mini.vercel.app/api/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","budgetRange":"$5,000 - $10,000","message":"Interested in a new website redesign project."}'
```

### Example: Update Lead Status (requires session cookie)
```bash
curl -X PATCH https://lead-desk-mini.vercel.app/api/leads/cm_xxx \
  -H "Content-Type: application/json" \
  -H "Cookie: leaddesk_session=<token>" \
  -d '{"status":"CONTACTED"}'
```

---

## 🛠️ Local Setup

### Prerequisites
- Node.js ≥ 18.x
- PostgreSQL running locally

### 1. Clone & Install

```bash
git clone https://github.com/abusaiyedjoy/lead-desk-mini.git
cd lead-desk-mini
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/leaddesk_db"
AUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@leaddesk.com"
ADMIN_PASSWORD="YourPassword123!"
```

### 3. Set Up Database

```bash
# Push schema
npx prisma db push

# Create admin user (required for login)
npm run seed:admin

# Optional: add sample leads
npm run seed:leads
```

### 4. Run Development Server

```bash
npm run dev
```

Open:
- **Public Form**: [http://localhost:3000](http://localhost:3000)
- **Admin Login**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin) (redirects to login if unauthenticated)

---

## 🚀 Deploying to Vercel + Neon

### 1. Create Neon Database
1. Sign up at [neon.tech](https://neon.tech) (free tier)
2. Create a new project
3. Copy the `DATABASE_URL` from Connection Details

### 2. Push Schema & Seed Admin

```bash
# Replace <NEON_URL> with your connection string
DATABASE_URL="<NEON_URL>" npx prisma db push
DATABASE_URL="<NEON_URL>" ADMIN_EMAIL="admin@yourdomain.com" ADMIN_PASSWORD="YourPass!" npx tsx prisma/seed-admin.ts
```

### 3. Deploy via Vercel CLI

```bash
npx vercel login
npx vercel link --yes
npx vercel env add DATABASE_URL production   # paste Neon URL
npx vercel env add AUTH_SECRET production    # paste output of: openssl rand -base64 32
npx vercel --prod --yes
```

### 4. Set NEXTAUTH_URL

```bash
echo "https://your-app.vercel.app" | npx vercel env add NEXTAUTH_URL production
npx vercel --prod --yes  # redeploy to pick up new env var
```

---

## 🎬 Loom Walkthrough

> **Video walkthrough**: [Watch on Loom](https://www.loom.com) ← *(Record and replace this link)*

The walkthrough covers:
1. Public landing page — submitting a new lead via the form
2. Middleware protection — hitting `/admin` redirects to login
3. Admin login — entering credentials, session cookie creation
4. Admin dashboard — viewing the new lead, changing status
5. Sign out — cookie deletion, redirect back to login
6. API protection demo — calling `GET /api/leads` without a session returns 401

---

## ✅ Verification Checklist

| Criterion | Status |
| :--- | :--- |
| Real login (no hardcoded strings) | ✅ bcrypt against DB |
| Sessions handled properly (HttpOnly JWT) | ✅ |
| `/admin` redirects to `/admin/login` unauthenticated | ✅ middleware |
| API endpoints auth-protected | ✅ GET + PATCH |
| Deployed on free tier | ✅ Vercel + Neon |
| Works from fresh browser (no local state) | ✅ |
| Footer credit line | ✅ digitalheroesco.com |
| README with data model + auth approach | ✅ |

---

## Footer Credit

> **Built for [Digital Heroes Training Task](https://digitalheroesco.com)**
