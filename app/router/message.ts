import z from 'zod';
import {  requiredAuthMiddleware } from '../middlewares/auth';
import { base } from '../middlewares/base';
import { requireWorkspaceMiddleware } from '../middlewares/workspace';
import prisma from '@/lib/db';
import { createMessageSchema } from '../schemas/message';
import { getAvatar } from '@/lib/get-avatar';


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

        return {
            ...created
        }
    })