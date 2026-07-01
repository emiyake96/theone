import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { RegisterLink } from '@kinde-oss/kinde-auth-nextjs/components'
import { Check, X, Zap, ArrowRight, MessageSquare, Bot, Sparkles } from 'lucide-react'

const plans = [
    {
        name: 'Free',
        price: '$0',
        period: 'forever',
        description: 'Everything you need to get your team communicating.',
        cta: 'Get started free',
        highlight: false,
        features: [
            { text: 'Unlimited messages', included: true },
            { text: 'Unlimited channels', included: true },
            { text: 'Threaded replies', included: true },
            { text: 'Emoji reactions', included: true },
            { text: 'File & image sharing', included: true },
            { text: 'Workspace management', included: true },
            { text: 'AI message summarization', included: false },
            { text: 'AI proofreading', included: false },
        ],
    },
    {
        name: 'Pro',
        price: '$5',
        period: 'per user / month',
        description: 'Unlock AI features that keep your team one step ahead.',
        cta: 'Get started',
        highlight: true,
        features: [
            { text: 'Unlimited messages', included: true },
            { text: 'Unlimited channels', included: true },
            { text: 'Threaded replies', included: true },
            { text: 'Emoji reactions', included: true },
            { text: 'File & image sharing', included: true },
            { text: 'Workspace management', included: true },
            { text: 'AI message summarization', included: true },
            { text: 'AI proofreading', included: true },
        ],
    },
]

const faqs = [
    {
        question: 'Can I use Clair for free?',
        answer: 'Yes — the Free plan includes all core messaging features with no time limit. You only need to upgrade if you want AI-powered features.',
    },
    {
        question: 'What AI features are included in Pro?',
        answer: 'Pro unlocks AI message summarization (summarize any thread in one click) and AI proofreading (fix grammar and clarity before you send).',
    },
    {
        question: 'Can I cancel anytime?',
        answer: 'Absolutely. Cancel anytime from your billing settings and you\'ll retain access until the end of your billing period.',
    },
    {
        question: 'Do you offer team or annual pricing?',
        answer: 'Annual pricing and volume discounts for larger teams are coming soon. Reach out if you\'d like early access.',
    },
]

export default function PricingPage() {
    return (
        <>
            <main className="pt-32 pb-24 overflow-hidden">

                {/* Header */}
                <section className="mx-auto max-w-3xl px-6 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-1.5 text-sm text-muted-foreground mb-6">
                        <Zap className="size-3.5" />
                        Simple pricing
                    </div>
                    <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-balance">
                        One upgrade, all the AI
                    </h1>
                    <p className="mt-5 text-lg text-muted-foreground text-balance max-w-xl mx-auto">
                        Start free. Add AI features when you're ready for $5/month.
                    </p>
                </section>

                {/* Plans */}
                <section className="mx-auto max-w-4xl px-6 mt-16">
                    <div className="grid md:grid-cols-2 gap-6 items-start">
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`relative rounded-2xl border p-8 space-y-6 ${
                                    plan.highlight
                                        ? 'border-primary/50 bg-primary/5 shadow-lg shadow-primary/5'
                                        : 'bg-card'
                                }`}
                            >
                                {plan.highlight && (
                                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                                        <span className="bg-gradient-to-r from-cyan-500 to-pink-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                {/* Plan header */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        {plan.highlight
                                            ? <Zap className="size-4 text-primary" />
                                            : <MessageSquare className="size-4 text-muted-foreground" />
                                        }
                                        <span className="font-semibold">{plan.name}</span>
                                    </div>
                                    <div className="flex items-end gap-1.5">
                                        <span className="text-5xl font-bold tracking-tight">{plan.price}</span>
                                        <span className="text-muted-foreground text-sm mb-1.5">{plan.period}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                                </div>

                                {/* CTA */}
                                <RegisterLink>
                                    <Button
                                        className={`w-full rounded-xl ${plan.highlight ? 'bg-gradient-to-r from-cyan-500 to-pink-500 text-white border-0 hover:opacity-90' : ''}`}
                                        variant={plan.highlight ? 'default' : 'outline'}
                                        size="lg"
                                    >
                                        {plan.cta}
                                        {plan.highlight && <ArrowRight className="size-4 ml-1.5" />}
                                    </Button>
                                </RegisterLink>

                                {/* Features */}
                                <ul className="space-y-3 pt-2 border-t border-border">
                                    {plan.features.map(({ text, included }) => (
                                        <li key={text} className="flex items-center gap-3 text-sm">
                                            {included
                                                ? <Check className="size-4 text-primary shrink-0" />
                                                : <X className="size-4 text-muted-foreground/40 shrink-0" />
                                            }
                                            <span className={included ? 'text-foreground' : 'text-muted-foreground/50'}>
                                                {text}
                                            </span>
                                            {included && text.toLowerCase().includes('ai') && (
                                                <span className="ml-auto text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">AI</span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>

                {/* AI callout */}
                <section className="mx-auto max-w-4xl px-6 mt-10">
                    <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-cyan-500/5 to-pink-500/5 p-8 flex flex-col sm:flex-row items-center gap-6">
                        <div className="size-12 rounded-xl bg-gradient-to-br from-cyan-500 to-pink-500 flex items-center justify-center shrink-0">
                            <Bot className="size-6 text-white" />
                        </div>
                        <div className="text-center sm:text-left">
                            <h3 className="font-semibold text-lg">What's included in Pro AI?</h3>
                            <p className="text-sm text-muted-foreground mt-1 max-w-lg">
                                <span className="text-foreground font-medium">Thread summarization</span> — click ✦ on any message to get a 2–3 sentence AI summary.
                                <span className="text-foreground font-medium ml-1">Proofreading</span> — hit Proofread in the editor toolbar to fix grammar and clarity before sending.
                            </p>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="mx-auto max-w-2xl px-6 mt-24">
                    <h2 className="text-2xl font-semibold tracking-tight text-center mb-10">Frequently asked questions</h2>
                    <div className="space-y-6">
                        {faqs.map(({ question, answer }) => (
                            <div key={question} className="rounded-xl border bg-card p-6 space-y-2">
                                <h3 className="font-medium">{question}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{answer}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="mx-auto max-w-3xl px-6 mt-24 text-center">
                    <div className="rounded-2xl border bg-gradient-to-b from-muted/60 to-muted/20 p-12 space-y-5">
                        <h2 className="text-2xl md:text-4xl font-semibold tracking-tight">
                            Start communicating smarter
                        </h2>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            Free to start. No credit card required.
                        </p>
                        <div className="flex items-center justify-center gap-3 flex-wrap">
                            <RegisterLink>
                                <Button size="lg" className="gap-2 rounded-xl">
                                    Get started free <ArrowRight className="size-4" />
                                </Button>
                            </RegisterLink>
                            <Button size="lg" variant="outline" className="rounded-xl" asChild>
                                <Link href="/about">Learn more</Link>
                            </Button>
                        </div>
                    </div>
                </section>

            </main>
        </>
    )
}
