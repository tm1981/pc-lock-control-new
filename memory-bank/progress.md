# Progress

## Completed Features
- [x] **Project Setup**: Next.js 16 initialized with Typescript & Tailwind.
- [x] **Database**: Prisma schema defined and migration set up.
- [x] **PC Management**:
  - [x] List view of configured PCs.
  - [x] Add new PC form.
  - [x] Edit PC details (implied by file structure/components).
  - [x] Delete PC.
- [x] **Control**:
  - [x] Lock/Unlock actions.
  - [x] Status checking.
- [x] **Scheduling**:
  - [x] Schedule UI in PC Detail view.
  - [x] Persistence of schedule in DB.
  - [x] Pushing schedule updates to PC.
- [x] **Deployment**:
  - [x] Dockerfile creation.
  - [x] Prisma runtime migration support in Docker.
- [x] **Authentication**:
  - [x] Single-password login page (`/login`).
  - [x] httpOnly cookie-based session (24-hour expiry).
  - [x] Route protection via root layout session check — redirects unauthenticated users to `/login`.
  - [x] Logout button on dashboard.

- [x] **Hardening (2026-10-23)**: signed sessions, authenticated actions, server-only PC client, no passwords to the browser.
- [x] **Live status**: dashboard counts and badges, 5s polling on detail page, schedule pulled from PC.

## Known Issues
- **Networking**: LAN access triggers "Cross origin request" warnings in the dev server (`allowedDevOrigins` in next.config.ts).
- **Migrations**: the Docker image does not run `prisma migrate deploy` itself.

## Future Improvements
- **Activity Logs**: Track when PCs were locked/unlocked and by whom.
- **Global Schedule**: Apply a schedule to multiple PCs at once.
