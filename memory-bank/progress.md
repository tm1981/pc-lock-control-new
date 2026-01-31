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

## Known Issues
- **Networking**: LAN access triggers "Cross origin request" warnings in Next.js dev server.
- **Schedule Sync**: Current implementation pushes schedule to PC and DB, but doesn't necessarily pull *from* PC on load (uses DB as source of truth). This is an acceptable design choice but worth noting.

## Future Improvements
- **Authentication**: Add user login for the web app control panel itself.
- **Activity Logs**: Track when PCs were locked/unlocked and by whom.
- **Global Schedule**: Apply a schedule to multiple PCs at once.
