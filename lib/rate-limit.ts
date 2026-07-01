/**
 * Simple sliding-window rate limiter using an in-memory Map.
 *
 * Works well for a single serverless instance (warm container).
 * For multi-region production scale, swap the store for Upstash Redis.
 */

interface Window {
    count: number
    resetAt: number
}

const store = new Map<string, Window>()

// Prune expired keys every 5 minutes to avoid memory leaks
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now()
        for (const [key, win] of store) {
            if (win.resetAt < now) store.delete(key)
        }
    }, 5 * 60 * 1000)
}

interface RateLimitOptions {
    /** Max requests allowed per window */
    limit: number
    /** Window duration in seconds */
    windowSecs: number
}

interface RateLimitResult {
    allowed: boolean
    remaining: number
    resetAt: number
}

export function rateLimit(key: string, { limit, windowSecs }: RateLimitOptions): RateLimitResult {
    const now = Date.now()
    const windowMs = windowSecs * 1000

    let win = store.get(key)
    if (!win || win.resetAt < now) {
        win = { count: 0, resetAt: now + windowMs }
        store.set(key, win)
    }

    win.count++
    const allowed = win.count <= limit
    return { allowed, remaining: Math.max(0, limit - win.count), resetAt: win.resetAt }
}

/** Returns a 429 Response if the request is rate-limited, otherwise null. */
export function checkRateLimit(
    req: Request,
    routeKey: string,
    opts: RateLimitOptions
): Response | null {
    const ip =
        req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        req.headers.get('x-real-ip') ??
        'unknown'

    const { allowed, remaining, resetAt } = rateLimit(`${routeKey}:${ip}`, opts)

    if (!allowed) {
        return new Response(
            JSON.stringify({ error: 'Too many requests. Please slow down.' }),
            {
                status: 429,
                headers: {
                    'Content-Type': 'application/json',
                    'X-RateLimit-Limit': String(opts.limit),
                    'X-RateLimit-Remaining': '0',
                    'X-RateLimit-Reset': String(Math.ceil(resetAt / 1000)),
                    'Retry-After': String(Math.ceil((resetAt - Date.now()) / 1000)),
                },
            }
        )
    }

    return null
}
