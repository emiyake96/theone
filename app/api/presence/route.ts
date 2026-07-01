import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import prisma from '@/lib/db'
import { checkRateLimit } from '@/lib/rate-limit'

const ONLINE_THRESHOLD_MS = 2 * 60 * 1000 // 2 minutes

// POST — heartbeat, called every 30s by the client
export async function POST(req: Request) {
    const limited = checkRateLimit(req, 'presence-post', { limit: 10, windowSecs: 60 });
    if (limited) return limited;
    const { getUser } = getKindeServerSession()
    const user = await getUser()
    if (!user) return new Response('Unauthorized', { status: 401 })

    await prisma.userPresence.upsert({
        where: { userId: user.id },
        update: { lastSeen: new Date() },
        create: { userId: user.id },
    })

    return new Response(null, { status: 204 })
}

// GET — returns online user IDs and lastSeen timestamps for all users
export async function GET(req: Request) {
    const limited = checkRateLimit(req, 'presence-get', { limit: 60, windowSecs: 60 });
    if (limited) return limited;
    const { getUser } = getKindeServerSession()
    const user = await getUser()
    if (!user) return new Response('Unauthorized', { status: 401 })

    const since = new Date(Date.now() - ONLINE_THRESHOLD_MS)
    const allPresence = await prisma.userPresence.findMany({
        select: { userId: true, lastSeen: true },
    })

    const onlineUserIds = allPresence
        .filter(p => p.lastSeen >= since)
        .map(p => p.userId)

    const lastSeenMap = Object.fromEntries(
        allPresence.map(p => [p.userId, p.lastSeen.toISOString()])
    )

    return Response.json({ onlineUserIds, lastSeenMap })
}
