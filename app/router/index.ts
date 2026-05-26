import { createChannel, listChannels } from "./channel";
import { listWorkspaces, createWorkspaces } from "./workspace";

export const router = {
    workspace: {
        list: listWorkspaces,
        create: createWorkspaces,
    },

    channel: {
        create: createChannel,
        list: listChannels
    }
}