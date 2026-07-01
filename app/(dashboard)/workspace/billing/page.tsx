import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation'
import { BillingPage } from './_components/BillingPage'
import Stripe from 'stripe'
import prisma from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

async function getBillingData(userId: string) {
    const record = await prisma.stripeCustomer.findUnique({ where: { userId } })

    if (!record) {
        return { currentPlan: 'free' as const, hasPaymentMethod: false }
    }

    const [paymentMethods, invoices] = await Promise.all([
        stripe.paymentMethods.list({ customer: record.stripeId, type: 'card' }),
        stripe.invoices.list({ customer: record.stripeId, limit: 10 }),
    ])

    const card = paymentMethods.data[0]?.card

    return {
        currentPlan: record.plan as 'free' | 'pro',
        hasPaymentMethod: !!card,
        last4: card?.last4,
        cardBrand: card?.brand,
        invoices: invoices.data.map(inv => ({
            id: inv.id ?? '',
            date: new Date((inv.created) * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            amount: inv.amount_paid ? `$${(inv.amount_paid / 100).toFixed(2)}` : '$0.00',
            status: inv.status === 'paid' ? 'Paid' : inv.status ?? 'Unknown',
            pdf: inv.invoice_pdf ?? '#',
        })),
    }
}

export default async function BillingRoute() {
    const { getUser } = getKindeServerSession()
    const user = await getUser()
    if (!user) redirect('/api/auth/login')

    const billingData = await getBillingData(user.id)

    return <BillingPage {...billingData} />
}
