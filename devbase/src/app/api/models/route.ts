import { NextResponse } from "next/server";
import { ALL_MODELS, OPENROUTER_MODELS, GROQ_MODELS } from "@/lib/ai/types";
import { getModelRouter } from "@/lib/ai/router";

export const runtime = "nodejs";

export async function GET() {
  const router = getModelRouter();
  const available = router.getAvailableProviders();

  return NextResponse.json({
    models: ALL_MODELS,
    openrouter: OPENROUTER_MODELS,
    groq: GROQ_MODELS,
    availableProviders: available,
    configured: {
      openrouter: available.includes("openrouter"),
      groq: available.includes("groq"),
    },
  });
}
