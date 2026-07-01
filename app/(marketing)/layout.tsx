import { HeroHeader } from './_components/header'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <HeroHeader />
            {children}
        </>
    )
}
