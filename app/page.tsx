import { PCList } from '@/components/pc-list'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { Plus, LogOut, Monitor, Shield } from 'lucide-react'
import { logout } from '@/app/actions/auth'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <main className="container mx-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Manage and control your PCs remotely.</p>
          <Button asChild className="mt-2">
            <Link href="/add">
              <Plus className="mr-2 h-4 w-4" />
              Add PC
            </Link>
          </Button>
        </div>
        <form action={logout}>
          <Button variant="outline" size="sm" type="submit">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </form>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Monitor className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total PCs</p>
              <p className="text-2xl font-bold">Connected Devices</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
              <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Security</p>
              <p className="text-2xl font-bold">Active Protection</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PC List */}
      <PCList />
    </main>
  )
}
