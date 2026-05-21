import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Monitor, Settings, Plus } from 'lucide-react'
import { getPcs } from '@/app/actions/db'
import { DeleteButton } from './delete-button'

export async function PCList() {
  const pcs = await getPcs()

  if (pcs.length === 0) {
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

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Your Devices</h2>
        <Badge variant="secondary">{pcs.length} {pcs.length === 1 ? 'PC' : 'PCs'}</Badge>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pcs.map((pc) => (
          <Card key={pc.id} className="flex flex-col transition-shadow hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Monitor className="h-5 w-5 text-muted-foreground" />
                  {pc.name}
                </CardTitle>
                <Badge variant="outline">Online</Badge>
              </div>
              <CardDescription className="font-mono text-xs">{pc.url}:{pc.port}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-3">
              <div className="rounded-lg bg-muted p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Host</span>
                  <span className="font-medium">{pc.url}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Port</span>
                  <span className="font-mono">{pc.port}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2 pt-0">
              <Button variant="default" asChild className="flex-1">
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
    </>
  )
}
