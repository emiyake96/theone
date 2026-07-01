'use client'

import { useState } from 'react'
import { MessageInputForm } from './message/MessageInputForm'
import { MessageList } from './MessageList'

export function ChannelView({ channelId }: { channelId: string }) {
    const [isEditing, setIsEditing] = useState(false)

    return (
        <>
            <div className='flex-1 overflow-hidden mb-4'>
                <MessageList onEditingChange={setIsEditing} />
            </div>
            {!isEditing && (
                <div className='border-t bg-background p-4'>
                    <MessageInputForm channelId={channelId} />
                </div>
            )}
        </>
    )
}
