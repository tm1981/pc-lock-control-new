import { Suspense } from 'react'
import { PCList } from '@/components/pc-list'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { Plus, LogOut } from 'lucide-react'
import { logout } from '@/app/actions/auth'

export const dynamic = 'force-dynamic'

function PCListSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <Card key={i}>
          <CardContent className="space-y-3 pt-6">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function Home() {
  return (
    <main className="container mx-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Manage and control your PCs remotely.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/add">
              <Plus className="mr-2 h-4 w-4" />
              Add PC
            </Link>
          </Button>
          <form action={logout}>
            <Button variant="outline" type="submit">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </form>
        </div>
      </div>

      {/* PCs are queried live; stream them in so the header renders immediately */}
      <Suspense fallback={<PCListSkeleton />}>
        <PCList />
      </Suspense>
    </main>
  )
}
