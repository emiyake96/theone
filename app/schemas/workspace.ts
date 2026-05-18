import { z } from "zod";

export const workspaceSchema = z.object({
    name: z.string().min(3).max(50)
    // Add more fields as needed
});

export type WorkspaceSchemaType = z.infer<typeof workspaceSchema>;