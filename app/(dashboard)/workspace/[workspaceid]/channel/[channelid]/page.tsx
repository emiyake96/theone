import { ChannelHeader } from "./_components/ChannelHeader"
import { ChannelView } from "./_components/ChannelView"

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
                <ChannelView channelId={channelid} />
            </div>
        </div>
    )
}

export default ChannelPageMain