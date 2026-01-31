'use client'

import { useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { createPc, updatePc } from '@/app/actions/db'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
    name: z.string().min(2, {
        message: 'Name must be at least 2 characters.',
    }),
    url: z.string().min(1, {
        message: 'URL is required.',
    }),
    port: z.coerce.number().min(1).max(65535),
    password: z.string().min(1, {
        message: 'Password is required.',
    }),
})

interface PCConnectionFormProps {
    initialData?: {
        id: number
        name: string
        url: string
        port: number
        password?: string
    }
    onSuccess?: () => void
}

export function PCConnectionForm({ initialData, onSuccess }: PCConnectionFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    // Explicitly define the form values type to match inferred schema
    type FormValues = z.infer<typeof formSchema>

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema) as Resolver<FormValues>,
        defaultValues: {
            name: initialData?.name || '',
            url: initialData?.url || '127.0.0.1',
            port: initialData?.port || 8765,
            password: initialData?.password || '',
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        try {
            if (initialData) {
                await updatePc(initialData.id, values)
                toast.success('PC updated successfully')
            } else {
                await createPc(values)
                toast.success('PC added successfully')
            }
            form.reset()
            onSuccess?.()
            router.refresh()
        } catch (error) {
            toast.error('Something went wrong')
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="My Gaming PC" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="url"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>IP Address / Hostname</FormLabel>
                                <FormControl>
                                    <Input placeholder="192.168.1.100" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="port"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Port</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="8765" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="API Password" {...field} />
                            </FormControl>
                            <FormDescription>
                                The password configured in the PC Lock app.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isLoading} className="w-full cursor-pointer">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? 'Update PC' : 'Add PC'}
                </Button>
            </form>
        </Form>
    )
}
