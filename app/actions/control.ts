'use server'

import { revalidatePath } from 'next/cache'
import * as z from 'zod'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import * as api from '@/lib/pc-api'
import { fetchPcState, findPc, toState } from '@/lib/pcs'
import type { ActionResult, PcState } from '@/lib/types'

// Server actions return errors instead of throwing: thrown messages are hidden in production builds.

async function loadPc(id: number) {
  await requireAuth()
  const pc = await findPc(id)
  if (!pc) throw new Error('PC not found')
  if (!pc.password) throw new Error('Password not configured for this PC')
  return pc
}

function fail(error: unknown): { ok: false; error: string } {
  return { ok: false, error: error instanceof Error ? error.message : 'Something went wrong' }
}

export async function getPcState(id: number): Promise<ActionResult<PcState>> {
  try {
    return { ok: true, data: await fetchPcState(await loadPc(id)) }
  } catch (error) {
    return fail(error)
  }
}

export async function lockPcById(id: number): Promise<ActionResult<PcState>> {
  try {
    const status = await api.lockPc(await loadPc(id))
    revalidatePath(`/pc/${id}`)
    return { ok: true, data: toState(status) }
  } catch (error) {
    return fail(error)
  }
}

export async function unlockPcById(id: number): Promise<ActionResult<PcState>> {
  try {
    const status = await api.unlockPc(await loadPc(id))
    revalidatePath(`/pc/${id}`)
    return { ok: true, data: toState(status) }
  } catch (error) {
    return fail(error)
  }
}

const hhmm = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Time must be HH:MM')
const scheduleSchema = z
  .object({ enabled: z.boolean(), start: hhmm, end: hhmm })
  .refine((s) => s.start !== s.end, { message: 'Lock and unlock times must differ' })

export async function updatePcSchedule(
  id: number,
  input: { enabled: boolean; start: string; end: string },
): Promise<ActionResult<PcState>> {
  try {
    const parsed = scheduleSchema.safeParse(input)
    if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid schedule' }
    const pc = await loadPc(id)
    await api.updateSchedule(pc, parsed.data)
    await prisma.pc.update({
      where: { id },
      data: { scheduleEnabled: parsed.data.enabled, scheduleStart: parsed.data.start, scheduleEnd: parsed.data.end },
    })
    revalidatePath(`/pc/${id}`)
    return { ok: true, data: await fetchPcState({ ...pc, scheduleEnabled: parsed.data.enabled,
      scheduleStart: parsed.data.start, scheduleEnd: parsed.data.end }) }
  } catch (error) {
    return fail(error)
  }
}
