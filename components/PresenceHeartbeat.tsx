'use client'

import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

export function PresenceHeartbeat() {
    const queryClient = useQueryClient()

    useEffect(() => {
        const ping = async () => {
            await fetch('/api/presence', { method: 'POST' })
            queryClient.invalidateQueries({ queryKey: ['presence'] })
        }
        ping()
        const interval = setInterval(ping, 30_000)
        return () => clearInterval(interval)
    }, [queryClient])

    return null
}
