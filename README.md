# LeadDesk Mini

A full-stack lead capture and management platform built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, and **PostgreSQL**.

> **Live Requirement Verification:** Built for [Digital Heroes Training Task](https://digitalheroesco.com).

---

## Features & Deliverables

- **Public Landing Page (`/`)**:
  - High-converting hero section with dynamic visual hierarchy.
  - Interactive lead form capturing: `Name`, `Email`, `Budget Range`, and `Message`.
  - Client-side validation powered by **React Hook Form** + **Zod**.
  - Server-side validation endpoint powered by **Zod** schema enforcement.
  - Real-time success state feedback & server error alerts.

- **Admin Dashboard (`/admin`)**:
  - Centralized workspace listing all submitted leads with real-time stat metrics.
  - Interactive search bar filtering leads by name, email, budget range, or message text.
  - 3-state status toggle (`NEW` ➔ `CONTACTED` ➔ `CLOSED`) with optimistic UI updates.
  - Detailed modal view for full lead messages.
  - CSV Export capability for offline reporting.

- **Backend & Database Quality**:
  - Real database persistence using **PostgreSQL** & **Prisma ORM** (with `@prisma/adapter-pg`).
  - Standardized REST API endpoints (`POST /api/leads`, `GET /api/leads`, `PATCH /api/leads/[id]`, `GET /api/health`).
  - Strict TypeScript definitions across database models, API contracts, and UI components.

---

## Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Lucide Icons](https://lucide.dev/)
- **Form & Validation**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **ORM & Database**: [Prisma v7](https://www.prisma.io/) + [PostgreSQL](https://www.postgresql.org/) (`@prisma/adapter-pg`)

---

## Clean & Professional Folder Structure

```
lead-desk-mini/
├── prisma/
│   ├── schema.prisma         # Database schema (Lead model & LeadStatus enum)
│   └── seed.ts               # Seed script for initial sample leads
├── src/
│   ├── app/
│   │   ├── (public)/         # Public route group
│   │   │   ├── layout.tsx    # Header & public layout
│   │   │   └── page.tsx      # Landing page with lead form
│   │   ├── admin/            # Admin route group
│   │   │   ├── loading.tsx   # Skeleton loader for admin page
│   │   │   └── page.tsx      # Admin dashboard server component
│   │   ├── api/              # App router API endpoints
│   │   │   ├── health/       # Health check route
│   │   │   └── leads/        # Leads POST, GET & PATCH routes
│   │   ├── globals.css       # Global styles & Tailwind imports
│   │   └── layout.tsx        # Root HTML/Body layout with Footer
│   ├── components/
│   │   ├── admin/            # Admin workspace components
│   │   │   ├── LeadsTable.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   └── StatusToggle.tsx
│   │   ├── forms/            # Form components
│   │   │   └── LeadForm.tsx
│   │   └── ui/               # Reusable UI components
│   │       └── Footer.tsx    # Global footer with Digital Heroes credit
│   ├── lib/
│   │   ├── prisma.ts         # Singleton Prisma Client with PostgreSQL adapter
│   │   ├── utils.ts          # Class merging utility
│   │   └── validations/
│   │       └── lead.ts       # Shared Zod validation schemas
│   └── types/
│       └── lead.ts           # Shared TypeScript interfaces & types
├── .env.example              # Environment variables template
├── package.json
└── tsconfig.json
```

---

## Local Getting Started Guide

### Prerequisites
- Node.js >= 18.x
- PostgreSQL server running locally or a remote connection string

### 1. Installation

```bash
git clone <repository-url>
cd lead-desk-mini
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and set your PostgreSQL connection string:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/leaddesk_db"
```

### 3. Database Migration & Seeding

Sync the database schema and optionally populate sample data:

```bash
npx prisma db push
npx tsx prisma/seed.ts
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the Public Landing Page or [http://localhost:3000/admin](http://localhost:3000/admin) for the Admin Dashboard.

---

## API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/leads` | Submit a new lead (Validates with Zod schema) |
| `GET` | `/api/leads` | Retrieve leads (Supports search via `?q=query`) |
| `PATCH` | `/api/leads/:id` | Update lead status (`NEW` / `CONTACTED` / `CLOSED`) |
| `GET` | `/api/health` | Health check endpoint for database status |

---

## Verification & Footer Credit

As required by the task prompt, the footer contains the mandatory credit line:
> "Built for Digital Heroes Training Task" linked to [digitalheroesco.com](https://digitalheroesco.com).
