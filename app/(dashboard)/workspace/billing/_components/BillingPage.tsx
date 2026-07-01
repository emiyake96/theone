'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
    CreditCard, Zap, Check, ExternalLink, Loader2,
    FileText, ShieldCheck
} from 'lucide-react'
import { toast } from 'sonner'

interface Plan {
    id: 'free' | 'pro'
    name: string
    price: string
    period: string
    description: string
    features: string[]
    highlight?: boolean
}

const PLANS: Plan[] = [
    {
        id: 'free',
        name: 'Free',
        price: '$0',
        period: 'forever',
        description: 'Perfect for small teams getting started.',
        features: [
            '3 workspaces',
            '5 members per workspace',
            '10,000 messages',
            'Basic channels',
        ],
    },
    {
        id: 'pro',
        name: 'Pro',
        price: '$12',
        period: 'per user / month',
        description: 'For growing teams that need more power.',
        features: [
            'Unlimited workspaces',
            'Unlimited members',
            'Unlimited message history',
            'AI message summarization',
            'Priority support',
            'Advanced analytics',
        ],
        highlight: true,
    },
]

interface Invoice {
    id: string
    date: string
    amount: string
    status: string
    pdf: string
}

interface Props {
    currentPlan: 'free' | 'pro'
    hasPaymentMethod: boolean
    last4?: string
    cardBrand?: string
    invoices?: Invoice[]
}

export function BillingPage({ currentPlan, hasPaymentMethod, last4, cardBrand, invoices = [] }: Props) {
    const [loadingCheckout, setLoadingCheckout] = useState(false)
    const [loadingPortal, setLoadingPortal] = useState(false)

    async function handleUpgrade() {
        setLoadingCheckout(true)
        try {
            const res = await fetch('/api/stripe/checkout', { method: 'POST' })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error ?? 'Failed to start checkout')
            window.location.href = data.url
        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setLoadingCheckout(false)
        }
    }

    async function handlePortal() {
        setLoadingPortal(true)
        try {
            const res = await fetch('/api/stripe/portal', { method: 'POST' })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error ?? 'Failed to open portal')
            window.location.href = data.url
        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setLoadingPortal(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto px-6 py-10 space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Billing & Plans</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Manage your subscription, payment method, and invoices.
                </p>
            </div>

            {/* Plans */}
            <section className="space-y-4">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Plan</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {PLANS.map((plan) => {
                        const isActive = currentPlan === plan.id
                        return (
                            <div
                                key={plan.id}
                                className={`relative rounded-xl border p-5 space-y-4 transition-all ${
                                    plan.highlight
                                        ? 'border-primary/50 bg-primary/5'
                                        : 'border-border bg-card'
                                } ${isActive ? 'ring-2 ring-primary' : ''}`}
                            >
                                {isActive && (
                                    <Badge className="absolute top-4 right-4" variant="default">
                                        Current plan
                                    </Badge>
                                )}
                                {!isActive && plan.highlight && (
                                    <Badge className="absolute top-4 right-4 bg-gradient-to-r from-cyan-500 to-pink-500 text-white border-0">
                                        Recommended
                                    </Badge>
                                )}
                                <div>
                                    <div className="flex items-center gap-2">
                                        {plan.highlight ? (
                                            <Zap className="size-4 text-primary" />
                                        ) : (
                                            <ShieldCheck className="size-4 text-muted-foreground" />
                                        )}
                                        <span className="font-semibold">{plan.name}</span>
                                    </div>
                                    <div className="mt-2">
                                        <span className="text-3xl font-bold">{plan.price}</span>
                                        <span className="text-sm text-muted-foreground ml-1">{plan.period}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                                </div>

                                <ul className="space-y-2">
                                    {plan.features.map((f) => (
                                        <li key={f} className="flex items-center gap-2 text-sm">
                                            <Check className="size-3.5 text-primary shrink-0" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>

                                {!isActive && plan.id === 'pro' && (
                                    <Button
                                        className="w-full bg-gradient-to-r from-cyan-500 to-pink-500 text-white border-0 hover:opacity-90"
                                        onClick={handleUpgrade}
                                        disabled={loadingCheckout}
                                    >
                                        {loadingCheckout ? (
                                            <><Loader2 className="size-4 mr-2 animate-spin" /> Redirecting…</>
                                        ) : (
                                            <><Zap className="size-4 mr-2" /> Upgrade to Pro</>
                                        )}
                                    </Button>
                                )}
                                {isActive && plan.id === 'pro' && (
                                    <Button variant="outline" className="w-full" onClick={handlePortal} disabled={loadingPortal}>
                                        {loadingPortal ? (
                                            <><Loader2 className="size-4 mr-2 animate-spin" /> Opening…</>
                                        ) : (
                                            'Manage subscription'
                                        )}
                                    </Button>
                                )}
                            </div>
                        )
                    })}
                </div>
            </section>

            <Separator />

            {/* Payment method */}
            <section className="space-y-4">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Payment Method</h2>
                <div className="rounded-xl border border-border bg-card p-5 flex items-center justify-between gap-4">
                    {hasPaymentMethod ? (
                        <>
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-lg bg-muted flex items-center justify-center">
                                    <CreditCard className="size-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium capitalize">{cardBrand ?? 'Card'} ending in {last4}</p>
                                    <p className="text-xs text-muted-foreground">Used for all subscription charges</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={handlePortal} disabled={loadingPortal}>
                                {loadingPortal ? <Loader2 className="size-4 animate-spin" /> : 'Update'}
                            </Button>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-lg bg-muted flex items-center justify-center">
                                    <CreditCard className="size-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">No payment method</p>
                                    <p className="text-xs text-muted-foreground">Add a card to upgrade your plan</p>
                                </div>
                            </div>
                            <Button size="sm" onClick={handleUpgrade} disabled={loadingCheckout}>
                                {loadingCheckout ? <Loader2 className="size-4 animate-spin" /> : 'Add card'}
                            </Button>
                        </>
                    )}
                </div>
            </section>

            <Separator />

            {/* Billing history */}
            <section className="space-y-4">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Billing History</h2>
                {invoices.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                        No invoices yet. Upgrade to Pro to start your billing history.
                    </div>
                ) : (
                    <div className="rounded-xl border border-border overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-muted/40">
                                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Amount</th>
                                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                                    <th className="px-4 py-3" />
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map((inv, i) => (
                                    <tr key={inv.id} className={i !== invoices.length - 1 ? 'border-b border-border' : ''}>
                                        <td className="px-4 py-3 text-foreground">{inv.date}</td>
                                        <td className="px-4 py-3 font-medium">{inv.amount}</td>
                                        <td className="px-4 py-3">
                                            <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 bg-emerald-500/10">
                                                {inv.status}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <a
                                                href={inv.pdf}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                <FileText className="size-3" />
                                                PDF
                                                <ExternalLink className="size-3" />
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    )
}
