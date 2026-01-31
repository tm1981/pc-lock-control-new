# Active Context

## Current Focus
Stabilizing the codebase and polishing the UI. Recent work has focused on fixing build errors, type safety, and UI interaction improvements.

## Recent Changes
- **Type Fixes**: Resolved strict type errors in `PCConnectionForm` by correctly typing `useForm` and `zodResolver`.
- **Build Fixes**: Added `'use server'` to `app/actions/control.ts` to fix leakage of Node.js modules into the client bundle.
- **UI Polish**: Added `cursor-pointer` to `DeleteButton` and `PCConnectionForm` submit button for better UX.

## Next Steps
- Continue verifying all features work as expected.
- Monitor for any further "cross-origin" warnings in dev mode (Next.js config might need `allowedDevOrigins` if accessed from LAN).
