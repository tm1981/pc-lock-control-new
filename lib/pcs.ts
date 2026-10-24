import 'server-only'

import prisma from '@/lib/prisma'
import * as api from '@/lib/pc-api'
import type { PcState, PcSummary } from '@/lib/types'

const summarySelect = { id: true, name: true, url: true, port: true } as const

/** PCs without their API passwords: safe to hand to client components. */
export async function listPcs(): Promise<PcSummary[]> {
  return prisma.pc.findMany({ select: summarySelect, orderBy: { id: 'asc' } })
}

export async function findPcSummary(id: number): Promise<PcSummary | null> {
  if (!Number.isInteger(id)) return null
  return prisma.pc.findUnique({ where: { id }, select: summarySelect })
}

/** Full row including the password: server-side use only. */
export async function findPc(id: number) {
  if (!Number.isInteger(id)) return null
  return prisma.pc.findUnique({ where: { id } })
}

type PcRow = NonNullable<Awaited<ReturnType<typeof findPc>>>

/** Every PC with its live state, queried in parallel (each call times out on its own). */
export async function listPcsWithState(): Promise<{ pc: PcSummary; state: PcState }[]> {
  const rows = await prisma.pc.findMany({ orderBy: { id: 'asc' } })
  return Promise.all(
    rows.map(async (row) => ({
      pc: { id: row.id, name: row.name, url: row.url, port: row.port },
      state: await fetchPcState(row),
    })),
  )
}

export function toState(status: api.PcStatus | null, error: string | null = null): PcState {
  if (!status) {
    return { online: false, locked: null, reason: null, since: null, schedule: null, error }
  }
  const s = status.schedule
  return {
    online: true,
    locked: status.locked,
    reason: status.reason ?? null,
    since: status.since ?? null,
    schedule: s
      ? { enabled: s.enabled, start: s.start, end: s.end, snoozed: s.snoozed ?? false, snoozeUntil: s.snooze_until ?? null }
      : null,
    error,
  }
}

/** Live state from the PC. The PC is the source of truth for the schedule: the DB copy is kept in sync. */
export async function fetchPcState(pc: PcRow): Promise<PcState> {
  let state: PcState
  try {
    state = toState(await api.getStatus(pc))
  } catch (error) {
    // Reachable but refused (e.g. wrong password): still online
    return { ...toState(null, (error as Error).message), online: true }
  }
  const s = state.schedule
  if (s && (s.enabled !== pc.scheduleEnabled || s.start !== pc.scheduleStart || s.end !== pc.scheduleEnd)) {
    await prisma.pc
      .update({ where: { id: pc.id }, data: { scheduleEnabled: s.enabled, scheduleStart: s.start, scheduleEnd: s.end } })
      .catch(() => undefined)
  }
  return state
}
