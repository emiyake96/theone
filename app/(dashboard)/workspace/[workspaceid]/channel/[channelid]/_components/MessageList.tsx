'use client'

import { useQuery } from "@tanstack/react-query"
import { MessageItem } from "./message/MessageItem"
import { orpc } from "@/lib/orpc"
import { useParams } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"

export function MessageList() {
    const { channelid } = useParams<{ channelid: string }>()

    const { data: messages = [], isLoading } = useQuery(
        orpc.message.list.queryOptions({ input: { channelId: channelid } })
    )

    if (isLoading) {
        return (
            <div className="flex flex-col gap-3 px-4 py-2">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex space-x-3 p-3">
                        <Skeleton className="size-8 rounded-lg shrink-0" />
                        <div className="space-y-2 flex-1">
                            <div className="flex gap-2">
                                <Skeleton className="h-3 w-24" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                            <Skeleton className="h-3 w-3/4" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (messages.length === 0) {
        return (
            <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                No messages yet. Be the first to say something!
            </div>
        )
    }

    return (
        <div className="relative h-full">
            <div className="h-full overflow-y-auto px-4 py-2">
                {messages.map((message) => (
                    <MessageItem
                        key={message.id}
                        id={message.id}
                        content={message.content}
                        createdAt={new Date(message.createdAt)}
                        authorAvatar={message.authorAvatar ?? null}
                        authorName={message.authorName}
                        imageUrl={message.imageUrl ?? null}
                    />
                ))}
            </div>
        </div>
    )
}
