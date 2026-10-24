// Signed session tokens: `<expiresAtMs>.<base64url HMAC-SHA256(expiresAtMs)>`.
// Uses Web Crypto so it works in both the proxy and server actions.

export const SESSION_COOKIE = 'session'
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 // 24 hours

const encoder = new TextEncoder()

async function getKey(): Promise<CryptoKey> {
  // SESSION_SECRET is preferred; otherwise derive one from APP_PASSWORD so that
  // changing the password also invalidates every existing session.
  const secret = process.env.SESSION_SECRET || `pc-lock-session:${process.env.APP_PASSWORD ?? ''}`
  if (!process.env.SESSION_SECRET && !process.env.APP_PASSWORD) {
    throw new Error('APP_PASSWORD is not configured')
  }
  const raw = await crypto.subtle.digest('SHA-256', encoder.encode(secret))
  return crypto.subtle.importKey('raw', raw, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify'])
}

function toBase64Url(bytes: ArrayBuffer): string {
  let bin = ''
  for (const b of new Uint8Array(bytes)) bin += String.fromCharCode(b)
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> | null {
  try {
    const bin = atob(value.replace(/-/g, '+').replace(/_/g, '/'))
    const out = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
    return out
  } catch {
    return null
  }
}

export async function createSessionToken(): Promise<string> {
  const expires = String(Date.now() + SESSION_MAX_AGE_SECONDS * 1000)
  const sig = await crypto.subtle.sign('HMAC', await getKey(), encoder.encode(expires))
  return `${expires}.${toBase64Url(sig)}`
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false
  const [expires, sig] = token.split('.')
  if (!expires || !sig || !/^\d+$/.test(expires) || Number(expires) < Date.now()) return false
  const sigBytes = fromBase64Url(sig)
  if (!sigBytes) return false
  try {
    // crypto.subtle.verify compares in constant time
    return await crypto.subtle.verify('HMAC', await getKey(), sigBytes, encoder.encode(expires))
  } catch {
    return false
  }
}
