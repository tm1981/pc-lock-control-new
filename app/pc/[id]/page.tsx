import { PcPanel } from '@/components/pc-panel'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Settings } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { fetchPcState, findPc } from '@/lib/pcs'

export const dynamic = 'force-dynamic'

export default async function PCDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const pc = await findPc(Number(id))
  if (!pc) notFound()

  const state = await fetchPcState(pc)

  return (
    <main className="container mx-auto p-4 md:p-8 max-w-2xl space-y-8">
      <div>
        <Button variant="ghost" asChild className="mb-4 pl-0 hover:bg-transparent">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{pc.name}</h1>
            <p className="text-muted-foreground font-mono text-sm">{pc.url}:{pc.port}</p>
          </div>
          <Button variant="outline" size="icon" asChild aria-label="Edit PC">
            <Link href={`/pc/${pc.id}/edit`}>
              <Settings className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <PcPanel pcId={pc.id} initialState={state} />
    </main>
  )
}
