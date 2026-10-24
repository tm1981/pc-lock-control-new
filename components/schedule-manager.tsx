'use client'

import { useState } from 'react'
import { Loader2, Clock, MoonStar } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { updatePcSchedule } from '@/app/actions/control'
import type { PcState } from '@/lib/types'

interface ScheduleManagerProps {
  pcId: number
  state: PcState
  run: (fn: () => Promise<PcState | null>) => Promise<void>
}

type Draft = { enabled: boolean; start: string; end: string }

export function ScheduleManager({ pcId, state, run }: ScheduleManagerProps) {
  const remote = state.schedule
  // While not editing, the form shows the PC's live schedule; editing starts a local draft
  const [draft, setDraft] = useState<Draft | null>(null)
  const [saving, setSaving] = useState(false)
  const current: Draft = draft ?? {
    enabled: remote?.enabled ?? false,
    start: remote?.start ?? '22:00',
    end: remote?.end ?? '07:00',
  }
  const { enabled, start, end } = current
  const dirty = draft !== null

  const edit = <K extends keyof Draft>(key: K) => (value: Draft[K]) => setDraft({ ...current, [key]: value })

  const handleSave = () => {
    setSaving(true)
    return run(async () => {
      const result = await updatePcSchedule(pcId, { enabled, start, end })
      setSaving(false)
      if (!result.ok) {
        toast.error(result.error)
        return null
      }
      setDraft(null)
      toast.success('Schedule updated')
      return result.data
    })
  }

  if (!state.online || !remote) {
    return (
      <Card className="opacity-60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Daily Schedule
          </CardTitle>
          <CardDescription>The schedule can only be changed while the PC is online.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const snoozeEnd = remote.snoozeUntil
    ? new Date(remote.snoozeUntil).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Daily Schedule
        </CardTitle>
        <CardDescription>Automatically lock the PC during specific hours.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {remote.snoozed && (
          <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
            <MoonStar className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Unlocked during the scheduled window, so tonight is skipped{snoozeEnd ? ` until ${snoozeEnd}` : ''}.
              Saving the schedule cancels the skip.
            </span>
          </div>
        )}

        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="schedule-active" className="flex flex-col items-start space-y-1">
            <span>Enable Schedule</span>
            <span className="font-normal text-xs text-muted-foreground">
              {enabled ? `Locks every day ${start}–${end}` : 'Schedule is off'}
            </span>
          </Label>
          <Switch id="schedule-active" checked={enabled} onCheckedChange={edit('enabled')} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-time">Lock Time</Label>
            <Input id="start-time" type="time" value={start} onChange={(e) => edit('start')(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-time">Unlock Time</Label>
            <Input id="end-time" type="time" value={end} onChange={(e) => edit('end')(e.target.value)} />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={saving || (!dirty && !remote.snoozed)} className="w-full">
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Schedule
        </Button>
      </CardFooter>
    </Card>
  )
}
