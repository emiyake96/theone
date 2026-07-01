import React from 'react'
import { WorkspaceList } from './_workspace/WorkspaceList'
import { CreateWorkspace } from './_components/CreateWorkspace'
import { UserNav } from './_components/UserNav'
import { orpc } from '@/lib/orpc'
import { getQueryClient, HydrateClient } from '@/lib/query/hydration'
import { Suspense } from 'react'
import { PresenceHeartbeat } from '@/components/PresenceHeartbeat'

const WorkspaceLayout = async({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery(orpc.workspace.list.queryOptions())
  
  return (
    <div className='flex w-full h-screen'>
      <PresenceHeartbeat />
      <div className='flex h-full w-16 flex-col items-center bg-secondary py-3 px-2 border-r border-border'>
        <HydrateClient client={queryClient}>
          <Suspense fallback={<div className="flex flex-col gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="size-12 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>}>
            <WorkspaceList />
          </Suspense>
        </HydrateClient>
        <div className='mt-4'>
            <CreateWorkspace />
        </div>
        <div className='mt-auto'>
          <HydrateClient client={queryClient}>
            <UserNav />
          </HydrateClient>
        </div>
      </div>
      <div className='flex-1 h-full bg-background'>
        {children}
      </div>
    </div>
    
  )
}

export default WorkspaceLayout
