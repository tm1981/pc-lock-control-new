'use client'

import { useState } from 'react'
import { Lock, Unlock, Loader2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { lockPcById, unlockPcById } from '@/app/actions/control'
import type { PcState } from '@/lib/types'

interface LockControlProps {
  pcId: number
  state: PcState
  run: (fn: () => Promise<PcState | null>) => Promise<void>
}

function describeLock(state: PcState): string {
  if (!state.locked) return 'The PC is in use.'
  const since = state.since ? ` since ${new Date(state.since).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''
  return state.reason === 'schedule' ? `Locked by schedule${since}.` : `Locked manually${since}.`
}

export function LockControl({ pcId, state, run }: LockControlProps) {
  const [pending, setPending] = useState<'lock' | 'unlock' | null>(null)

  const send = (action: 'lock' | 'unlock') => {
    setPending(action)
    return run(async () => {
      const result = action === 'lock' ? await lockPcById(pcId) : await unlockPcById(pcId)
      setPending(null)
      if (!result.ok) {
        toast.error(result.error)
        return null
      }
      toast.success(action === 'lock' ? 'PC locked' : 'PC unlocked')
      return result.data
    })
  }

  if (!state.online || state.locked === null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Control
            <Badge variant="destructive">{state.online ? 'Error' : 'Offline'}</Badge>
          </CardTitle>
          <CardDescription>
            {state.online ? 'The PC answered but refused the request' : 'Cannot connect to PC Lock service'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{state.error ?? 'Check that the PC is on, the app is running and its API is enabled.'}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  const locked = state.locked
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Control
          <Badge className={locked ? 'bg-red-500 text-white' : 'bg-green-600 text-white'}>
            {locked ? 'Locked' : 'Unlocked'}
          </Badge>
        </CardTitle>
        <CardDescription>{describeLock(state)}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center py-6">
        <div className={`rounded-full p-6 ${locked ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 'bg-green-100 text-green-600 dark:bg-green-900/30'}`}>
          {locked ? <Lock className="h-12 w-12" /> : <Unlock className="h-12 w-12" />}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-4">
        <Button
          variant="outline"
          className="flex-1 border-red-200 hover:bg-red-50 text-red-700 dark:hover:bg-red-950"
          onClick={() => send('lock')}
          disabled={pending !== null || locked}
        >
          {pending === 'lock' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
          Lock
        </Button>
        <Button
          variant="outline"
          className="flex-1 border-green-200 hover:bg-green-50 text-green-700 dark:hover:bg-green-950"
          onClick={() => send('unlock')}
          disabled={pending !== null || !locked}
        >
          {pending === 'unlock' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Unlock className="mr-2 h-4 w-4" />}
          Unlock
        </Button>
      </CardFooter>
    </Card>
  )
}
