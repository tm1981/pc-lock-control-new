import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Monitor, Settings, Plus, Lock, Wifi } from 'lucide-react'
import { listPcsWithState } from '@/lib/pcs'
import type { PcState } from '@/lib/types'
import { DeleteButton } from './delete-button'

function StatusBadge({ state }: { state: PcState }) {
  if (!state.online) return <Badge variant="destructive">Offline</Badge>
  if (state.error) return <Badge variant="outline" className="border-amber-500 text-amber-600">Error</Badge>
  if (state.locked) return <Badge className="bg-red-500 text-white">Locked</Badge>
  return <Badge className="bg-green-600 text-white">Unlocked</Badge>
}

function Stat({ icon: Icon, label, value, tone }: { icon: typeof Monitor; label: string; value: number; tone: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 pt-6">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tone}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export async function PCList() {
  const items = await listPcsWithState()

  if (items.length === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <Monitor className="h-7 w-7 text-muted-foreground" />
          </div>
          <CardTitle>No PCs Configured</CardTitle>
          <CardDescription>Add a PC to start managing and controlling it remotely.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-6">
          <Button asChild>
            <Link href="/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Your First PC
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const online = items.filter((i) => i.state.online).length
  const locked = items.filter((i) => i.state.locked).length

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat icon={Monitor} label="PCs" value={items.length} tone="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" />
        <Stat icon={Wifi} label="Online" value={online} tone="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" />
        <Stat icon={Lock} label="Locked" value={locked} tone="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" />
      </div>

      <h2 className="text-lg font-semibold">Your Devices</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map(({ pc, state }) => (
          <Card key={pc.id} className="flex flex-col transition-shadow hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Monitor className="h-5 w-5 text-muted-foreground" />
                  {pc.name}
                </CardTitle>
                <StatusBadge state={state} />
              </div>
              <CardDescription className="font-mono text-xs">{pc.url}:{pc.port}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-3">
              <div className="rounded-lg bg-muted p-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Schedule</span>
                  <span className="font-medium">
                    {state.schedule
                      ? state.schedule.enabled
                        ? `${state.schedule.start}–${state.schedule.end}${state.schedule.snoozed ? ' (skipped tonight)' : ''}`
                        : 'Off'
                      : '—'}
                  </span>
                </div>
                {state.error && <p className="text-xs text-amber-600">{state.error}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex gap-2 pt-0">
              <Button variant="default" asChild className="flex-1">
                <Link href={`/pc/${pc.id}`}>Control</Link>
              </Button>
              <Button variant="outline" size="icon" asChild aria-label="Edit PC">
                <Link href={`/pc/${pc.id}/edit`}>
                  <Settings className="h-4 w-4" />
                </Link>
              </Button>
              <DeleteButton id={pc.id} name={pc.name} />
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  )
}
