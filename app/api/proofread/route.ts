import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const openrouter = createOpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY!,
});

function stripHtml(html: string) {
    return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export async function POST(req: Request) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const { content } = await req.json() as { content: string };
    const plainText = stripHtml(content);

    if (!plainText) return Response.json({ error: "Nothing to proofread" }, { status: 400 });

    const prompt = `You are a proofreader. Fix grammar, spelling, punctuation, and clarity in the message below while preserving the original meaning, tone, and intent exactly. Do not add new ideas or change what the person is trying to say. Return ONLY the corrected plain text — no explanations, no commentary, no quotes.

Message:
${plainText}`;

    try {
        const { text } = await generateText({
            model: openrouter("anthropic/claude-3-haiku"),
            prompt,
            maxOutputTokens: 500,
        });

        return Response.json({ proofread: text.trim() });
    } catch (err: any) {
        return Response.json({ error: err?.message ?? "Failed to proofread" }, { status: 500 });
    }
}
