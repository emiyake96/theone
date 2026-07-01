import z from 'zod';
import { requiredAuthMiddleware } from '../middlewares/auth';
import { base } from '../middlewares/base';
import { requireWorkspaceMiddleware } from '../middlewares/workspace';
import prisma from '@/lib/db';
import { createMessageSchema } from '../schemas/message';
import { getAvatar } from '@/lib/get-avatar';
import { Message, Reaction } from '@/lib/generated/prisma/edge';


export const createMessage = base
    .use(requiredAuthMiddleware)
    .use(requireWorkspaceMiddleware)
    .route({
        method: "POST",
        path: "/messages",
        summary: "Create a new message in the channel",
        tags: ["Messages"],
    }).input(createMessageSchema)
    .output(z.custom())
    .handler(async({input, context}) => {
        const channel = await prisma.channel.findFirst({
            where: {
                id: input.channelId,
                workspaceId: context.workspace.orgCode,
            }
        })

        if (!channel) {
            throw new Error("Channel not found");
        }

        const created = await prisma.message.create({
            data: {
                content: input.content,
                imageUrl: input.imageUrl,
                channelId: input.channelId,
                parentId: input.parentId ?? null,
                authorId: context.user.id,
                authorEmail: context.user.email,
                authorName: context.user.given_name,
                authorAvatar: getAvatar(context.user.picture, context.user.email!),
            }
        })

        return { ...created }
    })

export const toggleReaction = base
    .use(requiredAuthMiddleware)
    .use(requireWorkspaceMiddleware)
    .route({ method: "POST", path: "/messages/{id}/reactions", tags: ["Messages"] })
    .input(z.object({ messageId: z.string(), emoji: z.string() }))
    .output(z.object({ added: z.boolean() }))
    .handler(async ({ input, context }) => {
        const existing = await prisma.reaction.findUnique({
            where: { userId_messageId_emoji: { userId: context.user.id, messageId: input.messageId, emoji: input.emoji } }
        })
        if (existing) {
            await prisma.reaction.delete({ where: { id: existing.id } })
            return { added: false }
        }
        await prisma.reaction.create({
            data: { emoji: input.emoji, userId: context.user.id, messageId: input.messageId }
        })
        return { added: true }
    })

export const editMessage = base
    .use(requiredAuthMiddleware)
    .use(requireWorkspaceMiddleware)
    .route({
        method: "PATCH",
        path: "/messages/{id}",
        summary: "Edit a message",
        tags: ["Messages"],
    })
    .input(z.object({ id: z.string(), content: z.string().min(1) }))
    .output(z.custom<Message>())
    .handler(async ({ input, context }) => {
        const message = await prisma.message.findFirst({
            where: { id: input.id, authorId: context.user.id }
        })
        if (!message) throw new Error("Message not found or not yours")

        return prisma.message.update({
            where: { id: input.id },
            data: { content: input.content, editedAt: new Date() }
        })
    })

export const listMessages = base
    .use(requiredAuthMiddleware)
    .use(requireWorkspaceMiddleware)
    .route({
        method: "GET",
        path: "/messages",
        summary: "List messages in a channel",
        tags: ["Messages"],
    })
    .input(z.object({
        channelId: z.string(),
        cursor: z.string().optional(), // ISO timestamp — load messages older than this
        limit: z.number().int().min(1).max(100).default(30),
    }))
    .output(z.object({
        messages: z.array(z.custom<Message>()),
        nextCursor: z.string().optional(),
    }))
    .handler(async({ input, context }) => {
        const channel = await prisma.channel.findFirst({
            where: {
                id: input.channelId,
                workspaceId: context.workspace.orgCode,
            }
        })

        if (!channel) {
            throw new Error("Channel not found");
        }

        // Fetch one extra to determine whether another page exists
        const raw = await prisma.message.findMany({
            where: {
                channelId: input.channelId,
                parentId: null, // only top-level messages
                ...(input.cursor ? { createdAt: { lt: new Date(input.cursor) } } : {}),
            },
            include: {
                replies: {
                    orderBy: { createdAt: "asc" },
                    include: { reactions: true },
                },
                reactions: true,
            },
            orderBy: { createdAt: "desc" },
            take: input.limit + 1,
        })

        let nextCursor: string | undefined
        if (raw.length > input.limit) {
            nextCursor = raw.pop()!.createdAt.toISOString()
        }

        return {
            messages: raw.reverse(), // chronological order for display
            nextCursor,
        }
    })
