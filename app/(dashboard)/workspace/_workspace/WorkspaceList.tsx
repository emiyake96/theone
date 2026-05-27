"use client"

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { orpc } from "@/lib/orpc";
import { cn } from "@/lib/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

const getWorkspaceColor = (id: string) => {
    const charSum = id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colorCombinations[charSum % colorCombinations.length];
}

export function WorkspaceList() {
    const { data: { workspaces, currentWorkspace } } = useSuspenseQuery(orpc.workspace.list.queryOptions())
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleWorkspaceSwitch = (orgCode: string) => {
        if (!mounted) return;
        const loginUrl = `/api/auth/login?org_code=${orgCode}&post_login_redirect_url=/workspace/${orgCode}`;
        router.push(loginUrl);
    };

    return (
        <TooltipProvider>
            <div className="flex flex-col gap-2">
                {workspaces.map((workspace) => {
                    const isActive = currentWorkspace.orgCode === workspace.id;
                    return (
                        <Tooltip key={workspace.id}>
                            <TooltipTrigger asChild>
                                <Button
                                    size="icon"
                                    onClick={() => handleWorkspaceSwitch(workspace.id)}
                                    className={cn(
                                        'size-12 transition-all duration-200',
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
                    )
                })}
            </div>
        </TooltipProvider>
    )
}