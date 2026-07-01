import { createChannel, listChannels } from "./channel";
import { createMessage, editMessage, listMessages, toggleReaction } from "./message";
import { listWorkspaces, createWorkspaces, deleteWorkspace, inviteMember } from "./workspace";

export const router = {
    workspace: {
        list: listWorkspaces,
        create: createWorkspaces,
        delete: deleteWorkspace,
        invite: inviteMember,
    },

    channel: {
        create: createChannel,
        list: listChannels
    },

    message: {
        create: createMessage,
        edit: editMessage,
        list: listMessages,
        toggleReaction,
    }
}