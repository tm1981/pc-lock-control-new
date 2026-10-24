'use server'

import { createHash, timingSafeEqual } from 'node:crypto'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  verifySessionToken,
} from '@/lib/session'

// Simple in-memory brute-force protection for the login form
const MAX_FAILS = 5
const WINDOW_MS = 5 * 60 * 1000
const failures = new Map<string, number[]>()

function recentFailures(ip: string): number[] {
  const now = Date.now()
  const recent = (failures.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  failures.set(ip, recent)
  return recent
}

function passwordMatches(given: string, expected: string): boolean {
  // Hash first so lengths match and the comparison is constant-time
  const a = createHash('sha256').update(given).digest()
  const b = createHash('sha256').update(expected).digest()
  return timingSafeEqual(a, b)
}

export async function login(prevState: { error: string } | null, formData: FormData) {
  const password = formData.get('password')
  const expectedPassword = process.env.APP_PASSWORD
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() || 'local'

  const recent = recentFailures(ip)
  if (recent.length >= MAX_FAILS) {
    return { error: 'Too many attempts. Try again in a few minutes.' }
  }
  // Count the attempt before checking so parallel requests can't bypass the limit
  recent.push(Date.now())

  if (!expectedPassword || typeof password !== 'string' || !passwordMatches(password, expectedPassword)) {
    return { error: 'Invalid password.' }
  }
  failures.delete(ip)

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    // Set INSECURE_COOKIES=true when serving production over plain http on a LAN
    secure: process.env.NODE_ENV === 'production' && process.env.INSECURE_COOKIES !== 'true',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  })

  redirect('/')
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
  redirect('/login')
}

export async function getSession(): Promise<{ authenticated: boolean }> {
  const cookieStore = await cookies()
  return { authenticated: await verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value) }
}
