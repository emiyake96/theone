import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import Stripe from 'stripe'
import prisma from '@/lib/db'
import { checkRateLimit } from '@/lib/rate-limit'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const SITE_URL = process.env.KINDE_SITE_URL ?? 'http://localhost:3000'

export async function POST(req: Request) {
    const limited = checkRateLimit(req, 'stripe-checkout', { limit: 5, windowSecs: 60 });
    if (limited) return limited;

    const { getUser } = getKindeServerSession()
    const user = await getUser()
    if (!user) return new Response('Unauthorized', { status: 401 })

    // Look up or create a Stripe customer for this user
    let record = await prisma.stripeCustomer.findUnique({ where: { userId: user.id } })

    if (!record) {
        const customer = await stripe.customers.create({
            email: user.email!,
            name: [user.given_name, user.family_name].filter(Boolean).join(' ') || undefined,
            metadata: { kindeUserId: user.id },
        })
        record = await prisma.stripeCustomer.create({
            data: { userId: user.id, stripeId: customer.id },
        })
    }

    const session = await stripe.checkout.sessions.create({
        customer: record.stripeId,
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [{ price: process.env.STRIPE_PRO_PRICE_ID!, quantity: 1 }],
        success_url: `${SITE_URL}/workspace/billing?success=1`,
        cancel_url: `${SITE_URL}/workspace/billing`,
        allow_promotion_codes: true,
    })

    return Response.json({ url: session.url })
}
