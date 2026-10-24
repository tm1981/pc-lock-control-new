import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SESSION_COOKIE, verifySessionToken } from '@/lib/session'

export async function proxy(request: NextRequest) {
  const authenticated = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value)
  const isLoginPage = request.nextUrl.pathname === '/login'

  if (!authenticated && !isLoginPage) {
    const res = NextResponse.redirect(new URL('/login', request.url))
    // Drop a stale or forged cookie
    if (request.cookies.has(SESSION_COOKIE)) res.cookies.delete(SESSION_COOKIE)
    return res
  }

  if (authenticated && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
