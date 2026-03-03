import { NextRequest, NextResponse } from "next/server";
import { getModelRouter } from "@/lib/ai/router";
import { AgentOrchestrator } from "@/lib/agents/orchestrator";
import type { GenerateRequest, AIMessage } from "@/types/ai";

export const runtime = "nodejs";

const SYSTEM_PROMPTS: Record<string, string> = {
  react: `You are an expert React developer. Generate a complete, working React component based on the user's description.
Use TypeScript, hooks, and Tailwind CSS. Return ONLY the component code, no explanations.
Start with imports, define interfaces/types, then export default the component.`,
  nextjs: `You are an expert Next.js developer. Generate a complete Next.js page/component.
Use TypeScript, App Router patterns, and Tailwind CSS. Return ONLY the code.`,
  expo: `You are an expert React Native/Expo developer. Generate a complete Expo component.
Use TypeScript and StyleSheet. Return ONLY the component code.`,
  nodejs: `You are an expert Node.js/Express developer. Generate a complete Express API.
Use proper error handling, validation, and clean code. Return ONLY the code.`,
  generic: `You are an expert developer. Generate clean, working code based on the description.
Return ONLY the code with minimal comments.`,
};

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json();
    const { prompt, type = "react", model, provider = "groq", context } = body;

    if (!prompt) {
      return NextResponse.json({ error: "prompt required" }, { status: 400 });
    }

    const router = getModelRouter();
    const available = router.getAvailableProviders();

    if (available.length === 0) {
      return NextResponse.json(
        { error: "No AI providers configured" },
        { status: 503 }
      );
    }

    const orchestrator = new AgentOrchestrator();
    const selectedProvider = available.includes(provider) ? provider : available[0];

    const chatFn = async (messages: Array<{ role: string; content: string }>, systemPrompt?: string) => {
      const aiMessages: AIMessage[] = messages.map((m, i) => ({
        id: `msg-${i}`,
        role: m.role as "user" | "assistant" | "system",
        content: m.content,
        timestamp: Date.now(),
      }));
      return router.completeChat(aiMessages, selectedProvider, model || "", systemPrompt);
    };

    const agentType = orchestrator.detectTaskType(prompt);
    const result = await orchestrator.runAgent(
      {
        id: `gen-${Date.now()}`,
        type: agentType,
        prompt,
        context,
        model,
      },
      chatFn
    );

    const codeMatch = result.content.match(/```(?:\w+)?\n?([\s\S]+?)```/);
    const code = codeMatch ? codeMatch[1].trim() : result.content;

    return NextResponse.json({
      code,
      fullResponse: result.content,
      files: result.files || {},
      agentType,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
