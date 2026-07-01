'use client'

import { useInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query"
import { MessageItem } from "./message/MessageItem"
import { client, orpc } from "@/lib/orpc"
import { useParams } from "next/navigation"
import { useEffect, useRef, useCallback, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2, ArrowDown } from "lucide-react"

const PAGE_SIZE = 30

// Shared key used by MessageList and MessageInputForm for invalidation
export const messagesQueryKey = (channelId: string) => ['messages', channelId] as const

export function MessageList({ onEditingChange }: { onEditingChange?: (editing: boolean) => void }) {
    const { channelid } = useParams<{ channelid: string }>()
    const { data: { user } } = useSuspenseQuery(orpc.workspace.list.queryOptions())
    const scrollRef = useRef<HTMLDivElement>(null)
    const sentinelRef = useRef<HTMLDivElement>(null)
    const isFirstLoad = useRef(true)
    // Saves scroll state before fetching older pages so we can restore position
    const scrollAnchor = useRef<{ scrollHeight: number; scrollTop: number } | null>(null)
    const [newMessageCount, setNewMessageCount] = useState(0)

    function scrollToBottom() {
        const el = scrollRef.current
        if (!el) return
        el.scrollTop = el.scrollHeight
        setNewMessageCount(0)
    }

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: messagesQueryKey(channelid),
        queryFn: ({ pageParam }) =>
            client.message.list({
                channelId: channelid,
                cursor: pageParam,
                limit: PAGE_SIZE,
            }),
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialPageParam: undefined as string | undefined,
        refetchInterval: 3000,
        refetchIntervalInBackground: false,
    })

    // Pages come in newest-first order; reverse so oldest pages render at the top
    const messages = data?.pages.slice().reverse().flatMap((p) => p.messages) ?? []

    // ── Scroll to bottom on first load ─────────────────────────────────────
    useEffect(() => {
        if (!isLoading && isFirstLoad.current && scrollRef.current && messages.length > 0) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
            isFirstLoad.current = false
        }
    }, [isLoading, messages.length])

    // ── Restore scroll position after older messages are prepended ──────────
    useEffect(() => {
        if (!isFetchingNextPage && scrollAnchor.current && scrollRef.current) {
            const { scrollHeight, scrollTop } = scrollAnchor.current
            const delta = scrollRef.current.scrollHeight - scrollHeight
            scrollRef.current.scrollTop = scrollTop + delta
            scrollAnchor.current = null
        }
    }, [isFetchingNextPage])

    // ── Auto-scroll to bottom when a new message arrives and user is near bottom
    const prevLength = useRef(0)
    useEffect(() => {
        const el = scrollRef.current
        if (!el || isFirstLoad.current) return

        const newMessages = messages.length
        const added = newMessages - prevLength.current
        if (added <= 0) {
            prevLength.current = newMessages
            return
        }

        const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
        if (distanceFromBottom < 120) {
            el.scrollTop = el.scrollHeight
            setNewMessageCount(0)
        } else {
            setNewMessageCount(c => c + added)
        }
        prevLength.current = newMessages
    }, [messages.length])

    // ── IntersectionObserver: load older messages when sentinel enters view ──
    const handleIntersect = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                const el = scrollRef.current
                if (el) {
                    scrollAnchor.current = {
                        scrollHeight: el.scrollHeight,
                        scrollTop: el.scrollTop,
                    }
                }
                fetchNextPage()
            }
        },
        [hasNextPage, isFetchingNextPage, fetchNextPage]
    )

    useEffect(() => {
        const sentinel = sentinelRef.current
        const scroller = scrollRef.current
        if (!sentinel || !scroller) return

        const observer = new IntersectionObserver(handleIntersect, {
            root: scroller,
            threshold: 0,
        })
        observer.observe(sentinel)
        return () => observer.disconnect()
    }, [handleIntersect])

    // ── Loading skeleton ────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="flex flex-col gap-3 px-4 py-2">
                {[...Array(5)].map((_, i) => (
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
        <div className="relative h-full flex flex-col">
        {newMessageCount > 0 && (
            <button
                onClick={scrollToBottom}
                className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
            >
                <ArrowDown className="size-3" />
                {newMessageCount} new {newMessageCount === 1 ? 'message' : 'messages'}
            </button>
        )}
        <div ref={scrollRef} className="h-full overflow-y-auto px-4 py-2 flex flex-col">
            {/* Sentinel observed to trigger loading older messages */}
            <div ref={sentinelRef} className="h-px shrink-0" />

            {isFetchingNextPage && (
                <div className="flex justify-center py-3">
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                </div>
            )}

            {!hasNextPage && (
                <p className="text-center text-xs text-muted-foreground py-4">
                    Beginning of conversation
                </p>
            )}

            <div className="flex flex-col justify-end flex-1">
                {messages.map((message) => (
                    <MessageItem
                        key={message.id}
                        id={message.id}
                        content={message.content}
                        createdAt={new Date(message.createdAt)}
                        editedAt={message.editedAt ? new Date(message.editedAt) : null}
                        authorAvatar={message.authorAvatar ?? null}
                        authorName={message.authorName}
                        authorId={message.authorId}
                        currentUserId={user?.id ?? null}
                        imageUrl={message.imageUrl ?? null}
                        channelId={channelid}
                        replies={(message as any).replies ?? []}
                        reactions={(message as any).reactions ?? []}
                        onEditingChange={onEditingChange}
                    />
                ))}
            </div>
        </div>
        </div>
    )
}
