import Image from 'next/image'

interface iAppProps {
    id: number;
    message: string;
    date: Date;
    avatar: string;
    username: string;
}

export function MessageItem({ id, message, date, avatar, username }: iAppProps) {
    return (
        <div className='flex space-x-3 relative p-3 rounded-lg group hover:bg-muted/50'>
            <Image src={avatar} alt='User Avatar' width={32} height={32} className='size-8 rounded-lg' />
            <div className='flex-1 space-y-1 min-w-0'>
                <div className='flex items-center gap-x-2'>
                    <p className='font-medium leading-none'>{username}</p>
                    <p className='text-xs text-muted-foreground leading-none'>
                        {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)}
                        {"  "}
                        {new Intl.DateTimeFormat('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }).format(date)}
                    </p>
                </div>
                <p className='text-sm break-word max-w-none'>{message}</p>
            </div>
        </div>
    )
}