'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const SESSION_COOKIE = 'session'

export async function login(prevState: { error: string } | null, formData: FormData) {
  const password = formData.get('password') as string
  const expectedPassword = process.env.APP_PASSWORD

  if (!expectedPassword || password !== expectedPassword) {
    return { error: 'Invalid password.' }
  }

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
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
  const session = cookieStore.get(SESSION_COOKIE)?.value
  if (session === 'authenticated') {
    return { authenticated: true }
  }
  return { authenticated: false }
}
