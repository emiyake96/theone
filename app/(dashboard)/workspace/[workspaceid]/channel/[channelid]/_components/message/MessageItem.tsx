'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { orpc } from '@/lib/orpc'
import { messagesQueryKey } from '../MessageList'
import { Button } from '@/components/ui/button'
import { Pencil, X, Check, Reply, Smile, Loader2 } from 'lucide-react'
import { SparklesSnake } from './SparklesSnake'
import { toast } from 'sonner'
import { RichTextEditor } from '@/components/rich-text-editor/Editor'
import dynamic from 'next/dynamic'
import emojiData from '@emoji-mart/data'

const Picker = dynamic(() => import('@emoji-mart/react'), { ssr: false })

interface ReactionData {
    id: string
    emoji: string
    userId: string
    messageId: string
}

interface ReplyMessage {
    id: string
    content: string
    createdAt: Date | string
    editedAt?: Date | string | null
    authorAvatar: string | null
    authorName: string | null
    authorId: string
    imageUrl?: string | null
    reactions?: ReactionData[]
}

interface iAppProps {
    id: string
    content: string
    createdAt: Date
    editedAt: Date | null
    authorAvatar: string | null
    authorName: string | null
    authorId: string
    currentUserId: string | null
    imageUrl?: string | null
    channelId: string
    replies?: ReplyMessage[]
    reactions?: ReactionData[]
    onEditingChange?: (editing: boolean) => void
}

type ActiveEditor = null | 'edit' | 'reply' | { type: 'reply-edit'; replyId: string }

function groupReactions(reactions: ReactionData[]) {
    const map = new Map<string, ReactionData[]>()
    for (const r of reactions) {
        if (!map.has(r.emoji)) map.set(r.emoji, [])
        map.get(r.emoji)!.push(r)
    }
    return Array.from(map.entries()).map(([emoji, list]) => ({ emoji, count: list.length, userIds: list.map(r => r.userId) }))
}

function ReactionBar({ reactions, currentUserId, onToggle }: {
    reactions: ReactionData[]
    currentUserId: string | null
    onToggle: (emoji: string) => void
}) {
    const grouped = groupReactions(reactions)
    if (grouped.length === 0) return null
    return (
        <div className="flex flex-wrap gap-1 mt-1">
            {grouped.map(({ emoji, count, userIds }) => {
                const reacted = currentUserId ? userIds.includes(currentUserId) : false
                return (
                    <button
                        key={emoji}
                        onClick={() => onToggle(emoji)}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-sm transition-colors ${
                            reacted
                                ? 'bg-primary/10 border-primary/40 text-primary'
                                : 'bg-muted border-border hover:bg-muted/80'
                        }`}
                    >
                        <span>{emoji}</span>
                        <span className="text-xs font-medium">{count}</span>
                    </button>
                )
            })}
        </div>
    )
}

export function MessageItem({
    id, content, createdAt, editedAt, authorAvatar, authorName,
    authorId, currentUserId, imageUrl, channelId, replies = [], reactions = [], onEditingChange
}: iAppProps) {
    const [activeEditor, setActiveEditor] = useState<ActiveEditor>(null)
    const [editContent, setEditContent] = useState("")
    const [replyContent, setReplyContent] = useState("")
    const [replyEditContent, setReplyEditContent] = useState("")
    const [replyImageFile, setReplyImageFile] = useState<File | null>(null)
    const [replyImagePreview, setReplyImagePreview] = useState<string | null>(null)
    const [threadOpen, setThreadOpen] = useState(false)
    const [showPicker, setShowPicker] = useState(false)
    const [pickerTarget, setPickerTarget] = useState<string | null>(null) // null = main, else replyId
    const pickerRef = useRef<HTMLDivElement>(null)
    const [summary, setSummary] = useState<string | null>(null)
    const [summaryLoading, setSummaryLoading] = useState(false)
    const [summaryError, setSummaryError] = useState<string | null>(null)
    const [showSummary, setShowSummary] = useState(false)
    const [sparklesHovered, setSparklesHovered] = useState(false)
    const queryClient = useQueryClient()
    const isOwn = currentUserId === authorId

    const formatDate = (date: Date) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)
    const formatTime = (date: Date) => new Intl.DateTimeFormat('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }).format(date)
    const hasText = (html: string) => html.replace(/<[^>]*>/g, '').trim().length > 0

    const openEdit = () => { setEditContent(content); setActiveEditor('edit'); onEditingChange?.(true) }
    const openReply = () => { setReplyContent(""); setActiveEditor('reply'); onEditingChange?.(true) }
    const openReplyEdit = (reply: ReplyMessage) => { setReplyEditContent(reply.content); setActiveEditor({ type: 'reply-edit', replyId: reply.id }); onEditingChange?.(true) }
    const closeEditor = () => { setActiveEditor(null); setEditContent(""); setReplyContent(""); setReplyEditContent(""); setReplyImageFile(null); setReplyImagePreview(null); onEditingChange?.(false) }

    const editing = activeEditor === 'edit'
    const replying = activeEditor === 'reply'
    const editingReplyId = typeof activeEditor === 'object' && activeEditor?.type === 'reply-edit' ? activeEditor.replyId : null

    const editMutation = useMutation(orpc.message.edit.mutationOptions({
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: messagesQueryKey(channelId) }); closeEditor() },
        onError: (e) => toast.error(e.message ?? 'Failed to edit message'),
    }))

    const replyMutation = useMutation(orpc.message.create.mutationOptions({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: messagesQueryKey(channelId) })
            closeEditor(); setThreadOpen(true)
        },
        onError: (e) => toast.error(e.message ?? 'Failed to send reply'),
    }))

    const replyEditMutation = useMutation(orpc.message.edit.mutationOptions({
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: messagesQueryKey(channelId) }); closeEditor() },
        onError: (e) => toast.error(e.message ?? 'Failed to edit reply'),
    }))

    const reactionMutation = useMutation(orpc.message.toggleReaction.mutationOptions({
        onSuccess: () => queryClient.invalidateQueries({ queryKey: messagesQueryKey(channelId) }),
        onError: (e) => toast.error(e.message ?? 'Failed to react'),
    }))

    const handleEmojiSelect = (emoji: any, targetMessageId: string) => {
        reactionMutation.mutate({ messageId: targetMessageId, emoji: emoji.native })
        setShowPicker(false)
        setPickerTarget(null)
    }

    const openPicker = (e: React.MouseEvent, target: string | null) => {
        e.stopPropagation()
        setPickerTarget(target)
        setShowPicker(p => pickerTarget === target ? !p : true)
    }

    const handleSummarize = async (e: React.MouseEvent) => {
        e.stopPropagation()
        // Toggle off if already showing
        if (showSummary) { setShowSummary(false); return }
        setShowSummary(true)
        if (summary) return // already fetched
        setSummaryLoading(true)
        setSummaryError(null)
        try {
            const res = await fetch('/api/summarize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content,
                    authorName,
                    replies: replies.map(r => ({ content: r.content, authorName: r.authorName })),
                }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error ?? 'Failed')
            setSummary(data.summary)
        } catch (err: any) {
            setSummaryError(err.message ?? 'Could not generate summary')
        } finally {
            setSummaryLoading(false)
        }
    }

    return (
        <div className="group">
            {/* Main message */}
            <div className="flex space-x-3 relative p-3 rounded-lg group-hover:bg-muted/50">
                <div className="relative shrink-0 size-8 self-start">
                    {authorAvatar ? (
                        <Image src={authorAvatar} alt={authorName ?? 'User'} width={32} height={32} className="size-8 rounded-lg" />
                    ) : (
                        <div className="size-8 rounded-lg bg-muted flex items-center justify-center text-xs font-semibold">
                            {authorName?.charAt(0).toUpperCase() ?? '?'}
                        </div>
                    )}
                </div>
                <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-center gap-x-2">
                        <p className="font-medium leading-none">{authorName ?? 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground leading-none" suppressHydrationWarning>
                            {formatDate(createdAt)}{"  "}{formatTime(createdAt)}
                        </p>
                        {editedAt && (
                            <p className="text-xs text-muted-foreground leading-none italic" suppressHydrationWarning>
                                (edited {formatDate(editedAt)} {formatTime(editedAt)})
                            </p>
                        )}
                    </div>

                    {editing ? (
                        <div className="space-y-2">
                            <RichTextEditor value={editContent} onChange={setEditContent} />
                            <div className="flex gap-2 items-center">
                                <Button size="sm" onClick={() => hasText(editContent) && editMutation.mutate({ id, content: editContent })} disabled={!hasText(editContent) || editMutation.isPending}>
                                    <Check className="size-3 mr-1" /> Save
                                </Button>
                                <Button size="sm" variant="ghost" onClick={closeEditor}>
                                    <X className="size-3 mr-1" /> Cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {content && <div className="prose prose-sm dark:prose-invert max-w-none break-words [&>p]:leading-snug [&>p:last-child]:mb-0" dangerouslySetInnerHTML={{ __html: content }} />}
                            {imageUrl && <img src={imageUrl} alt="Attached image" className="max-h-64 max-w-xs rounded-lg border border-border object-cover" />}
                            <ReactionBar reactions={reactions} currentUserId={currentUserId} onToggle={(emoji) => reactionMutation.mutate({ messageId: id, emoji })} />
                            {showSummary && (
                                <div className="mt-2 rounded-lg border border-border bg-muted/60 px-3 py-2 text-sm max-w-prose">
                                    <div className="flex items-center gap-1.5 mb-1 text-xs font-medium text-primary">
                                        <SparklesSnake className="size-3" active={true} />
                                        AI Summary
                                    </div>
                                    {summaryLoading && (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Loader2 className="size-3 animate-spin" />
                                            Summarizing…
                                        </div>
                                    )}
                                    {summaryError && <p className="text-destructive">{summaryError}</p>}
                                    {summary && <p className="leading-snug text-foreground">{summary}</p>}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Action buttons */}
                {!editing && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        <div className="relative">
                            <button
                                onClick={handleSummarize}
                                onMouseEnter={() => setSparklesHovered(true)}
                                onMouseLeave={() => setSparklesHovered(false)}
                                className="p-1 rounded hover:bg-muted transition-colors peer"
                            >
                                <SparklesSnake className="size-3.5 text-muted-foreground" active={sparklesHovered} />
                            </button>
                            <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap rounded bg-foreground px-2 py-1 text-xs text-background opacity-0 peer-hover:opacity-100 transition-opacity duration-150 z-50">
                                Summarize with AI
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
                            </div>
                        </div>
                        <div className="relative">
                            <button onClick={(e) => openPicker(e, null)} className="p-1 rounded hover:bg-muted" title="React">
                                <Smile className="size-3.5 text-muted-foreground" />
                            </button>
                            {showPicker && pickerTarget === null && (
                                <div ref={pickerRef} className="absolute right-0 top-7 z-50" onClick={e => e.stopPropagation()}>
                                    <Picker data={emojiData} onEmojiSelect={(e: any) => handleEmojiSelect(e, id)} theme="auto" />
                                </div>
                            )}
                        </div>
                        <button onClick={openReply} className="p-1 rounded hover:bg-muted" title="Reply">
                            <Reply className="size-3.5 text-muted-foreground" />
                        </button>
                        {isOwn && (
                            <button onClick={openEdit} className="p-1 rounded hover:bg-muted" title="Edit">
                                <Pencil className="size-3.5 text-muted-foreground" />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Thread toggle */}
            {replies.length > 0 && (
                <button
                    onClick={() => setThreadOpen(o => !o)}
                    className="ml-14 mb-1 flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
                >
                    <Reply className="size-3" />
                    {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
                    <span className="text-muted-foreground font-normal">{threadOpen ? '· Hide thread' : '· View thread'}</span>
                </button>
            )}

            {/* Replies */}
            {threadOpen && replies.length > 0 && (
                <div className="ml-11 border-l-2 border-border pl-3 space-y-0.5 mb-1">
                    {replies.map((reply) => {
                        const replyCreatedAt = new Date(reply.createdAt)
                        const isEditingThisReply = editingReplyId === reply.id
                        const isOwnReply = currentUserId === reply.authorId
                        return (
                            <div key={reply.id} className="group/reply flex space-x-2 p-2 rounded-lg hover:bg-muted/50 relative">
                                {reply.authorAvatar ? (
                                    <Image src={reply.authorAvatar} alt={reply.authorName ?? 'User'} width={24} height={24} className="size-6 rounded-md shrink-0" />
                                ) : (
                                    <div className="size-6 rounded-md bg-muted shrink-0 flex items-center justify-center text-xs font-semibold">
                                        {reply.authorName?.charAt(0).toUpperCase() ?? '?'}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-x-2">
                                        <p className="text-sm font-medium leading-none">{reply.authorName ?? 'Unknown'}</p>
                                        <p className="text-xs text-muted-foreground leading-none" suppressHydrationWarning>
                                            {formatDate(replyCreatedAt)} {formatTime(replyCreatedAt)}
                                        </p>
                                        {reply.editedAt && <p className="text-xs text-muted-foreground leading-none italic">(edited)</p>}
                                    </div>
                                    {isEditingThisReply ? (
                                        <div className="space-y-2 mt-2">
                                            <RichTextEditor value={replyEditContent} onChange={setReplyEditContent} />
                                            <div className="flex gap-2 items-center">
                                                <Button size="sm" onClick={() => hasText(replyEditContent) && replyEditMutation.mutate({ id: reply.id, content: replyEditContent })} disabled={!hasText(replyEditContent) || replyEditMutation.isPending}>
                                                    <Check className="size-3 mr-1" /> Save
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={closeEditor}>
                                                    <X className="size-3 mr-1" /> Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {reply.content && <div className="prose prose-sm dark:prose-invert max-w-none break-words mt-1 [&>p]:leading-snug [&>p:last-child]:mb-0" dangerouslySetInnerHTML={{ __html: reply.content }} />}
                                            {reply.imageUrl && <img src={reply.imageUrl} alt="Attached image" className="max-h-48 max-w-xs rounded-lg border border-border object-cover mt-1" />}
                                            {reply.reactions && <ReactionBar reactions={reply.reactions} currentUserId={currentUserId} onToggle={(emoji) => reactionMutation.mutate({ messageId: reply.id, emoji })} />}
                                        </>
                                    )}
                                </div>
                                {!isEditingThisReply && (
                                    <div className="absolute top-2 right-2 opacity-0 group-hover/reply:opacity-100 transition-opacity flex items-center gap-1">
                                        <div className="relative">
                                            <button onClick={(e) => openPicker(e, reply.id)} className="p-1 rounded hover:bg-muted" title="React">
                                                <Smile className="size-3 text-muted-foreground" />
                                            </button>
                                            {showPicker && pickerTarget === reply.id && (
                                                <div className="absolute right-0 top-7 z-50" onClick={e => e.stopPropagation()}>
                                                    <Picker data={emojiData} onEmojiSelect={(e: any) => handleEmojiSelect(e, reply.id)} theme="auto" />
                                                </div>
                                            )}
                                        </div>
                                        {isOwnReply && (
                                            <button onClick={() => openReplyEdit(reply)} className="p-1 rounded hover:bg-muted" title="Edit">
                                                <Pencil className="size-3 text-muted-foreground" />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Reply editor */}
            {replying && (
                <div className="ml-11 pl-3 pb-3 space-y-2">
                    <RichTextEditor
                        value={replyContent}
                        onChange={setReplyContent}
                        onImageChange={(file) => {
                            setReplyImageFile(file)
                            setReplyImagePreview(file ? URL.createObjectURL(file) : null)
                        }}
                        imagePreview={replyImagePreview}
                    />
                    <div className="flex gap-2 items-center">
                        <Button
                            size="sm"
                            disabled={(!hasText(replyContent) && !replyImageFile) || replyMutation.isPending}
                            onClick={async () => {
                                if (!hasText(replyContent) && !replyImageFile) return
                                let imageUrl: string | undefined
                                if (replyImageFile) {
                                    imageUrl = await new Promise<string>((res, rej) => {
                                        const reader = new FileReader()
                                        reader.onload = () => res(reader.result as string)
                                        reader.onerror = rej
                                        reader.readAsDataURL(replyImageFile)
                                    })
                                }
                                replyMutation.mutate({ channelId, content: replyContent, parentId: id, imageUrl })
                            }}
                        >
                            {replyMutation.isPending ? "Sending..." : "Send Reply"}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={closeEditor}>
                            <X className="size-3.5 mr-1" /> Cancel
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
