'use server'

import { getPc } from './db'
import * as api from './pc-api'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'


export async function getPcStatus(id: number) {
  const pc = await getPc(id)
  if (!pc) throw new Error('PC not found')

  return await api.getLockStatus(pc.url, pc.port)
}

export async function lockPcById(id: number) {
  const pc = await getPc(id)
  if (!pc) throw new Error('PC not found')
  if (!pc.password) throw new Error('Password not configured for this PC')

  const result = await api.lockPc(pc.url, pc.port, pc.password)
  revalidatePath(`/pc/${id}`)
  return result
}

export async function unlockPcById(id: number) {
  const pc = await getPc(id)
  if (!pc) throw new Error('PC not found')
  if (!pc.password) throw new Error('Password not configured for this PC')

  const result = await api.unlockPc(pc.url, pc.port, pc.password)
  revalidatePath(`/pc/${id}`)
  return result
}

export async function updatePcSchedule(id: number, schedule: { enabled: boolean; start: string; end: string }) {
  const pc = await getPc(id)
  if (!pc) throw new Error('PC not found')
  if (!pc.password) throw new Error('Password not configured for this PC')

  // Update real PC
  const result = await api.updateSchedule(pc.url, pc.port, pc.password, schedule)

  // Update DB
  await prisma.pc.update({
    where: { id },
    data: {
      scheduleEnabled: schedule.enabled,
      scheduleStart: schedule.start,
      scheduleEnd: schedule.end
    }
  })

  revalidatePath(`/pc/${id}`)
  return result
}
