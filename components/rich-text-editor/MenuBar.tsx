'use client'

import { Editor, useEditorState } from "@tiptap/react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Toggle } from "../ui/toggle";
import { Bold, Code, Italic, ListIcon, ListOrdered, Redo, Strikethrough, Undo, Loader2, Check, X } from "lucide-react";
import { SparklesSnake } from "@/app/(dashboard)/workspace/[workspaceid]/channel/[channelid]/_components/message/SparklesSnake";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface MenuBarProps {
    editor: Editor | null;
}

export function MenuBar({ editor }: MenuBarProps) {
    const [proofreadLoading, setProofreadLoading] = useState(false)
    const [suggestion, setSuggestion] = useState<string | null>(null)
    const [proofreadHovered, setProofreadHovered] = useState(false)

    const editorState = useEditorState({
        editor,
        selector: ({ editor }) => {
            if (!editor) return null;
            return {
                isBold: editor.isActive('bold'),
                isItalic: editor.isActive('italic'),
                isStrike: editor.isActive('strike'),
                isCodeBlock: editor.isActive('codeBlock'),
                isBulletList: editor.isActive('bulletList'),
                isOrderedList: editor.isActive('orderedList'),
                canUndo: editor.can().undo(),
                canRedo: editor.can().redo()
            }
        }
    })

    if (!editor) return null;

    async function handleProofread() {
        if (!editor) return
        const content = editor.getHTML()
        const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
        if (!plainText) return toast.error('Nothing to proofread')

        setProofreadLoading(true)
        setSuggestion(null)
        try {
            const res = await fetch('/api/proofread', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error ?? 'Failed')
            setSuggestion(data.proofread)
        } catch (err: any) {
            toast.error(err.message ?? 'Proofread failed')
        } finally {
            setProofreadLoading(false)
        }
    }

    function acceptSuggestion() {
        if (!editor || !suggestion) return
        editor.commands.setContent(`<p>${suggestion}</p>`)
        setSuggestion(null)
    }

    function rejectSuggestion() {
        setSuggestion(null)
    }

    return (
        <div className='border border-input border-t-0 border-x-0 rounded-t-lg bg-card flex flex-col'>
            {/* Toolbar row */}
            <div className='p-2 flex flex-wrap gap-1 items-center'>
                <TooltipProvider>
                    <div className='flex flex-wrap gap-1 items-center flex-1'>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Toggle size='sm' pressed={editor.isActive('bold')} onPressedChange={() => editor.chain().focus().toggleBold().run()}
                                    className={cn(editorState?.isBold && 'bg-muted text-muted-foreground')}>
                                    <Bold />
                                </Toggle>
                            </TooltipTrigger>
                            <TooltipContent><p>Bold</p></TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Toggle size='sm' pressed={editor.isActive('italic')} onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                                    className={cn(editorState?.isItalic && 'bg-muted text-muted-foreground')}>
                                    <Italic />
                                </Toggle>
                            </TooltipTrigger>
                            <TooltipContent><p>Italic</p></TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Toggle size='sm' pressed={editor.isActive('strike')} onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                                    className={cn(editorState?.isStrike && 'bg-muted text-muted-foreground')}>
                                    <Strikethrough />
                                </Toggle>
                            </TooltipTrigger>
                            <TooltipContent><p>Strike</p></TooltipContent>
                        </Tooltip>
                        <div className='w-px h-6 bg-border mx-1' />
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Toggle size='sm' pressed={editor.isActive('codeBlock')} onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
                                    className={cn(editorState?.isCodeBlock && 'bg-muted text-muted-foreground')}>
                                    <Code />
                                </Toggle>
                            </TooltipTrigger>
                            <TooltipContent><p>Code Block</p></TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Toggle size='sm' pressed={editor.isActive('bulletList')} onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                                    className={cn(editorState?.isBulletList && 'bg-muted text-muted-foreground')}>
                                    <ListIcon />
                                </Toggle>
                            </TooltipTrigger>
                            <TooltipContent><p>Bullet List</p></TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Toggle size='sm' pressed={editor.isActive('orderedList')} onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                                    className={cn(editorState?.isOrderedList && 'bg-muted text-muted-foreground')}>
                                    <ListOrdered />
                                </Toggle>
                            </TooltipTrigger>
                            <TooltipContent><p>Ordered List</p></TooltipContent>
                        </Tooltip>
                        <div className='w-px h-6 bg-border mx-1' />
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button size='sm' variant='ghost' type='button'
                                    onClick={() => editor.chain().focus().undo().run()}
                                    disabled={editorState?.canUndo === false}>
                                    <Undo />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Undo</p></TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button size='sm' variant='ghost' type='button'
                                    onClick={() => editor.chain().focus().redo().run()}
                                    disabled={editorState?.canRedo === false}>
                                    <Redo />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Redo</p></TooltipContent>
                        </Tooltip>
                    </div>

                    {/* Proofread button — right side */}
                    <div className='ml-auto'>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size='sm'
                                    variant='ghost'
                                    type='button'
                                    onClick={handleProofread}
                                    disabled={proofreadLoading}
                                    onMouseEnter={() => setProofreadHovered(true)}
                                    onMouseLeave={() => setProofreadHovered(false)}
                                    className='gap-1.5 text-xs text-muted-foreground hover:text-foreground'
                                >
                                    {proofreadLoading
                                        ? <Loader2 className='size-3.5 animate-spin' />
                                        : <SparklesSnake className='size-3.5 text-muted-foreground' active={proofreadHovered} />
                                    }
                                    {proofreadLoading ? 'Proofreading…' : 'Proofread'}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>AI Proofread</p></TooltipContent>
                        </Tooltip>
                    </div>
                </TooltipProvider>
            </div>

            {/* Suggestion banner */}
            {suggestion && (
                <div className='mx-2 mb-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2.5 text-sm space-y-2'>
                    <div className='flex items-center gap-1.5 text-xs font-medium text-primary'>
                        <SparklesSnake className='size-3' active={true} />
                        AI Suggestion
                    </div>
                    <p className='text-foreground leading-snug'>{suggestion}</p>
                    <div className='flex items-center gap-2 pt-0.5'>
                        <Button size='sm' className='h-7 gap-1' onClick={acceptSuggestion}>
                            <Check className='size-3' /> Accept
                        </Button>
                        <Button size='sm' variant='ghost' className='h-7 gap-1 text-muted-foreground' onClick={rejectSuggestion}>
                            <X className='size-3' /> Dismiss
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
