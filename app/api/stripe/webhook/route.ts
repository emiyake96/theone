import { headers } from 'next/headers'
import Stripe from 'stripe'
import prisma from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
    const body = await req.text()
    const signature = (await headers()).get('stripe-signature')

    if (!signature) return new Response('Missing signature', { status: 400 })

    let event: Stripe.Event
    try {
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
    } catch (err: any) {
        return new Response(`Webhook error: ${err.message}`, { status: 400 })
    }

    switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated': {
            const sub = event.data.object as Stripe.Subscription
            const isActive = sub.status === 'active' || sub.status === 'trialing'
            await prisma.stripeCustomer.updateMany({
                where: { stripeId: sub.customer as string },
                data: { plan: isActive ? 'pro' : 'free' },
            })
            break
        }
        case 'customer.subscription.deleted': {
            const sub = event.data.object as Stripe.Subscription
            await prisma.stripeCustomer.updateMany({
                where: { stripeId: sub.customer as string },
                data: { plan: 'free' },
            })
            break
        }
    }

    return new Response('ok')
}
