import { BaseAIProvider } from "./base";
import { OPENROUTER_MODELS, DEFAULT_MODEL_OPENROUTER } from "../types";
import type { AIMessage, AIModel } from "@/types/ai";

export class OpenRouterProvider extends BaseAIProvider {
  private apiKey: string;
  private baseUrl = "https://openrouter.ai/api/v1";

  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
  }

  getModels(): AIModel[] {
    return OPENROUTER_MODELS;
  }

  async chat(
    messages: AIMessage[],
    model: string = DEFAULT_MODEL_OPENROUTER,
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
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": process.env.NEXT_PUBLIC_APP_NAME || "DevBase",
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
      throw new Error(`OpenRouter error ${response.status}: ${error}`);
    }

    return this.streamToAsyncIterable(response);
  }

  async chatComplete(
    messages: AIMessage[],
    model: string = DEFAULT_MODEL_OPENROUTER,
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
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": process.env.NEXT_PUBLIC_APP_NAME || "DevBase",
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
      throw new Error(`OpenRouter error ${response.status}: ${error}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "";
  }
}
