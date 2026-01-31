'use client'

import { useState } from 'react'
import { Lock, Unlock, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { lockPcById, unlockPcById } from '@/app/actions/control'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

interface LockControlProps {
    pcId: number
    initialLockedStatus: boolean | null
    isConnected: boolean
}

export function LockControl({ pcId, initialLockedStatus, isConnected }: LockControlProps) {
    const [isLocked, setIsLocked] = useState<boolean | null>(initialLockedStatus)
    const [isLoading, setIsLoading] = useState(false)

    const handleLock = async () => {
        setIsLoading(true)
        try {
            await lockPcById(pcId)
            setIsLocked(true)
            toast.success('Lock command sent')
        } catch (error) {
            console.error(error)
            toast.error('Failed to lock PC')
        } finally {
            setIsLoading(false)
        }
    }

    const handleUnlock = async () => {
        setIsLoading(true)
        try {
            await unlockPcById(pcId)
            setIsLocked(false)
            toast.success('Unlock command sent')
        } catch (error) {
            console.error(error)
            toast.error('Failed to unlock PC')
        } finally {
            setIsLoading(false)
        }
    }

    if (!isConnected) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        Control
                        <Badge variant="destructive">Offline</Badge>
                    </CardTitle>
                    <CardDescription>Cannot connect to PC Lock service</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <AlertCircle className="h-4 w-4" />
                        <span>Check if the PC is on and the app is running.</span>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    Control
                    <Badge variant={isLocked ? "default" : "secondary"} className={isLocked ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}>
                        {isLocked ? 'Locked' : 'Unlocked'}
                    </Badge>
                </CardTitle>
                <CardDescription>Manage the lock state of this PC</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-6">
                <div className={`rounded-full p-6 ${isLocked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {isLocked ? <Lock className="h-12 w-12" /> : <Unlock className="h-12 w-12" />}
                </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-4">
                <Button
                    variant="outline"
                    className="flex-1 border-red-200 hover:bg-red-50 text-red-700"
                    onClick={handleLock}
                    disabled={isLoading || isLocked === true}
                >
                    {isLoading && isLocked === false ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
                    Lock
                </Button>
                <Button
                    variant="outline"
                    className="flex-1 border-green-200 hover:bg-green-50 text-green-700"
                    onClick={handleUnlock}
                    disabled={isLoading || isLocked === false}
                >
                    {isLoading && isLocked === true ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Unlock className="mr-2 h-4 w-4" />}
                    Unlock
                </Button>
            </CardFooter>
        </Card>
    )
}
