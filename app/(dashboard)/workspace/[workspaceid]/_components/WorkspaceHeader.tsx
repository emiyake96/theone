'use client'

import { orpc } from "@/lib/orpc"
import { useSuspenseQuery } from "@tanstack/react-query"

export function WorkspaceHeader() {
    const { data: { currentWorkspace } } = useSuspenseQuery(orpc.channel.list.queryOptions())
    return (
        <div className="flex items-center min-w-0">
            <h2 className='text-lg font-semibold truncate'>{currentWorkspace?.orgName}</h2>
        </div>
    )
}