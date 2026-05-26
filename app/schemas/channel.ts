import z from "zod";

export function transformChannelName(name: string) {
    return name.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const channelSchema = z.object({
    name: z.string()
        .min(2, "Channel name must be at least 2 characters long")
        .max(100, "Channel name must be less than 100 characters long")
        .transform((name, ctx) => {
            const transformed = transformChannelName(name);

            if (transformed.length < 2) {
                ctx.addIssue({
                    code: "custom",
                    message: "Channel name must contain at least 2 valid characters after transformation",
                });
                return z.NEVER;
            }

            return transformed;
        })
})

export type ChannelSchemaNameType = z.infer<typeof channelSchema>;
