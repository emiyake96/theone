import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { NextRequest, NextResponse } from "next/server";
import arcjet, { createMiddleware, detectBot } from "@arcjet/next";

const aj = arcjet({
    key: process.env.ARCJET_KEY!, // Get your site key from https://app.arcjet.com
    rules: [
        detectBot({
            mode: "DRY_RUN", // Blocks requests. Use "DRY_RUN" to log only
            allow: [], // Block all bots. See https://arcjet.com/bot-list
        }),
    ],
});


export const config = {
    matcher: [
        "/(dashboard|settings|explore|notifications|messages|profile|search|help|about)(.*)",
        "/api/(.*)",
    ]
}

async function exisistingMiddleWare(req: NextRequest) {
    const {getClaim} = getKindeServerSession()
    const orgCode = await getClaim("org_code")

    const url = req.nextUrl;

    if(
        url.pathname.startsWith('/workspace') && !url.pathname.includes(orgCode?.value || '')
        ) {
            url.pathname = `/workspace/${orgCode?.value}`

            return NextResponse.redirect(url)
        }
    
    return NextResponse.next()
}

export default createMiddleware(aj, exisistingMiddleWare)