import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { CreateNewChannel } from "./_components/CreateNewChannel"
import { WorkspaceHeader } from "./_components/WorkspaceHeader"
import { ChevronDown, ChevronUp } from "lucide-react"
import { ChannelList } from "./_components/ChannelList"
import { WorkspaceMembersList } from "./_components/WorkspaceMembersList"
import { getQueryClient, HydrateClient } from "@/lib/query/hydration"
import { orpc } from "@/lib/orpc"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

const ChannelListLayout = async ({children}: {children: React.ReactNode}) => {
    const queryClient = getQueryClient()
    await queryClient.prefetchQuery(orpc.channel.list.queryOptions())
    return (
        <div className="flex h-full w-full">
            <div className="flex h-full w-80 flex-col bg-secondary border-r border-border">
                <div className="flex items-center px-4 h-14 border-b border-border">
                    <HydrateClient client={queryClient}>
                        <Suspense fallback={<Skeleton className="h-6 w-32" />}>
                            <WorkspaceHeader />
                        </Suspense>
                    </HydrateClient>
                </div>
                <div className='px-4 py-2'>
                    <CreateNewChannel />
                </div>
                {/* Channel List */}
                <div className='flex-1 overflow-y-auto px-4'>
                    <Collapsible defaultOpen>
                        <CollapsibleTrigger className='flex w-full items-center justify-between px-2 py-1 text-sm font-medium text-muted-foreground [&[data-state=open]>svg]:rotate-180'>
                            Main
                            <ChevronDown className='size-4 transition-transform duration-200' />
                        </CollapsibleTrigger>
                        {/*
                          * forceMount keeps children always in the DOM and uses CSS to hide/show,
                          * instead of mounting/unmounting. This prevents the server/client hydration
                          * mismatch where CollapsibleContent renders children on the server but
                          * produces null on the first client render before state initializes.
                          */}
                        <CollapsibleContent forceMount>
                            <HydrateClient client={queryClient}>
                                <Suspense fallback={
                                    <div className="space-y-1 py-1">
                                        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-7 w-full" />)}
                                    </div>
                                }>
                                    <ChannelList />
                                </Suspense>
                            </HydrateClient>
                        </CollapsibleContent>
                    </Collapsible>
                </div>
                { /* Members */}
                <div className='px-4 py-2 border-t border-border'>
                    <Collapsible defaultOpen>
                        <CollapsibleTrigger 
                        className='flex w-full items-center justify-between px-2 py-1 text-sm font-medium text-muted-foreground [&[data-state=open]>svg]:rotate-180'>
                            Members
                            <ChevronUp className='size-4 transition-transform duration-200' />
                        </CollapsibleTrigger>
                        <CollapsibleContent forceMount>
                            {/* Member List */}
                            <HydrateClient client={queryClient}>
                                <Suspense fallback={
                                    <div className="space-y-2 py-1">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="flex items-center space-x-3 px-3 py-2">
                                                <Skeleton className="size-8 rounded-full" />
                                                <div className="space-y-1 flex-1">
                                                    <Skeleton className="h-3 w-24" />
                                                    <Skeleton className="h-3 w-32" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                }>
                                    <WorkspaceMembersList />
                                </Suspense>
                            </HydrateClient>
                        </CollapsibleContent>
                    </Collapsible>
                </div>
            </div>
            <div className='flex-1 h-full min-w-0 overflow-hidden'>
                {children}
            </div>
        </div>
    )
}

export default ChannelListLayout