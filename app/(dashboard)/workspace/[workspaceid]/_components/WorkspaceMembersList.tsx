'use client'

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getAvatar } from "@/lib/get-avatar"
import { orpc } from "@/lib/orpc"
import { useSuspenseQuery, useQuery } from "@tanstack/react-query"

type PresenceData = {
    onlineUserIds: string[]
    lastSeenMap: Record<string, string>
}

export function useOnlineUsers() {
    return useQuery({
        queryKey: ['presence'],
        queryFn: async (): Promise<PresenceData> => {
            const res = await fetch('/api/presence')
            const data = await res.json()
            return {
                onlineUserIds: data.onlineUserIds ?? [],
                lastSeenMap: data.lastSeenMap ?? {},
            }
        },
        refetchInterval: 30_000,
        staleTime: 20_000,
    })
}

export function PresenceDot({ isOnline }: { isOnline: boolean }) {
    return (
        <span className={`absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-background ${
            isOnline ? 'bg-green-500' : 'bg-muted-foreground'
        }`} />
    )
}

function formatLastSeen(lastSeenIso: string | undefined, isOnline: boolean): string {
    if (isOnline) return 'Currently online'
    if (!lastSeenIso) return 'Never'
    const date = new Date(lastSeenIso)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60_000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

type Member = {
    id?: string | null
    full_name?: string | null
    email?: string | null
    picture?: string | null
}

function MemberProfileModal({
    member,
    isOnline,
    lastSeenIso,
    open,
    onClose,
}: {
    member: Member
    isOnline: boolean
    lastSeenIso: string | undefined
    open: boolean
    onClose: () => void
}) {
    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="sm:max-w-xs">
                <DialogHeader>
                    <DialogTitle className="sr-only">Member Profile</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center gap-4 py-2">
                    <div className="relative">
                        <Avatar className="size-20">
                            <AvatarImage
                                src={getAvatar(member.picture ?? null, member.email ?? null)}
                                alt={member.full_name ?? 'User'}
                            />
                            <AvatarFallback className="text-2xl">
                                {member.full_name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <span className={`absolute bottom-1 right-1 size-3.5 rounded-full border-2 border-background ${
                            isOnline ? 'bg-green-500' : 'bg-muted-foreground'
                        }`} />
                    </div>
                    <div className="text-center space-y-1">
                        <p className="text-base font-semibold">{member.full_name ?? 'Unknown'}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                    <div className="w-full rounded-md bg-muted/50 px-4 py-2.5 text-center">
                        <p className="text-xs text-muted-foreground mb-0.5">Last online</p>
                        <p className={`text-sm font-medium ${isOnline ? 'text-green-500' : ''}`}>
                            {formatLastSeen(lastSeenIso, isOnline)}
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export function WorkspaceMembersList() {
    const { data: { members } } = useSuspenseQuery(orpc.channel.list.queryOptions())
    const { data } = useOnlineUsers()
    const onlineUserIds = data?.onlineUserIds ?? []
    const lastSeenMap = data?.lastSeenMap ?? {}

    const [selectedMember, setSelectedMember] = useState<Member | null>(null)

    return (
        <>
        <div className='space-y-0.5 py-1'>
            {members.map((member) => {
                const isOnline = !!member.id && onlineUserIds.includes(member.id)
                return (
                    <div
                        key={member.id}
                        onClick={() => setSelectedMember(member)}
                        className='px-3 py-2 hover:bg-accent cursor-pointer transition-colors flex items-center space-x-3'>
                        <div className='relative shrink-0'>
                            <Avatar className='size-8'>
                                <AvatarImage
                                    src={getAvatar(member.picture ?? null, member.email!)}
                                    alt={member.full_name ?? 'User'}
                                />
                                <AvatarFallback>
                                    {member.full_name?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <PresenceDot isOnline={isOnline} />
                        </div>
                        <div className='flex-1 min-w-0'>
                            <p className='truncate text-sm font-medium'>{member.full_name}</p>
                            <p className='text-xs text-muted-foreground truncate'>{member.email}</p>
                        </div>
                    </div>
                )
            })}
        </div>

        {selectedMember && (
            <MemberProfileModal
                member={selectedMember}
                isOnline={!!selectedMember.id && onlineUserIds.includes(selectedMember.id)}
                lastSeenIso={selectedMember.id ? lastSeenMap[selectedMember.id] : undefined}
                open={!!selectedMember}
                onClose={() => setSelectedMember(null)}
            />
        )}
        </>
    )
}
