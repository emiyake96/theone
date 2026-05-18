import { z } from "zod";
import { os } from "@orpc/server";
import { KindeOrganization, KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { base } from "../middlewares/base";
import { requiredAuthMiddleware } from "../middlewares/auth";
import { requireWorkspaceMiddleware } from "../middlewares/workspace";
import { workspaceSchema } from "../schemas/workspace";
import { init, Organizations } from "@kinde/management-api-js"

export const listWorkspaces = base
.use(requiredAuthMiddleware)
.use(requireWorkspaceMiddleware)
    .route({
        method: "GET",
        path: "/workspaces",
        summary: "List all workspaces",
        tags: ["Workspaces"],
    })
    .input(z.void())
    .output(z.object({
        workspaces: z.array(
            z.object({
                id: z.string(),
                name: z.string(),
                avatar: z.string().optional()
            })
        ),
        user: z.custom<KindeUser<Record<string, unknown>>>(),
        currentWorkspace: z.custom<KindeOrganization<unknown>>()
    } 
    ))
    .handler(async ({ input, context, errors }) => {
        const { getUserOrganizations } = getKindeServerSession();

        const organizations = await getUserOrganizations();

        if (!organizations) {
            throw errors.FORBIDDEN()
        }

        return {
            workspaces: organizations?.orgs.map((org) => ({
                id: org.code,
                name: org.name ?? "My Workspace",
                avatar: org.name?.charAt(0).toUpperCase() ?? "M"// Placeholder avatar using the first letter of the organization name
            })),
            user: context.user,
            currentWorkspace: context.workspace
        }
    });

    export const createWorkspaces = base
        .use(requiredAuthMiddleware)
        .use(requireWorkspaceMiddleware)
            .route({
                method: "POST",
                path: "/workspaces",
                summary: "Create a new workspace",
                tags: ["Workspaces"],
            })
            .input(workspaceSchema)
            .output(z.object({
                orgCode: z.string(),
                workspaceName: z.string(),
            }))
            .handler(async ({ context, errors, input }) => {
                init()

                let data;

                try {
                    data = await Organizations.createOrganization({
                        requestBody: {
                            name: input.name
                        }
                    })
                } catch (error) {
                    throw errors.FORBIDDEN
                }

                if(!data.organization?.code) {
                    throw errors.FORBIDDEN({
                        message: "Org code is not defined"
                    })
                }
                try {
                    await Organizations.addOrganizationUsers({
                        orgCode: data.organization.code,
                        requestBody: {
                            users: [
                                {
                                    id: context.user.id,
                                    roles: ["admin"],
                                }
                            ]
                        }
                    })
                } catch (error) {
                    throw errors.FORBIDDEN()
                }

                const { refreshTokens } = getKindeServerSession()
                
                await refreshTokens()

                return {
                    orgCode: data.organization.code,
                    workspaceName: input.name,

                }
        });
