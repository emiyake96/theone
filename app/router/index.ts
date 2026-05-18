import { listWorkspaces, createWorkspaces } from "./workspace";

export const router = {
    workspace: {
        list: listWorkspaces,
        create: createWorkspaces,
    }
}