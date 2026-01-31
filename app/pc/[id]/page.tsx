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

    try {
        // We try to connect. If it fails, isConnected remains false.
        // Note: getLockStatus in pc-api throws if it can't connect.
        isLocked = await getLockStatus(pc.url, pc.port)

        // Check schedule status via API if possible.
        // My pc-api actions include updateSchedule but not getSchedule directly...
        // Wait, the API documentation says POST /api/schedule returns the schedule.
        // It doesn't explicitly say GET /api/schedule exists or returns it.
        // But usually we want to know the current schedule.
        // The prompt says "The schedule is stored securely... manual edits to config.json will not change active schedule."
        // And "POST /api/schedule... Response: { schedule: ... }"
        // It seems I might not be able to fetch the schedule easily without setting it?
        // Let's assume for now we might start with default or empty, OR maybe the prompt implies
        // we should store schedule in our DB too?
        // "Daily lock window scheduling." -> The PC app has it.
        // Re-reading prompt: "Optional REST API... POST /api/schedule... Response: { "schedule": ... }"
        // It doesn't list a GET /api/schedule.
        // However, if I can't get it, the UI will be out of sync.
        // I will try to fetch status again.
        // "GET /api/status - Response: { locked: true | false }"
        // It seems I can't GET the schedule.
        // Actually, often these APIs might return current config on status or have a config endpoint.
        // The prompt says: "Response: { "schedule": { "enabled": true, "start": "22:00", "end": "07:00" } }" for the POST.
        // Maybe I should store the schedule in my Postgres DB too?
        // The visual prompt didn't say to Sync schedule to DB.
        // But if I want to show it, I need it.
        // Let's assume for this MVP I just default to 22:00-07:00 in the UI state or I try to "get" it.
        // But the prompt describes the *Windows App* features.
        // I'll stick to what is clearly documented.
        // "POST /api/schedule... Body: { ... } Response: { schedule: ... }"
        // If I cant GET it, I can't show current state from the PC.
        // I will add 'schedule' fields to my Prisma model so I can persist the "last known" schedule.

        isConnected = true
    } catch (e) {
        console.error("Failed to connect to PC", e)
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
