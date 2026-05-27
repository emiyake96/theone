import { createChannel, listChannels } from "./channel";
import { createMessage } from "./message";
import { listWorkspaces, createWorkspaces } from "./workspace";

export const router = {
    workspace: {
        list: listWorkspaces,
        create: createWorkspaces,
    },

    channel: {
        create: createChannel,
        list: listChannels
    },

    message: {
        create: createMessage,
    }
}