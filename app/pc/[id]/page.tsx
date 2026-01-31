import { LockControl } from '@/components/lock-control'
import { ScheduleManager } from '@/components/schedule-manager'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { getPc } from '@/app/actions/db'
import { notFound } from 'next/navigation'
import { getLockStatus } from '@/app/actions/pc-api'

export default async function PCDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const pcId = parseInt(id)
    const pc = await getPc(pcId)

    if (!pc) {
        notFound()
    }

    let isLocked: boolean | null = null
    let isConnected = false

    // We try to connect. If it returns null, it's offline.
    const status = await getLockStatus(pc.url, pc.port)

    if (status !== null) {
        isLocked = status
        isConnected = true
    } else {
        isConnected = false
    }

    // Update: I'll modify schema to add schedule fields so I can persist it locally.
    // Although the prompt says "The schedule is stored securely (DPAPI) in schedule.dat" on the PC.
    // If I can't read it from API, I must rely on local DB as the source of truth for "what we want it to be".

    return (
        <main className="container mx-auto p-4 md:p-8 max-w-2xl space-y-8">
            <div>
                <Button variant="ghost" asChild className="mb-4 pl-0 hover:bg-transparent">
                    <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </Button>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{pc.name}</h1>
                        <p className="text-muted-foreground">{pc.url}:{pc.port}</p>
                    </div>
                    <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} title={isConnected ? "Connected" : "Disconnected"} />
                </div>
            </div>

            <div className="grid gap-6">
                <LockControl pcId={pc.id} initialLockedStatus={isLocked} isConnected={isConnected} />

                <ScheduleManager
                    pcId={pc.id}
                    isConnected={isConnected}
                    initialSchedule={{
                        enabled: pc.scheduleEnabled,
                        start: pc.scheduleStart,
                        end: pc.scheduleEnd
                    }}
                />
            </div>
        </main>
    )
}
