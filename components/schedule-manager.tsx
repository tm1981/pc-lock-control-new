'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { updatePcSchedule } from '@/app/actions/control'
import { toast } from 'sonner'
import { Loader2, Clock } from 'lucide-react'

interface ScheduleManagerProps {
    pcId: number
    initialSchedule?: {
        enabled: boolean
        start: string
        end: string
    }
    isConnected: boolean
}

export function ScheduleManager({ pcId, initialSchedule, isConnected }: ScheduleManagerProps) {
    const [enabled, setEnabled] = useState(initialSchedule?.enabled ?? false)
    const [start, setStart] = useState(initialSchedule?.start || '22:00')
    const [end, setEnd] = useState(initialSchedule?.end || '07:00')
    const [isLoading, setIsLoading] = useState(false)

    const handleSave = async () => {
        setIsLoading(true)
        try {
            await updatePcSchedule(pcId, { enabled, start, end })
            toast.success('Schedule updated')
        } catch (error) {
            console.error(error)
            toast.error('Failed to update schedule')
        } finally {
            setIsLoading(false)
        }
    }

    if (!isConnected) {
        return (
            <Card className="opacity-50">
                <CardHeader>
                    <CardTitle>Schedule</CardTitle>
                    <CardDescription>Schedule is unavailable when offline.</CardDescription>
                </CardHeader>
            </Card>
        )
    }

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
                <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="schedule-active" className="flex flex-col space-y-1">
                        <span>Enable Schedule</span>
                        <span className="font-normal text-xs text-muted-foreground">
                            {enabled ? "Schedule is active" : "Schedule is paused"}
                        </span>
                    </Label>
                    <Switch id="schedule-active" checked={enabled} onCheckedChange={setEnabled} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="start-time">Lock Time</Label>
                        <Input
                            id="start-time"
                            type="time"
                            value={start}
                            onChange={(e) => setStart(e.target.value)}
                            disabled={!enabled}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="end-time">Unlock Time</Label>
                        <Input
                            id="end-time"
                            type="time"
                            value={end}
                            onChange={(e) => setEnd(e.target.value)}
                            disabled={!enabled}
                        />
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSave} disabled={isLoading} className="w-full">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Schedule
                </Button>
            </CardFooter>
        </Card>
    )
}
