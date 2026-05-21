# Active Context

## Current Focus
Authentication is complete. App now requires a single password to access the control panel, with cookie-based sessions and route protection.

## Recent Changes
- **Authentication**: Implemented single-password login system with `APP_PASSWORD` env var, httpOnly session cookies (24h expiry), and root layout route protection. Login page uses `useActionState` for error handling.
- **Type Fixes**: Resolved strict type errors in `PCConnectionForm` by correctly typing `useForm` and `zodResolver`.
- **Build Fixes**: Added `'use server'` to `app/actions/control.ts` to fix leakage of Node.js modules into the client bundle.
- **UI Polish**: Added `cursor-pointer` to `DeleteButton` and `PCConnectionForm` submit button for better UX.

## Next Steps
- Continue verifying all features work as expected.
- Monitor for any further "cross-origin" warnings in dev mode (Next.js config might need `allowedDevOrigins` if accessed from LAN).
