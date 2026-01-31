import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Monitor, Settings } from 'lucide-react'
import { getPcs } from '@/app/actions/db'
import { DeleteButton } from './delete-button'

export async function PCList() {
  const pcs = await getPcs()

  if (pcs.length === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>No PCs Configured</CardTitle>
          <CardDescription>Add a PC to get started.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild>
            <Link href="/add">Add PC</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {pcs.map((pc) => (
        <Card key={pc.id} className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              {pc.name}
            </CardTitle>
            <CardDescription>{pc.url}:{pc.port}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            {/* Status could be fetched here, but might cause N+1 waterfall.
                Keep it simple for list view. */}
          </CardContent>
          <CardFooter className="flex justify-between gap-2">
            <Button variant="secondary" asChild className="flex-1">
              <Link href={`/pc/${pc.id}`}>Control</Link>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <Link href={`/pc/${pc.id}/edit`}>
                <Settings className="h-4 w-4" />
              </Link>
            </Button>
            <DeleteButton id={pc.id} />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
