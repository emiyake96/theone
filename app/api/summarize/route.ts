import { createOpenAI } from "@ai-sdk/openai";

const openrouter = createOpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY!,
});
import { generateText } from "ai";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

function stripHtml(html: string) {
    return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export async function POST(req: Request) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { content, authorName, replies } = await req.json() as {
        content: string;
        authorName: string | null;
        replies?: { content: string; authorName: string | null }[];
    };

    const mainText = stripHtml(content);

    let prompt: string;

    if (replies && replies.length > 0) {
        const threadText = [
            `${authorName ?? "Someone"}: ${mainText}`,
            ...replies.map((r) => `${r.authorName ?? "Someone"}: ${stripHtml(r.content)}`),
        ].join("\n");

        prompt = `Summarize the following chat thread in 2–3 concise sentences. Focus on the key points and any conclusions reached. Do not start with "This thread" or "The thread".\n\n${threadText}`;
    } else {
        prompt = `Summarize the following message in 1–2 concise sentences. Be direct and capture the main point.\n\nMessage: ${mainText}`;
    }

    try {
        const { text } = await generateText({
            model: openrouter("anthropic/claude-3-haiku"),
            prompt,
            maxTokens: 150,
        });

        return Response.json({ summary: text.trim() });
    } catch (err: any) {
        console.error("Summarize error:", err);
        return Response.json(
            { error: err?.message ?? "Failed to generate summary" },
            { status: 500 }
        );
    }
}
