import { WorkspaceSidebar } from "./_components/WorkspaceSidebar"
import { getQueryClient, HydrateClient } from "@/lib/query/hydration"
import { orpc } from "@/lib/orpc"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { WorkspaceHeader } from "./_components/WorkspaceHeader"
import { ChannelList } from "./_components/ChannelList"
import { WorkspaceMembersList } from "./_components/WorkspaceMembersList"

const ChannelListLayout = async ({ children }: { children: React.ReactNode }) => {
    const queryClient = getQueryClient()
    await queryClient.prefetchQuery(orpc.channel.list.queryOptions())

    const hydratedHeader = (
        <HydrateClient client={queryClient}>
            <Suspense fallback={<Skeleton className="h-6 w-32" />}>
                <WorkspaceHeader />
            </Suspense>
        </HydrateClient>
    )

    const hydratedChannelList = (
        <HydrateClient client={queryClient}>
            <Suspense fallback={
                <div className="space-y-1 py-1">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-7 w-full" />)}
                </div>
            }>
                <ChannelList />
            </Suspense>
        </HydrateClient>
    )

    const hydratedMembersList = (
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
    )

    return (
        <div className="flex h-full w-full">
            <WorkspaceSidebar
                hydratedHeader={hydratedHeader}
                hydratedChannelList={hydratedChannelList}
                hydratedMembersList={hydratedMembersList}
            />
            <div className="flex-1 h-full min-w-0 overflow-hidden">
                {children}
            </div>
        </div>
    )
}

export default ChannelListLayout
