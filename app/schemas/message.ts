import z from "zod";

export const createMessageSchema = z.object({
    channelId: z.string(),
    content: z.string().max(1000),
    imageUrl: z.string().optional(),
    parentId: z.string().optional(),
});