'use server'

import { revalidatePath } from 'next/cache'
import * as z from 'zod'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import type { ActionResult } from '@/lib/types'

const baseSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.').max(100),
  // Host name or IP only: no scheme, path or port (those would change which server we call)
  url: z
    .string()
    .trim()
    .min(1, 'Host is required.')
    .max(253)
    .regex(/^[A-Za-z0-9.-]+$/, 'Use an IP address or host name, without http:// or a port.'),
  port: z.coerce.number().int().min(1).max(65535),
})

const createSchema = baseSchema.extend({ password: z.string().min(1, 'Password is required.') })
// On edit, an empty password keeps the stored one
const updateSchema = baseSchema.extend({ password: z.string().optional() })

function firstIssue(error: z.ZodError): string {
  return error.issues[0]?.message ?? 'Invalid input'
}

export async function createPc(input: unknown): Promise<ActionResult<{ id: number }>> {
  try {
    await requireAuth()
    const parsed = createSchema.safeParse(input)
    if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) }
    const pc = await prisma.pc.create({ data: parsed.data })
    revalidatePath('/')
    return { ok: true, data: { id: pc.id } }
  } catch (error) {
    console.error(error)
    return { ok: false, error: 'Failed to save PC' }
  }
}

export async function updatePc(id: number, input: unknown): Promise<ActionResult<{ id: number }>> {
  try {
    await requireAuth()
    const parsed = updateSchema.safeParse(input)
    if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) }
    const { password, ...rest } = parsed.data
    await prisma.pc.update({ where: { id }, data: password ? { ...rest, password } : rest })
    revalidatePath('/')
    revalidatePath(`/pc/${id}`)
    return { ok: true, data: { id } }
  } catch (error) {
    console.error(error)
    return { ok: false, error: 'Failed to save PC' }
  }
}

export async function deletePc(id: number): Promise<ActionResult> {
  try {
    await requireAuth()
    await prisma.pc.delete({ where: { id } })
    revalidatePath('/')
    return { ok: true, data: undefined }
  } catch (error) {
    console.error(error)
    return { ok: false, error: 'Failed to remove PC' }
  }
}
