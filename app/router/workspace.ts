import { z } from "zod";
import { os } from "@orpc/server";
import { KindeOrganization, KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { base } from "../middlewares/base";
import { requiredAuthMiddleware } from "../middlewares/auth";
import { requireWorkspaceMiddleware } from "../middlewares/workspace";
import { workspaceSchema } from "../schemas/workspace";
import { init, Organizations, Users } from "@kinde/management-api-js"

export const listWorkspaces = base
.use(requiredAuthMiddleware)
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
        currentWorkspace: z.custom<KindeOrganization<unknown>>().optional().nullable()
    }
    ))
    .handler(async ({ input, context, errors }) => {
        const { getOrganization, getUserOrganizations } = getKindeServerSession();

        const [organizations, currentWorkspace] = await Promise.all([
            getUserOrganizations(),
            getOrganization(),
        ])

        init()

        const userOrgCodes = new Set(organizations?.orgCodes ?? [])

        let allOrgs: { code: string, name: string }[] = []
        try {
            const result = await Organizations.getOrganizations({ pageSize: 100 })
            allOrgs = (result?.organizations ?? [])
                .filter((o: any) => userOrgCodes.has(o.code))
                .map((o: any) => ({
                    code: o.code,
                    name: o.name ?? "My Workspace",
                }))
        } catch (e) {
            console.log("[getOrganizations] error:", e)
        }

        return {
            workspaces: allOrgs.map((o) => ({
                id: o.code,
                name: o.name,
                avatar: o.name.charAt(0).toUpperCase(),
            })),
            user: context.user,
            currentWorkspace: currentWorkspace ?? null
        }
    });

    export const createWorkspaces = base
        .use(requiredAuthMiddleware)
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

                return {
                    orgCode: data.organization.code,
                    workspaceName: input.name,
                }
        });

    export const inviteMember = base
        .use(requiredAuthMiddleware)
        .use(requireWorkspaceMiddleware)
            .route({
                method: "POST",
                path: "/workspaces/invite",
                summary: "Invite a member to the workspace",
                tags: ["Workspaces"],
            })
            .input(z.object({ email: z.string().email() }))
            .output(z.object({ success: z.boolean() }))
            .handler(async ({ input, context, errors }) => {
                init()
                const orgCode = context.workspace.orgCode

                // Find existing user by email
                let userId: string | undefined
                try {
                    const search = await Users.getUsers({ email: input.email })
                    userId = search?.users?.[0]?.id
                } catch {}

                // Create user if they don't exist
                if (!userId) {
                    try {
                        const created = await Users.createUser({
                            requestBody: {
                                identities: [{ type: 'email', details: { email: input.email } }]
                            }
                        })
                        userId = created?.id
                    } catch {
                        throw errors.BAD_REQUEST({ message: "Failed to create user" })
                    }
                }

                if (!userId) throw errors.BAD_REQUEST({ message: "Could not find or create user" })

                try {
                    await Organizations.addOrganizationUsers({
                        orgCode,
                        requestBody: { users: [{ id: userId }] }
                    })
                } catch {
                    throw errors.FORBIDDEN({ message: "Failed to add user to workspace" })
                }

                return { success: true }
            })

    export const deleteWorkspace = base
        .use(requiredAuthMiddleware)
        .use(requireWorkspaceMiddleware)
            .route({
                method: "DELETE",
                path: "/workspaces/{orgCode}",
                summary: "Delete a workspace",
                tags: ["Workspaces"],
            })
            .input(z.object({ orgCode: z.string() }))
            .output(z.object({ success: z.boolean() }))
            .handler(async ({ input, errors }) => {
                init()
                try {
                    await Organizations.deleteOrganization({ orgCode: input.orgCode })
                } catch {
                    throw errors.FORBIDDEN({ message: "Failed to delete workspace" })
                }
                return { success: true }
            })
