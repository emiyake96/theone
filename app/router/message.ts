import z from 'zod';
import { requiredAuthMiddleware } from '../middlewares/auth';
import { base } from '../middlewares/base';
import { requireWorkspaceMiddleware } from '../middlewares/workspace';
import prisma from '@/lib/db';
import { createMessageSchema } from '../schemas/message';
import { getAvatar } from '@/lib/get-avatar';
import { Message } from '@/lib/generated/prisma/edge';


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
                authorId: context.user.id,
                authorEmail: context.user.email,
                authorName: context.user.given_name,
                authorAvatar: getAvatar(context.user.picture, context.user.email!),
            }
        })

        return { ...created }
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
                ...(input.cursor ? { createdAt: { lt: new Date(input.cursor) } } : {}),
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
