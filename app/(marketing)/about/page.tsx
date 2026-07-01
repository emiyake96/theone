import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { RegisterLink } from '@kinde-oss/kinde-auth-nextjs/components'
import {
    MessageSquare, Zap, ShieldCheck, Bot,
    GitBranch, Users, ArrowRight, Layers
} from 'lucide-react'

const features = [
    {
        icon: MessageSquare,
        title: 'Real-time Channels',
        description: 'Organize conversations into channels and threads so nothing gets lost in the noise.',
    },
    {
        icon: Bot,
        title: 'AI Summarization',
        description: 'One click to summarize any message or thread — stay in the loop without reading everything.',
    },
    {
        icon: Zap,
        title: 'AI Proofreading',
        description: 'Fix grammar and clarity before you send, without changing what you actually mean.',
    },
    {
        icon: Users,
        title: 'Workspace Management',
        description: 'Create multiple workspaces, invite members, and manage roles — all in one place.',
    },
    {
        icon: GitBranch,
        title: 'Threaded Replies',
        description: 'Keep side conversations organized without cluttering the main channel.',
    },
    {
        icon: ShieldCheck,
        title: 'Built-in Security',
        description: 'Auth powered by Kinde and rate limiting via Arcjet to keep your team safe.',
    },
]

const stack = [
    { name: 'Next.js 15', description: 'App Router + Turbopack' },
    { name: 'Neon', description: 'Serverless Postgres' },
    { name: 'Prisma', description: 'Type-safe ORM' },
    { name: 'Kinde', description: 'Authentication & orgs' },
    { name: 'OpenRouter', description: 'AI model routing' },
    { name: 'Stripe', description: 'Billing & subscriptions' },
    { name: 'oRPC', description: 'Type-safe RPC layer' },
    { name: 'Tailwind v4', description: 'Styling' },
]

export default function AboutPage() {
    return (
        <>
            <main className="pt-32 pb-24 overflow-hidden">

                {/* Hero */}
                <section className="mx-auto max-w-4xl px-6 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-1.5 text-sm text-muted-foreground mb-6">
                        <Layers className="size-3.5" />
                        About Clair
                    </div>
                    <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-balance">
                        Built for teams that move fast
                    </h1>
                    <p className="mt-6 text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
                        theone is a modern team communication platform that combines real-time messaging with AI tools — so your team can focus on the work, not the noise.
                    </p>
                </section>

                {/* Mission */}
                <section className="mx-auto max-w-5xl px-6 mt-24">
                    <div className="rounded-2xl border bg-muted/40 p-10 md:p-16 grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Our mission</h2>
                            <p className="mt-4 text-muted-foreground leading-relaxed">
                                Most team chat tools were built before AI existed. We built theone from the ground up with AI as a first-class feature — not an afterthought. Summarize long threads, proofread messages, and stay in sync without spending hours reading back through channels.
                            </p>
                            <p className="mt-4 text-muted-foreground leading-relaxed">
                                Communication should feel effortless. theone gets out of your way and lets your team do their best work.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: 'Real-time', value: 'Messaging' },
                                { label: 'AI-powered', value: 'Summaries' },
                                { label: 'Unlimited', value: 'Channels' },
                                { label: 'Built-in', value: 'Security' },
                            ].map(({ label, value }) => (
                                <div key={value} className="rounded-xl border bg-background p-4">
                                    <p className="text-xs text-muted-foreground">{label}</p>
                                    <p className="mt-1 font-semibold">{value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="mx-auto max-w-5xl px-6 mt-24">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Everything your team needs</h2>
                        <p className="mt-3 text-muted-foreground">Powerful features without the bloat.</p>
                    </div>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
                        {features.map(({ icon: Icon, title, description }) => (
                            <div key={title} className="rounded-xl border bg-card p-6 space-y-3 hover:border-primary/30 transition-colors">
                                <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Icon className="size-4 text-primary" />
                                </div>
                                <h3 className="font-semibold">{title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Tech stack */}
                <section className="mx-auto max-w-5xl px-6 mt-24">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Built on the modern stack</h2>
                        <p className="mt-3 text-muted-foreground">Fast, reliable, and built to scale.</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {stack.map(({ name, description }) => (
                            <div key={name} className="rounded-xl border bg-card px-5 py-4 text-center hover:border-primary/30 transition-colors">
                                <p className="font-semibold text-sm">{name}</p>
                                <p className="text-xs text-muted-foreground mt-1">{description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="mx-auto max-w-3xl px-6 mt-24 text-center">
                    <div className="rounded-2xl border bg-gradient-to-b from-muted/60 to-muted/20 p-12 space-y-6">
                        <h2 className="text-2xl md:text-4xl font-semibold tracking-tight">
                            Ready to get started?
                        </h2>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            Join teams already using theone to communicate faster and smarter.
                        </p>
                        <div className="flex items-center justify-center gap-3 flex-wrap">
                            <RegisterLink>
                                <Button size="lg" className="gap-2 rounded-xl">
                                    Get started free <ArrowRight className="size-4" />
                                </Button>
                            </RegisterLink>
                            <Button size="lg" variant="outline" className="rounded-xl" asChild>
                                <Link href="/">Back to home</Link>
                            </Button>
                        </div>
                    </div>
                </section>

            </main>
        </>
    )
}
