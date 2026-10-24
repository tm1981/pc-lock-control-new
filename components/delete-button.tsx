'use client'

import { useState, useTransition } from 'react'
import { Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { deletePc } from '@/app/actions/db'

export function DeleteButton({ id, name }: { id: number; name: string }) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  const handleDelete = () =>
    startTransition(async () => {
      const result = await deletePc(id)
      if (result.ok) {
        toast.success(`${name} removed`)
        setOpen(false)
      } else {
        toast.error(result.error)
      }
    })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="icon" className="cursor-pointer" aria-label={`Remove ${name}`}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove {name}?</DialogTitle>
          <DialogDescription>
            This only removes it from the control panel. The PC Lock app on the PC keeps running with its current schedule.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleDelete} disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
