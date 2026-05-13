import React from 'react'
import { WorkspaceList } from './[workspace]/WorkspaceList'
import { CreateWorkspace } from './_components/CreateWorkspace'
import { UserNav } from './_components/UserNav'

const WorkspaceLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex w-full h-screen'>
      <div className='flex h-full w-16 flex-col items-center bg-secondary py-3 px-2 border-r border-border'>
        <WorkspaceList />
        <div className='mt-4'>
            <CreateWorkspace />
        </div>
        <div className='mt-auto'>
            <UserNav />
        </div>
      </div>
      <div className='flex-1 h-full bg-background'>
        {children}
      </div>
    </div>
  )
}

export default WorkspaceLayout
