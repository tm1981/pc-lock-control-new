import 'server-only'

import { cookies } from 'next/headers'
import { SESSION_COOKIE, verifySessionToken } from '@/lib/session'

/** Call at the top of every server action: actions are public POST endpoints. */
export async function requireAuth(): Promise<void> {
  const cookieStore = await cookies()
  if (!(await verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value))) {
    throw new Error('Not authenticated')
  }
}
