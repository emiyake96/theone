import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import Stripe from 'stripe'
import prisma from '@/lib/db'
import { checkRateLimit } from '@/lib/rate-limit'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const SITE_URL = process.env.KINDE_SITE_URL ?? 'http://localhost:3000'

export async function POST(req: Request) {
    const limited = checkRateLimit(req, 'stripe-portal', { limit: 5, windowSecs: 60 });
    if (limited) return limited;
    const { getUser } = getKindeServerSession()
    const user = await getUser()
    if (!user) return new Response('Unauthorized', { status: 401 })

    const record = await prisma.stripeCustomer.findUnique({ where: { userId: user.id } })
    if (!record) return Response.json({ error: 'No billing account found' }, { status: 404 })

    const portalSession = await stripe.billingPortal.sessions.create({
        customer: record.stripeId,
        return_url: `${SITE_URL}/workspace/billing`,
    })

    return Response.json({ url: portalSession.url })
}
