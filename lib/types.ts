// Shapes shared between server code and client components (no secrets in here).

export type ScheduleView = {
  enabled: boolean
  start: string
  end: string
  /** PC skipped the rest of tonight's window because someone unlocked during it */
  snoozed?: boolean
  snoozeUntil?: string | null
}

export type PcState = {
  online: boolean
  locked: boolean | null
  reason: 'manual' | 'schedule' | null
  since: string | null
  schedule: ScheduleView | null
  error: string | null
}

export type PcSummary = {
  id: number
  name: string
  url: string
  port: number
}

export type ActionResult<T = undefined> = { ok: true; data: T } | { ok: false; error: string }
