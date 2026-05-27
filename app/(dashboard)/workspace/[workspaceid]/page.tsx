import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { client } from '@/lib/orpc'
import { Cloud } from 'lucide-react'
import { redirect } from 'next/navigation'
import React from 'react'
import { CreateNewChannel } from './_components/CreateNewChannel'

interface iAppProps {
    params: Promise<{
        workspaceid: string
    }>
}

const workSpaceId = async({ params }: iAppProps) => {
  const { workspaceid } = await params
  const { channels } = await client.channel.list()

  if(channels.length > 0){
    return redirect(`/workspace/${workspaceid}/channel/${channels[0].id}`)
  }
  return (
    <div className='h-full flex p-5'>
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Cloud />
          </EmptyMedia>
          <EmptyTitle>No Channels Yet</EmptyTitle>
          <EmptyDescription>
            Add a new channel to get started.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className='max-w-xs mx-auto'>
          <CreateNewChannel />
        </EmptyContent>
      </Empty>
    </div>

  )
}

export default workSpaceId