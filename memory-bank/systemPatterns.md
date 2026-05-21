# System Patterns

## Architecture
The application is built on **Next.js 16 (App Router)** using React Server Components (RSC) and Server Actions.

### Data Flow
1.  **Server Actions (`app/actions`)**:
    - Act as the API layer between the UI and backend resources.
    - `db.ts`: Handles CRUD operations for the PostgreSQL database via Prisma.
    - `pc-api.ts`: Handles HTTP communication with the remote Windows PCs.
    - `control.ts`: Orchestrates complex logic (e.g., fetching DB data then calling the PC API).
2.  **UI Components (`components/`)**:
    - **Client Components**: Handle user interactions (forms, buttons) and call Server Actions.
    - **Server Components**: Fetch data directly (e.g., `PCList`) and render the initial state.
3.  **Database**:
    - **PostgreSQL**: Stores the configuration of PCs (Name, IP, Port, Password) and their intended schedule.
    - **Prisma**: ORM for type-safe database access.

## Key Design Patterns
- **"Use Server" for Actions**: All data mutations and sensitive API calls happen on the server.
- **Optimistic UI (Potential)**: Calls to lock/unlock should feel fast.
- **Type Safety**: strict `zod` schemas for forms and `typescript` for all logic.
- **Tailwind + Shadcn/UI**: Consistent, accessible design system.

## Authentication Pattern
- **Single Password**: No usernames — one shared password (`APP_PASSWORD` env var) protects the entire app.
- **Session Management**: httpOnly cookie named `session`, set to `authenticated` on successful login. Expires after 24 hours. Secure in production, lax sameSite.
- **Route Protection**: Root layout calls `getSession()` on every render. If unauthenticated and not on `/login`, redirects to `/login`.
- **Login Page**: Client component using React's `useActionState` hook. The `login()` server action accepts `(prevState: { error: string } | null, formData: FormData)` signature required by `useActionState`. Form must use the wrapped `formAction` returned from the hook, not the raw function.
- **Error Handling**: Invalid password returns `{ error: 'Invalid password.' }`, displayed inline in red text below the input field.

## Data Model
**`Pc` Model**:
- `id`: Unique identifier.
- `name`: Human-readable label (e.g., "Gaming PC").
- `url`: IP address or Hostname.
- `port`: API port on the target machine.
- `password`: Shared secret for the API.
- `scheduleEnabled`: Boolean flag.
- `scheduleStart`: Time string (HH:MM).
- `scheduleEnd`: Time string (HH:MM).
