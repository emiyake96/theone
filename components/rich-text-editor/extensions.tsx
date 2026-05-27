import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { all, createLowlight } from 'lowlight';
import CodeBLock from '@tiptap/extension-code-block-lowlight';
import { Placeholder } from '@tiptap/extensions/placeholder';

const lowlight = createLowlight(all)

export const baseExtensions = [
    StarterKit.configure({
        codeBlock: false,

    }),
    TextAlign.configure({
        types: ['paragraph', 'heading'],
    }),
    CodeBLock.configure({
        lowlight,
    }),
]

export const editorExtensions = [
    ...baseExtensions,
    Placeholder.configure({
        placeholder: 'Write a message...'
    })
]