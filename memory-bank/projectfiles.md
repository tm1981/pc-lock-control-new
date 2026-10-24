# Project Files

This is a list of the core application files, excluding configuration files and external libraries.

## App Router
- `app/layout.tsx`: Root application layout, includes fonts and `Toaster` provider. Performs session check and redirects unauthenticated users to `/login`.
- `app/page.tsx`: Dashboard homepage displaying the grid of configured PCs. Includes logout button.
- `app/globals.css`: Global CSS styles and Tailwind utility directives.
- `app/login/page.tsx`: Client component login page with single password field. Uses `useActionState` for form handling and error display.
- `app/add/page.tsx`: Page with `PCConnectionForm` for adding a new PC.
- `app/pc/[id]/page.tsx`: Detail view for a PC, showing controls and schedule.
- `app/pc/[id]/edit/page.tsx`: Edit view for modifying existing PC configuration.

## Server Actions
- `app/actions/auth.ts`: Authentication server actions — `login(prevState, formData)` (useActionState-compatible), `logout()`, `getSession()`. Uses httpOnly cookies and `APP_PASSWORD` env variable.
- `app/actions/control.ts`: Orchestrates locking logic, DB updates, and Next.js cache revalidation.
- `app/actions/db.ts`: CRUD operations for the `Pc` database model using Prisma.
- `lib/pc-api.ts`: Server-only REST client for the Windows PC app (timeouts, Bearer auth, error mapping).
- `lib/pcs.ts`: Server-only PC reads (`listPcs`, `findPc`, `listPcsWithState`, `fetchPcState`).
- `lib/session.ts` / `lib/auth.ts`: Signed session tokens and `requireAuth()`.
- `lib/types.ts`: `PcState`, `PcSummary`, `ActionResult` shared with client components.
- `scripts/check-pc-api.ts`: `npm run check:pc-api -- host port password` smoke test (really locks!).

## Components
- `components/delete-button.tsx`: Delete with a confirmation dialog.
- `components/pc-panel.tsx`: Client wrapper on the detail page; polls `getPcState` every 5s and shares state.
- `components/lock-control.tsx`: Lock/Unlock status (reason, since) and control buttons.
- `components/pc-connection-form.tsx`: Reusable form (React Hook Form + Zod) for adding/editing PCs.
- `components/pc-list.tsx`: Server component that fetches PCs and renders the dashboard grid.
- `components/schedule-manager.tsx`: Client component for viewing and editing the lock schedule.
- *(Note: `components/ui/` contains standard Shadcn UI components)*

## Lib & Utilities
- `lib/prisma.ts`: Singleton instance of the PrismaClient for database database access.

## Database
- `prisma/schema.prisma`: Schema definition for the PostgreSQL database (contains `Pc` model).

## Deployment
- `Dockerfile`: Multi-stage Docker build configuration for Next.js standalone output.
