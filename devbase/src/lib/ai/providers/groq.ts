import { BaseAIProvider } from "./base";
import { GROQ_MODELS, DEFAULT_MODEL_GROQ, GROQ_TRANSCRIPTION_MODEL } from "../types";
import type { AIMessage, AIModel } from "@/types/ai";

export class GroqProvider extends BaseAIProvider {
  private apiKey: string;
  private baseUrl = "https://api.groq.com/openai/v1";

  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
  }

  getModels(): AIModel[] {
    return GROQ_MODELS;
  }

  async chat(
    messages: AIMessage[],
    model: string = DEFAULT_MODEL_GROQ,
    systemPrompt?: string
  ): Promise<AsyncIterable<string>> {
    const allMessages = systemPrompt
      ? [{ role: "system", content: systemPrompt }, ...this.formatMessages(messages)]
      : this.formatMessages(messages);

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: allMessages,
        stream: true,
        temperature: 0.7,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Groq error ${response.status}: ${error}`);
    }

    return this.streamToAsyncIterable(response);
  }

  async chatComplete(
    messages: AIMessage[],
    model: string = DEFAULT_MODEL_GROQ,
    systemPrompt?: string
  ): Promise<string> {
    const allMessages = systemPrompt
      ? [{ role: "system", content: systemPrompt }, ...this.formatMessages(messages)]
      : this.formatMessages(messages);

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: allMessages,
        stream: false,
        temperature: 0.7,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Groq error ${response.status}: ${error}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "";
  }

  async transcribe(audioBlob: Blob, filename = "audio.webm"): Promise<string> {
    const formData = new FormData();
    formData.append("file", audioBlob, filename);
    formData.append("model", GROQ_TRANSCRIPTION_MODEL);
    formData.append("language", "en");
    formData.append("response_format", "text");

    const response = await fetch(`${this.baseUrl}/audio/transcriptions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Groq transcription error ${response.status}: ${error}`);
    }

    return response.text();
  }
}
