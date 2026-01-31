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
    // Only log if it's NOT a connection error (which is expected when offline)
    const isConnectionError = error instanceof TypeError && error.message === 'fetch failed';
    if (!isConnectionError) {
        console.error(`Failed to fetch from ${apiUrl}:`, error)
    }
    throw error
  }
}

export async function getLockStatus(url: string, port: number): Promise<boolean | null> {
  try {
    const data = await fetchFromApi(url, port, '/status', { cache: 'no-store' }) as PcStatus
    return data.locked
  } catch (error) {
    // Return null if offline, don't throw
    return null
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
