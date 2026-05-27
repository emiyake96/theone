'use client'

import { useParams } from "next/navigation";
import { ChannelHeader } from "./_components/ChannelHeader"
import { MessageInputForm } from "./_components/message/MessageInputForm"
import { MessageList } from "./_components/MessageList"

const ChannelPageMain = () => {
    const { channelid } = useParams<{ channelid: string }>();
    return (
        <div className='flex h-screen w-full'>
            <div className='flex flex-col flex-1 min-w-0'>
                <ChannelHeader />
                <div className='flex-1 overflow-hidden mb-4'>
                    <MessageList />
                </div>
                <div className='border-t bg-background p-4'>
                    <MessageInputForm channelId={channelid} />
                </div>
            </div>
        </div>
    )
}

export default ChannelPageMain