import { os } from "@orpc/server"

export const base = os.$context<{request: Request}>().errors({
    RATE_LIMITED: { 
        message: "You are being limited.",
    },
    BAD_REQUEST: {
        message: "Bad request.",
    },
    NOT_FOUND: {
        message: "Resource not found.",
    },
    FORBIDDEN: {
        message: "You don't have permission to access this resource.",
    },
    UNAUTHORIZED: {
        message: "You need to be authenticated to access this resource.",
    },
})