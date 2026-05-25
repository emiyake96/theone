import prisma from "@/lib/db";
import { requiredAuthMiddleware } from "../middlewares/auth";
import { base } from "../middlewares/base";
import { requireWorkspaceMiddleware } from "../middlewares/workspace";
import { channelSchema } from "../schemas/channel";
import { Channel } from "@/lib/generated/prisma/client";
import { z } from "zod";

export const createChannel = base
    .use(requiredAuthMiddleware)
    .use(requireWorkspaceMiddleware)
    .route({
        method: "POST",
        path: "/channels",
        summary: "Create a new channel in the workspace",
        tags: ["Channels"],
    }).input(channelSchema)
    .output(z.custom<Channel>())
    .handler(async({input, context}) => {
        const channel = await prisma.channel.create({
            data: {
                name: input.name,
                workspaceId: context.workspace.orgCode,
                createdById: context.user.id,
            }
        })

        return channel;
    })