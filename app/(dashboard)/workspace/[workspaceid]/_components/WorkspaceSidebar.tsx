'use client'

import { useState } from 'react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { CreateNewChannel } from "./CreateNewChannel"
import { WorkspaceHeader } from "./WorkspaceHeader"
import { ChannelList } from "./ChannelList"
import { WorkspaceMembersList } from "./WorkspaceMembersList"
import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"

interface WorkspaceSidebarProps {
    hydratedHeader: React.ReactNode
    hydratedChannelList: React.ReactNode
    hydratedMembersList: React.ReactNode
}

export function WorkspaceSidebar({
    hydratedHeader,
    hydratedChannelList,
    hydratedMembersList,
}: WorkspaceSidebarProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true)

    return (
        <div className="relative flex h-full shrink-0">
            {/* Toggle button — sits on the edge of the sidebar */}
            <button
                onClick={() => setSidebarOpen(o => !o)}
                className="absolute -right-3 top-[60px] z-20 flex size-6 items-center justify-center rounded-full border border-border bg-background shadow-sm hover:bg-accent transition-colors"
                title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
            >
                {sidebarOpen
                    ? <PanelLeftClose className="size-3 text-muted-foreground" />
                    : <PanelLeftOpen className="size-3 text-muted-foreground" />
                }
            </button>

            {/* Sidebar panel */}
            <div
                className={`h-full flex flex-col bg-secondary border-r border-border overflow-hidden transition-all duration-200 ${
                    sidebarOpen ? 'w-72' : 'w-0 border-r-0'
                }`}
            >
                <div className="flex items-center px-4 h-14 border-b border-border shrink-0">
                    {hydratedHeader}
                </div>
                <div className="px-4 py-2 shrink-0">
                    <CreateNewChannel />
                </div>

                {/* Channels */}
                <div className="flex-1 overflow-y-auto px-4">
                    <Collapsible defaultOpen>
                        <CollapsibleTrigger className="flex w-full items-center justify-between px-2 py-1 text-sm font-medium text-muted-foreground [&[data-state=open]>svg]:rotate-180">
                            Channels
                            <ChevronDown className="size-4 transition-transform duration-200" />
                        </CollapsibleTrigger>
                        <CollapsibleContent >
                            {hydratedChannelList}
                        </CollapsibleContent>
                    </Collapsible>
                </div>

                {/* Members */}
                <div className="px-4 py-2 border-t border-border shrink-0">
                    <Collapsible defaultOpen>
                        <CollapsibleTrigger className="flex w-full items-center justify-between px-2 py-1 text-sm font-medium text-muted-foreground [&[data-state=closed]>svg]:rotate-180">
                            Members
                            <ChevronDown className="size-4 transition-transform duration-200" />
                        </CollapsibleTrigger>
                        <CollapsibleContent >
                            {hydratedMembersList}
                        </CollapsibleContent>
                    </Collapsible>
                </div>
            </div>
        </div>
    )
}
