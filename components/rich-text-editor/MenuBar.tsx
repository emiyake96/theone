import { Editor, useEditorState } from "@tiptap/react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Toggle } from "../ui/toggle";
import { Bold, Code, Italic, ListIcon, ListOrdered, Redo, Strikethrough, Undo } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface MenuBarProps {
    editor: Editor | null;
}

export function MenuBar({ editor }: MenuBarProps) {

    const editorState = useEditorState({
        editor,
        selector: ({ editor }) => {
            if(!editor) return null;
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
    if (!editor) {
        return null;
    }

    return (
        <div className='border border-input border-t-0 border-x-0 rounded-t-lg p-2 bg-card flex flex-wrap gap-1 items-center'>
            <TooltipProvider>
                <div className='flex flex-wrap gap-1'>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle size='sm' pressed={editor.isActive('bold')} onPressedChange=
                            {() => editor.chain().focus().toggleBold().run()
                            }
                            className={cn(
                                editorState?.isBold && 'bg-muted text-muted-foreground'
                            )}
                            >
                                <Bold />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Bold</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle size='sm' pressed={editor.isActive('italic')} onPressedChange=
                            {() => editor.chain().focus().toggleItalic().run()
                            }
                            className={cn(
                                editorState?.isItalic && 'bg-muted text-muted-foreground'
                            )}
                            >
                                <Italic />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Italic</p>
                        </TooltipContent>
                    </Tooltip>   
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle size='sm' pressed={editor.isActive('strike')} onPressedChange=
                            {() => editor.chain().focus().toggleStrike().run()
                            }
                            className={cn(
                                editorState?.isStrike && 'bg-muted text-muted-foreground'
                            )}
                            >
                                <Strikethrough />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Strike</p>
                        </TooltipContent>
                    </Tooltip>   
                    <div className='w-px h-6 bg-border mx-2'></div>    
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle size='sm' pressed={editor.isActive('codeBlock')} onPressedChange=
                            {() => editor.chain().focus().toggleCodeBlock().run()
                            }
                            className={cn(
                                editorState?.isCodeBlock && 'bg-muted text-muted-foreground'
                            )}
                            >
                                <Code />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Code Block</p>
                        </TooltipContent>
                    </Tooltip>                
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle size='sm' pressed={editor.isActive('bulletList')} onPressedChange=
                            {() => editor.chain().focus().toggleBulletList().run()
                            }
                            className={cn(
                                editorState?.isBulletList && 'bg-muted text-muted-foreground'
                            )}
                            >
                                <ListIcon />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Bullet List</p>
                        </TooltipContent>
                    </Tooltip>               
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle size='sm' pressed={editor.isActive('orderedList')} onPressedChange=
                            {() => editor.chain().focus().toggleOrderedList().run()
                            }
                            className={cn(
                                editorState?.isOrderedList && 'bg-muted text-muted-foreground'
                            )}
                            >
                                <ListOrdered />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Ordered List</p>
                        </TooltipContent>
                    </Tooltip>      
                    <div className='w-px h-6 bg-border mx-2'></div>    
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button 
                                size='sm'
                                variant='ghost'
                                type='button'
                                onClick={() => editor.chain().focus().undo().run()}
                                disabled={editorState?.canUndo === false}
                            >
                                <Undo />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Undo</p>
                        </TooltipContent>
                    </Tooltip>    
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button 
                                size='sm'
                                variant='ghost'
                                type='button'
                                onClick={() => editor.chain().focus().redo().run()}
                                disabled={editorState?.canRedo === false}
                            >
                                <Redo />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Redo</p>
                        </TooltipContent>
                    </Tooltip>                
                </div>
            </TooltipProvider>
        </div>
    )
}