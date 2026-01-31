'use client'

import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { deletePc } from '@/app/actions/db'
import { toast } from 'sonner'

export function DeleteButton({ id }: { id: number }) {
    const handleDelete = async () => {
        try {
            await deletePc(id)
            toast.success("PC removed")
        } catch (e) {
            console.error(e)
            toast.error("Failed to remove PC")
        }
    }

    return (
        <Button variant="destructive" size="icon" onClick={handleDelete} className="cursor-pointer">
            <Trash2 className="h-4 w-4" />
        </Button>
    )
}
