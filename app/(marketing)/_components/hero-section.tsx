import Link from 'next/link'
import { ArrowRight, Bolt, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RegisterLink } from '@kinde-oss/kinde-auth-nextjs/components'
import Image from 'next/image'
import { AnimatedGroup } from '@/components/motion-primitives/animated-group'
import { TextEffect } from '@/components/motion-primitives/text-effect'
import VercelLogoDark from '@/public/assets/logos/Vercel_wordmark_dark.svg'
import MotionLogoDark from '@/public/assets/logos/Motion_dark.svg'
import NeonLogo from '@/public/assets/logos/neon.svg'
import NextLogo from '@/public/assets/logos/Next.js_wordmark_dark.svg'
import PrismaLogo from '@/public/assets/logos/Prisma_dark.svg'
import OpenAILogo from '@/public/assets/logos/OpenAI_wordmark_dark.svg'
import Kinde from '@/public/assets/logos/kinde.svg'
import Arcjet from '@/public/assets/logos/arcjet.svg'

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring',
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
} as const

export default function HeroSection() {
    return (
        <>
            <main className="overflow-hidden">
                <div
                    aria-hidden
                    className="absolute inset-0 isolate hidden opacity-65 contain-strict lg:block">
                    <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
                    <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
                    <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
                </div>
                <section>
                    <div className="relative pt-24 md:pt-36">
                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            delayChildren: 1,
                                        },
                                    },
                                },
                                item: {
                                    hidden: {
                                        opacity: 0,
                                        y: 20,
                                    },
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        transition: {
                                            type: 'spring',
                                            bounce: 0.3,
                                            duration: 2,
                                        },
                                    },
                                },
                            }}
                            className="mask-b-from-35% mask-b-to-90% absolute inset-0 top-56 -z-20 lg:top-32" children={undefined}>
                            {/* <Image
                                src="https://ik.imagekit.io/lrigu76hy/tailark/night-background.jpg?updatedAt=1745733451120"
                                alt="background"
                                className="hidden size-full dark:block"
                                width="3276"
                                height="4095"
                            /> */}
                        </AnimatedGroup>

                        <div
                            aria-hidden
                            className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"
                        />

                        <div className="mx-auto max-w-7xl px-6">
                            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                                <AnimatedGroup variants={transitionVariants}>
                                    <Link
                                        href="/about"
                                        className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950">
                                        <span className="text-foreground text-sm">Introducing new AI features</span>
                                        <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

                                        <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                                            <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </AnimatedGroup>

                                <TextEffect
                                    preset="fade-in-blur"
                                    speedSegment={0.3}
                                    as="h1"
                                    className="mx-auto mt-8 max-w-4xl text-balance text-5xl max-md:font-semibold md:text-7xl lg:mt-16 xl:text-[5.25rem]">
                                    The AI ready tool for team communication
                                </TextEffect>
                                <TextEffect
                                    per="line"
                                    preset="fade-in-blur"
                                    speedSegment={0.3}
                                    delay={0.5}
                                    as="p"
                                    className="mx-auto mt-8 max-w-2xl text-balance text-lg">
                                    Organizes conversations into channels with threads in realtime, and uses AI to keep teams in sync.
                                </TextEffect>

                                <AnimatedGroup
                                    variants={{
                                        container: {
                                            visible: {
                                                transition: {
                                                    staggerChildren: 0.05,
                                                    delayChildren: 0.75,
                                                },
                                            },
                                        },
                                        ...transitionVariants,
                                    }}
                                    className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row">
                                    <div
                                        key={1}
                                        className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5">
                                        <RegisterLink>
                                            <Button
                                                size="lg"
                                                className="rounded-xl px-5 text-base">
                                                <span className="text-nowrap">Get Started</span>
                                            </Button>
                                        </RegisterLink>
                                    </div>
                                </AnimatedGroup>
                            </div>
                        </div>

                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.05,
                                            delayChildren: 0.75,
                                        },
                                    },
                                },
                                ...transitionVariants,
                            }}>
                            <div className="mask-b-from-55% relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                                <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
                                    <Image
                                        className="bg-background relative rounded-2xl w-full"
                                        src="/app-dark.png"
                                        alt="app screen"
                                        width="2600"
                                        height="1272"
                                        priority
                                    />
                                </div>
                            </div>
                        </AnimatedGroup>
                    </div>
                </section>
                <section className="bg-background pb-16 pt-16 md:pb-32">
                    <div className="group relative m-auto max-w-5xl px-6">
                        <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
                            <Link
                                href="/"
                                className="block text-sm duration-150 hover:opacity-75">
                                <span> How It Works</span>

                                <ChevronRight className="ml-1 inline-block size-3" />
                            </Link>
                        </div>
                        <div className="group-hover:blur-xs mx-auto mt-12 grid max-w-2xl grid-cols-3 gap-x-12 gap-y-8 transition-all duration-500 group-hover:opacity-50 sm:gap-x-16 sm:gap-y-14 md:grid-cols-4">
                            <div className="flex items-center">
                                <Image className="h-8 invert dark:invert-0" src={VercelLogoDark} alt="Vercel" />
                            </div>
                            <div className="flex items-center">
                                <Image className="h-8 mx-auto invert dark:invert-0" src={MotionLogoDark} alt="Motion" />
                            </div>
                            <div className="flex items-center">
                                <Image className="h-8 mx-auto invert dark:invert-0" src={NeonLogo} alt="Neon" />
                            </div>
                            <div className="flex items-center">
                                <Image className="h-8 invert dark:invert-0" src={NextLogo} alt="Next.js" />
                            </div>
                            <div className="flex items-center">
                                <Image className="h-8 mx-auto invert dark:invert-0" src={PrismaLogo} alt="Prisma" />
                            </div>
                            <div className="flex items-center">
                                <Image className="h-8 mx-auto invert dark:invert-0" src={OpenAILogo} alt="OpenAI" />
                            </div>
                            <div className="flex items-center">
                                <Image className="h-8 w-fit mx-auto dark:invert" src={Kinde} alt="Kinde" />
                            </div>
                            <div className="flex items-center">
                                <Image className="h-fit w-fit mx-auto dark:invert" src={Arcjet} alt="Arcjet" />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}