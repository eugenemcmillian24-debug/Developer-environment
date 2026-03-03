import { NextRequest, NextResponse } from "next/server";
import { GroqProvider } from "@/lib/ai/providers/groq";
import type { TranscribeRequest } from "@/types/ai";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY not configured. Groq is required for transcription." },
        { status: 503 }
      );
    }

    const body: TranscribeRequest = await req.json();
    const { audioBase64, mimeType } = body;

    if (!audioBase64) {
      return NextResponse.json({ error: "audioBase64 required" }, { status: 400 });
    }

    const buffer = Buffer.from(audioBase64, "base64");
    const audioBlob = new Blob([buffer], { type: mimeType || "audio/webm" });

    const provider = new GroqProvider(process.env.GROQ_API_KEY);
    const transcript = await provider.transcribe(audioBlob);

    return NextResponse.json({ transcript: transcript.trim() });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Transcription failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
