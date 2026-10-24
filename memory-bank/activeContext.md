# Active Context

## Current Focus
Security hardening + dependency refresh (2026-10-23). Works with the updated PC Lock Windows app API.

## Recent Changes
- **Upgraded**: Next 16.4.3, React 19.3.1, Prisma 7.10.1, Zod 4.6, latest Radix/lucide/etc. `npm audit`: 0.
  Kept on current majors on purpose: TypeScript 6 (7 is the native port), ESLint 9, Prisma 7 (8 is RC),
  @hookform/resolvers 5 (6 has a broken optional peer chain), @types/node 22 (matches Node 22 runtime).
- **Auth fixed**: the session cookie used to be the literal string `authenticated` (forgeable). It is now an
  HMAC-signed expiring token (`lib/session.ts`), verified in `proxy.ts` and in every server action (`requireAuth`).
- **Server actions locked down**: `pc-api` moved to `lib/` as `server-only` (was a public server action = SSRF);
  PC reads moved to `lib/pcs.ts` (were public actions returning API passwords). Actions return
  `ActionResult` objects instead of throwing (thrown messages are hidden in production).
- **PC passwords** never reach the browser; edit form leaves password blank = keep.
- **Live status**: dashboard shows real online/locked counts; detail page polls every 5s (`PcPanel`).
- **Schedule**: PC is the source of truth (read via authenticated `/api/status`), DB synced; shows "skipped tonight".
- **PC API client**: 4s timeouts, Bearer auth, readable errors (wrong password / throttled / refused).
- Delete asks for confirmation; host field validated (no scheme/port/path).
- Docker: added `public/` (COPY used to fail); `INSECURE_COOKIES=true` for http-only LAN deployments.

## Next Steps
- Deploy and point it at PCs running the updated PC Lock app.
- Migrations are not run automatically in Docker (`prisma migrate deploy` must be run separately).
