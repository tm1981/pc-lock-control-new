'use server'

type Schedule = {
  enabled: boolean
  start: string
  end: string
}

type PcStatus = {
  locked: boolean
}

type PcScheduleResponse = {
  schedule: Schedule
}

async function fetchFromApi(url: string, port: number, endpoint: string, options: RequestInit = {}) {
  const apiUrl = `http://${url}:${port}/api${endpoint}`
  try {
    const response = await fetch(apiUrl, options)
    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Failed to fetch from ${apiUrl}:`, error)
    throw error
  }
}

export async function getLockStatus(url: string, port: number): Promise<boolean> {
  try {
    const data = await fetchFromApi(url, port, '/status', { cache: 'no-store' }) as PcStatus
    return data.locked
  } catch (error) {
    // If we can't connect, assume unknown/unreachable, but for UI simplicity might return false or throw
    console.error("Could not get lock status", error);
    throw new Error("Could not connect to PC Lock Service")
  }
}

export async function lockPc(url: string, port: number, password: string) {
  return await fetchFromApi(url, port, '/lock', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })
}

export async function unlockPc(url: string, port: number, password: string) {
  return await fetchFromApi(url, port, '/unlock', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })
}

export async function updateSchedule(url: string, port: number, password: string, schedule: Schedule) {
  return await fetchFromApi(url, port, '/schedule', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password, ...schedule }),
  }) as PcScheduleResponse
}
