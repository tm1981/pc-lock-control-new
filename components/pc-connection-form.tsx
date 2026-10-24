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
import type { PcSummary } from '@/lib/types'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const baseSchema = z.object({
    name: z.string().trim().min(2, {
        message: 'Name must be at least 2 characters.',
    }),
    url: z
        .string()
        .trim()
        .min(1, { message: 'Host is required.' })
        .regex(/^[A-Za-z0-9.-]+$/, { message: 'Use an IP address or host name, without http:// or a port.' }),
    port: z.coerce.number().int().min(1).max(65535),
})

const createSchema = baseSchema.extend({
    password: z.string().min(1, { message: 'Password is required.' }),
})
const editSchema = baseSchema.extend({ password: z.string() })

type FormValues = z.infer<typeof editSchema>

interface PCConnectionFormProps {
    initialData?: PcSummary
    onSuccess?: () => void
}

export function PCConnectionForm({ initialData, onSuccess }: PCConnectionFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const isEdit = Boolean(initialData)

    const form = useForm<FormValues>({
        resolver: zodResolver(isEdit ? editSchema : createSchema) as Resolver<FormValues>,
        defaultValues: {
            name: initialData?.name ?? '',
            url: initialData?.url ?? '127.0.0.1',
            port: initialData?.port ?? 8765,
            password: '',
        },
    })

    async function onSubmit(values: FormValues) {
        setIsLoading(true)
        try {
            const result = initialData ? await updatePc(initialData.id, values) : await createPc(values)
            if (!result.ok) {
                toast.error(result.error)
                return
            }
            toast.success(initialData ? 'PC updated successfully' : 'PC added successfully')
            onSuccess?.()
            router.push(`/pc/${result.data.id}`)
            router.refresh()
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
                                <Input
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder={isEdit ? 'Leave blank to keep the current password' : 'API Password'}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                The unlock password configured in the PC Lock app.
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
