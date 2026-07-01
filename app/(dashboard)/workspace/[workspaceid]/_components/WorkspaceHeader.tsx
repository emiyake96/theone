'use client'

import { orpc } from "@/lib/orpc"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAvatar } from "@/lib/get-avatar"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { toast } from "sonner"
import { UserPlus, Users } from "lucide-react"

export function WorkspaceHeader() {
    const { data: { currentWorkspace, members } } = useSuspenseQuery(orpc.channel.list.queryOptions())
    const { data: { workspaces } } = useSuspenseQuery(orpc.workspace.list.queryOptions())
    const workspaceName = workspaces.find(w => w.id === currentWorkspace?.orgCode)?.name ?? currentWorkspace?.orgName ?? "Workspace"
    const [inviteOpen, setInviteOpen] = useState(false)
    const [membersOpen, setMembersOpen] = useState(false)
    const [email, setEmail] = useState("")
    const queryClient = useQueryClient()

    const inviteMutation = useMutation(
        orpc.workspace.invite.mutationOptions({
            onSuccess: () => {
                toast.success(`Invitation sent to ${email}`)
                setEmail("")
                setInviteOpen(false)
                queryClient.invalidateQueries({ queryKey: orpc.channel.list.queryKey() })
            },
            onError: (error) => {
                toast.error(error.message ?? "Failed to invite member")
            }
        })
    )

    return (
        <div className="flex items-center justify-between w-full min-w-0">
            <h2 className='text-lg font-semibold truncate'>{workspaceName}</h2>
            <div className="flex items-center gap-1 ml-2 shrink-0">
                {/* Invite Members */}
                <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                            <UserPlus className="size-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Invite Member</DialogTitle>
                            <DialogDescription>Enter an email address to invite someone to this workspace.</DialogDescription>
                        </DialogHeader>
                        <div className="flex gap-2 mt-2">
                            <Input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && email) inviteMutation.mutate({ email })
                                }}
                            />
                            <Button
                                disabled={!email || inviteMutation.isPending}
                                onClick={() => inviteMutation.mutate({ email })}
                            >
                                {inviteMutation.isPending ? "Inviting..." : "Invite"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* View Members */}
                <Dialog open={membersOpen} onOpenChange={setMembersOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                            <Users className="size-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>{workspaceName}</DialogTitle>
                            <DialogDescription>{members.length} member{members.length !== 1 ? "s" : ""} in this workspace</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-1 mt-2 max-h-80 overflow-y-auto">
                            {members.map((member) => (
                                <div key={member.id} className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-accent">
                                    <Avatar className="size-8">
                                        <AvatarImage src={getAvatar(member.picture ?? null, member.email!)} alt={member.full_name ?? "User"} />
                                        <AvatarFallback>{member.full_name?.charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium truncate">{member.full_name}</p>
                                        <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
