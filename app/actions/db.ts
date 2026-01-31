'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'

export async function getPcs() {
  return await prisma.pc.findMany({
    orderBy: { id: 'asc' }
  })
}

export async function getPc(id: number) {
  return await prisma.pc.findUnique({
    where: { id }
  })
}

export async function createPc(data: { name: string; url: string; port: number; password: string }) {
  const pc = await prisma.pc.create({
    data
  })
  revalidatePath('/')
  return pc
}

export async function updatePc(id: number, data: { name?: string; url?: string; port?: number; password?: string }) {
  const pc = await prisma.pc.update({
    where: { id },
    data
  })
  revalidatePath('/')
  revalidatePath(`/pc/${id}`)
  return pc
}

export async function deletePc(id: number) {
  await prisma.pc.delete({
    where: { id }
  })
  revalidatePath('/')
}
