"use client"

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { orpc } from "@/lib/orpc";
import { cn } from "@/lib/utils";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

const colorCombinations = [
    'bg-blue-500 hover:bg-blue-600 text-white',
    'bg-emerald-500 hover:bg-green-600 text-white',
    'bg-amber-500 hover:bg-red-600 text-white',
    'bg-rose-500 hover:bg-yellow-600 text-white',
    'bg-purple-500 hover:bg-purple-600 text-white',
    'bg-indigo-500 hover:bg-indigo-600 text-white',
    'bg-cyan-500 hover:bg-cyan-600 text-white',
    'bg-pink-500 hover:bg-pink-600 text-white',
]

const STORAGE_KEY = "workspace-order"

const getWorkspaceColor = (id: string) => {
    const charSum = id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colorCombinations[charSum % colorCombinations.length];
}

export function WorkspaceList() {
    const { data: { workspaces, currentWorkspace } } = useSuspenseQuery(orpc.workspace.list.queryOptions())
    const [isPending, setIsPending] = useState(false);
    const [ordered, setOrdered] = useState(workspaces)
    const dragIndex = useRef<number | null>(null)
    const dragOverIndex = useRef<number | null>(null)

    // Apply saved order on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (!saved) { setOrdered(workspaces); return }
        const savedOrder: string[] = JSON.parse(saved)
        const sorted = [...workspaces].sort((a, b) => {
            const ai = savedOrder.indexOf(a.id)
            const bi = savedOrder.indexOf(b.id)
            if (ai === -1) return 1
            if (bi === -1) return -1
            return ai - bi
        })
        setOrdered(sorted)
    }, [workspaces])

    const saveOrder = (items: typeof workspaces) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items.map(w => w.id)))
    }

    const handleDragStart = (index: number) => {
        dragIndex.current = index
    }

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault()
        dragOverIndex.current = index
    }

    const handleDrop = () => {
        if (dragIndex.current === null || dragOverIndex.current === null) return
        if (dragIndex.current === dragOverIndex.current) return

        const next = [...ordered]
        const [moved] = next.splice(dragIndex.current, 1)
        next.splice(dragOverIndex.current, 0, moved)
        setOrdered(next)
        saveOrder(next)
        dragIndex.current = null
        dragOverIndex.current = null
    }

    const handleWorkspaceSwitch = (orgCode: string) => {
        if (!orgCode || isPending) return;
        setIsPending(true);
        window.location.href = `/api/auth/login?org_code=${orgCode}&post_login_redirect_url=/workspace/${orgCode}`;
    };

    const deleteWorkspaceMutation = useMutation(
        orpc.workspace.delete.mutationOptions({
            onSuccess: () => {
                toast.success("Workspace deleted");
                window.location.href = `/api/auth/login?post_login_redirect_url=/workspace`;
            },
            onError: (error) => {
                toast.error(`Failed to delete workspace: ${error.message}`);
            }
        })
    );

    return (
        <TooltipProvider>
            <div className="flex flex-col gap-2">
                {ordered.map((workspace, index) => {
                    const isActive = currentWorkspace?.orgCode === workspace.id;
                    return (
                        <div
                            key={workspace.id}
                            className="relative group"
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDrop={handleDrop}
                        >
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="icon"
                                        disabled={isPending}
                                        onClick={() => handleWorkspaceSwitch(workspace.id)}
                                        className={cn(
                                            'size-12 transition-all duration-200 cursor-grab active:cursor-grabbing',
                                            getWorkspaceColor(workspace.id),
                                            isActive ? 'rounded-lg' : 'rounded-xl'
                                        )}
                                    >
                                        <span className="text-sm font-semibold">{workspace.avatar}</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side='right'>
                                    <p>{workspace.name} {isActive && "(Current)"}</p>
                                </TooltipContent>
                            </Tooltip>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toast(`Delete "${workspace.name}"?`, {
                                        description: "This action cannot be undone.",
                                        action: {
                                            label: "Delete",
                                            onClick: () => deleteWorkspaceMutation.mutate({ orgCode: workspace.id }),
                                        },
                                        cancel: {
                                            label: "Cancel",
                                            onClick: () => {},
                                        },
                                    })
                                }}
                                className="absolute -top-1 -right-1 size-4 rounded-full bg-destructive text-destructive-foreground items-center justify-center hidden group-hover:flex"
                            >
                                <X className="size-2.5" />
                            </button>
                        </div>
                    )
                })}
            </div>
        </TooltipProvider>
    )
}
