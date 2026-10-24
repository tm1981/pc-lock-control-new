'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getPcState } from '@/app/actions/control'
import type { PcState } from '@/lib/types'
import { LockControl } from './lock-control'
import { ScheduleManager } from './schedule-manager'

const POLL_MS = 5000

/** Holds the live PC state shared by the lock and schedule cards, refreshing it periodically. */
export function PcPanel({ pcId, initialState }: { pcId: number; initialState: PcState }) {
  const [state, setState] = useState<PcState>(initialState)
  const busy = useRef(false)

  const refresh = useCallback(async () => {
    if (busy.current || document.hidden) return
    const result = await getPcState(pcId)
    if (result.ok && !busy.current) setState(result.data)
  }, [pcId])

  useEffect(() => {
    const timer = setInterval(refresh, POLL_MS)
    const onVisible = () => !document.hidden && refresh()
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      clearInterval(timer)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [refresh])

  // While a command runs, don't let a poll overwrite the result
  const run = useCallback(async (fn: () => Promise<PcState | null>) => {
    busy.current = true
    try {
      const next = await fn()
      if (next) setState(next)
    } finally {
      busy.current = false
    }
  }, [])

  return (
    <div className="grid gap-6">
      <LockControl pcId={pcId} state={state} run={run} />
      <ScheduleManager pcId={pcId} state={state} run={run} />
    </div>
  )
}
