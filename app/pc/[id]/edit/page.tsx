import { PCConnectionForm } from '@/components/pc-connection-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { getPc } from '@/app/actions/db'
import { notFound } from 'next/navigation'

export default async function EditPCPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const pc = await getPc(parseInt(id))

    if (!pc) {
        notFound()
    }

    return (
        <main className="container mx-auto p-4 md:p-8 max-w-2xl space-y-8">
            <div>
                <Button variant="ghost" asChild className="mb-4 pl-0 hover:bg-transparent">
                    <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">Edit PC</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Edit Connection Details</CardTitle>
                    <CardDescription>
                        Update the IP address or credentials.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <PCConnectionForm initialData={pc} />
                </CardContent>
            </Card>
        </main>
    )
}
