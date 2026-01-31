import { PCList } from '@/components/pc-list'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <main className="container mx-auto p-4 md:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">PC Lock Control</h1>
          <p className="text-muted-foreground">Manage and schedule your PC locks remotely.</p>
        </div>
        <Button asChild>
          <Link href="/add">
            <Plus className="mr-2 h-4 w-4" />
            Add PC
          </Link>
        </Button>
      </div>

      <PCList />
    </main>
  )
}
