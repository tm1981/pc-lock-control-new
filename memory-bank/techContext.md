# Tech Context

## Core Stack
- **Framework**: Next.js 16.4 (App Router, Turbopack), React 19.3
- **Language**: TypeScript
- **Database**: PostgreSQL (Prisma ORM 7.10, `@prisma/adapter-pg`)
- **Styling**: Tailwind CSS
- **UI Library**: Shadcn/UI (Radix Primitives)
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod

## Development Environment
- **Runtime**: Node.js
- **Package Manager**: npm
- **Linting**: ESLint

## Key Libraries
- `@prisma/client` & `@prisma/adapter-pg`: Database access.
- `sonner`: Toast notifications.
- `react-hook-form`: Form state management.
- `zod`: Schema validation.

## Configuration
- `.env`: `DATABASE_URL`, `APP_PASSWORD`, optional `SESSION_SECRET` and `INSECURE_COOKIES` (see `.env.example`).
- `prisma/schema.prisma`: Defines the database schema.
- `next.config.ts`: Next.js configuration.
