'use client'

import { buttonVariants } from "@/components/ui/button"
import { orpc } from "@/lib/orpc"
import { cn } from "@/lib/utils"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Hash } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export function ChannelList() {
    const { data: { channels } } = useSuspenseQuery(orpc.channel.list.queryOptions())
    const { workspaceid, channelid } = useParams<{
        workspaceid: string
        channelid: string
    }>()

    return (
        <div className='space-y-0.5 py-1'>
            {channels.map((channel) => {
                const isActive = channel.id === channelid;
                return (
                    <Link
                        key={channel.id}
                        href={`/workspace/${workspaceid}/channel/${channel.id}`}
                        className={cn(
                            buttonVariants({ variant: "ghost" }),
                            'w-full justify-start px-2 py-1 h-7 text-muted-foreground hover:text-accent-foreground hover:bg-accent',
                            isActive && 'bg-accent text-accent-foreground'
                        )}
                    >
                        <Hash className='size-4' />
                        <span className='truncate'>{channel.name}</span>
                    </Link>
                )
            })}
        </div>
    )
}