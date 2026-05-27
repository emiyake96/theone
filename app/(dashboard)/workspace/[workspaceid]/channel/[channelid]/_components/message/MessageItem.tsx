'use client'

import Image from 'next/image'

interface iAppProps {
    id: string
    content: string
    createdAt: Date
    authorAvatar: string | null
    authorName: string | null
    imageUrl?: string | null
}

export function MessageItem({ id, content, createdAt, authorAvatar, authorName, imageUrl }: iAppProps) {
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
    }).format(createdAt)

    const formattedTime = new Intl.DateTimeFormat('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
    }).format(createdAt)

    return (
        <div className="flex space-x-3 relative p-3 rounded-lg group hover:bg-muted/50">
            {authorAvatar ? (
                <Image
                    src={authorAvatar}
                    alt={authorName ?? 'User'}
                    width={32}
                    height={32}
                    className="size-8 rounded-lg shrink-0"
                />
            ) : (
                <div className="size-8 rounded-lg bg-muted shrink-0 flex items-center justify-center text-xs font-semibold">
                    {authorName?.charAt(0).toUpperCase() ?? '?'}
                </div>
            )}
            <div className="flex-1 space-y-2 min-w-0">
                <div className="flex items-center gap-x-2">
                    <p className="font-medium leading-none">{authorName ?? 'Unknown'}</p>
                    <p className="text-xs text-muted-foreground leading-none" suppressHydrationWarning>
                        {formattedDate}{"  "}{formattedTime}
                    </p>
                </div>
                {content && (
                    <div
                        className="prose prose-sm dark:prose-invert max-w-none break-words [&>p]:leading-snug [&>p:last-child]:mb-0"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                )}
                {imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={imageUrl}
                        alt="Attached image"
                        className="max-h-64 max-w-xs rounded-lg border border-border object-cover"
                    />
                )}
            </div>
        </div>
    )
}
