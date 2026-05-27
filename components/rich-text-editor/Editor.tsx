'use client'

import { EditorContent, useEditor } from '@tiptap/react';
import { editorExtensions } from './extensions';
import { MenuBar } from './MenuBar';
import { useCallback, useRef } from 'react';
import { Paperclip, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface RichTextEditorProps {
    value?: string;
    onChange?: (value: string) => void;
    onImageChange?: (file: File | null) => void;
    imagePreview?: string | null;
}

export function RichTextEditor({ value, onChange, onImageChange, imagePreview }: RichTextEditorProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpdate = useCallback(({ editor }: { editor: any }) => {
        onChange?.(editor.getHTML());
    }, [onChange]);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: editorExtensions,
        content: value,
        onUpdate: handleUpdate,
        editorProps: {
            attributes: {
                class: 'max-w-none min-h-[125px] focus:outline-none p-4 !w-full !max-w-none prose dark:prose-invert marker:text-primary',
            }
        }
    });

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null;
        onImageChange?.(file);
        e.target.value = '';
    }

    return (
        <div className='relative w-full border border-input rounded-lg overflow-hidden dark:bg-input/30 flex flex-col'>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} className='max-h-[200px] overflow-y-auto' />

            {/* Image preview */}
            {imagePreview && (
                <div className='px-4 pb-2 flex items-center gap-2'>
                    <div className='relative inline-flex'>
                        <img
                            src={imagePreview}
                            alt='Attachment preview'
                            className='h-16 w-16 rounded-md object-cover border border-border'
                        />
                        <button
                            type='button'
                            onClick={() => onImageChange?.(null)}
                            className='absolute -top-1.5 -right-1.5 rounded-full bg-background border border-border p-0.5 hover:bg-muted'
                        >
                            <X className='size-3' />
                        </button>
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className='border-t border-input px-2 py-1 flex items-center'>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type='button'
                                size='sm'
                                variant='ghost'
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Paperclip className='size-4' />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Attach image</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <input
                    ref={fileInputRef}
                    type='file'
                    accept='image/*'
                    className='hidden'
                    onChange={handleFileChange}
                />
            </div>
        </div>
    );
}