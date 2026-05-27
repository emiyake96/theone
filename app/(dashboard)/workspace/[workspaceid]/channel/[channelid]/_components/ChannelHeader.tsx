'use client'

import { ThemeToggle } from "@/components/ui/themeToggle";
import { orpc } from "@/lib/orpc";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export function ChannelHeader() {
    const { channelid } = useParams<{ channelid: string }>();
    const { data: { channels } } = useSuspenseQuery(orpc.channel.list.queryOptions())

    const currentChannel = channels.find((c) => c.id === channelid);

    return (
        <div className='flex items-center justify-between h-14 px-4 border-b'>
            <h1 className='text-lg font-semibold'>
                # {currentChannel?.name ?? "Unknown Channel"}
            </h1>
            <div className='flex items-center space-x-2'>
                <ThemeToggle />
            </div>
        </div>
    )
}