import { NextRequest, NextResponse } from "next/server";
import { getModelRouter } from "@/lib/ai/router";
import type { ChatRequest, AIMessage } from "@/types/ai";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json();
    const { messages, model, provider, systemPrompt, stream = true } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "messages array required" }, { status: 400 });
    }

    const router = getModelRouter();
    const available = router.getAvailableProviders();

    if (available.length === 0) {
      return NextResponse.json(
        { error: "No AI providers configured. Set OPENROUTER_API_KEY or GROQ_API_KEY in .env.local" },
        { status: 503 }
      );
    }

    const aiMessages: AIMessage[] = messages.map((m, i) => ({
      id: `msg-${i}`,
      role: m.role as "user" | "assistant" | "system",
      content: m.content,
      timestamp: Date.now(),
    }));

    if (stream) {
      const iterable = await router.streamChat(aiMessages, provider, model, systemPrompt);

      const readable = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          try {
            for await (const chunk of iterable) {
              const data = JSON.stringify({ choices: [{ delta: { content: chunk } }] });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          } catch (err) {
            const message = err instanceof Error ? err.message : "Stream error";
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`));
          } finally {
            controller.close();
          }
        },
      });

      return new Response(readable, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    const content = await router.completeChat(aiMessages, provider, model, systemPrompt);
    return NextResponse.json({ content, model, provider });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
