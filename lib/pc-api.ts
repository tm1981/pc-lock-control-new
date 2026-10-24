// Low-level client for the PC Lock REST API. Server-only: never a server action,
// otherwise anyone could make this server fetch arbitrary hosts.
import 'server-only'

export type Schedule = {
  enabled: boolean
  start: string
  end: string
}

export type PcSchedule = Schedule & {
  notify_minutes?: number[]
  snooze_until?: string | null
  snoozed?: boolean
}

export type PcStatus = {
  locked: boolean
  reason?: 'manual' | 'schedule' | null
  since?: string | null
  schedule?: PcSchedule
}

type Target = { url: string; port: number; password: string }

const TIMEOUT_MS = 4000

export class PcApiError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message)
  }
}

function describeError(status: number, body: { error?: string; retry_after?: number } | null): string {
  if (status === 401) return 'Wrong PC password'
  if (status === 429) return `Too many wrong passwords, try again in ${body?.retry_after ?? 60}s`
  if (status === 403) return 'The PC refused the request (check host/origin settings in PC Lock)'
  if (body?.error) return body.error
  return `PC returned HTTP ${status}`
}

async function call<T>(target: Target, endpoint: string, init: RequestInit = {}): Promise<T> {
  const apiUrl = `http://${target.url}:${target.port}/api${endpoint}`
  let response: Response
  try {
    response = await fetch(apiUrl, {
      ...init,
      cache: 'no-store',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${target.password}`,
        ...init.headers,
      },
    })
  } catch {
    throw new PcApiError('PC is offline or unreachable')
  }
  const body = await response.json().catch(() => null)
  if (!response.ok) {
    throw new PcApiError(describeError(response.status, body), response.status)
  }
  return body as T
}

/** Returns null when the PC can't be reached. */
export async function getStatus(target: Target): Promise<PcStatus | null> {
  try {
    return await call<PcStatus>(target, '/status')
  } catch (error) {
    if (error instanceof PcApiError && error.status) throw error // reachable but refused
    return null
  }
}

export function lockPc(target: Target) {
  return call<PcStatus>(target, '/lock', { method: 'POST', body: '{}' })
}

export function unlockPc(target: Target) {
  return call<PcStatus>(target, '/unlock', { method: 'POST', body: '{}' })
}

export function updateSchedule(target: Target, schedule: Schedule) {
  return call<{ schedule: PcSchedule }>(target, '/schedule', {
    method: 'POST',
    body: JSON.stringify(schedule),
  })
}
