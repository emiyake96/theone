import { client } from '@/lib/orpc'
import { redirect } from 'next/navigation'
import React from 'react'

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
    <div>
        <h1>Workspace Page </h1>
    </div>
  )
}

export default workSpaceId