import { ChannelHeader } from "./_components/ChannelHeader"
import { MessageInputForm } from "./_components/message/MessageInputForm"
import { MessageList } from "./_components/MessageList"

interface iAppProps {
    params: Promise<{
        workspaceid: string
        channelid: string
    }>
}

const ChannelPageMain = async ({ params }: iAppProps) => {
    const { channelid } = await params
    return (
        <div className='flex h-full w-full'>
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