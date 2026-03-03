import { OpenRouterProvider } from "./providers/openrouter";
import { GroqProvider } from "./providers/groq";
import { DEFAULT_MODEL_OPENROUTER, DEFAULT_MODEL_GROQ } from "./types";
import type { AIProviderName, AIMessage } from "@/types/ai";

export class ModelRouter {
  private openrouter: OpenRouterProvider | null = null;
  private groq: GroqProvider | null = null;

  constructor() {
    if (process.env.OPENROUTER_API_KEY) {
      this.openrouter = new OpenRouterProvider(process.env.OPENROUTER_API_KEY);
    }
    if (process.env.GROQ_API_KEY) {
      this.groq = new GroqProvider(process.env.GROQ_API_KEY);
    }
  }

  selectProvider(requestedProvider: AIProviderName): AIProviderName {
    if (requestedProvider === "groq" && this.groq) return "groq";
    if (requestedProvider === "openrouter" && this.openrouter) return "openrouter";
    if (this.groq) return "groq";
    if (this.openrouter) return "openrouter";
    throw new Error("No AI providers configured. Please set OPENROUTER_API_KEY or GROQ_API_KEY.");
  }

  async streamChat(
    messages: AIMessage[],
    provider: AIProviderName,
    model: string,
    systemPrompt?: string
  ): Promise<AsyncIterable<string>> {
    const selected = this.selectProvider(provider);

    if (selected === "groq" && this.groq) {
      const resolvedModel = model && model.startsWith("llama") || model.startsWith("deepseek") || model.startsWith("gemma") || model.startsWith("mixtral")
        ? model
        : DEFAULT_MODEL_GROQ;
      return this.groq.chat(messages, resolvedModel, systemPrompt);
    }

    if (selected === "openrouter" && this.openrouter) {
      return this.openrouter.chat(messages, model || DEFAULT_MODEL_OPENROUTER, systemPrompt);
    }

    throw new Error(`Provider ${selected} not available`);
  }

  async completeChat(
    messages: AIMessage[],
    provider: AIProviderName,
    model: string,
    systemPrompt?: string
  ): Promise<string> {
    const selected = this.selectProvider(provider);

    if (selected === "groq" && this.groq) {
      return this.groq.chatComplete(messages, model || DEFAULT_MODEL_GROQ, systemPrompt);
    }

    if (selected === "openrouter" && this.openrouter) {
      return this.openrouter.chatComplete(messages, model || DEFAULT_MODEL_OPENROUTER, systemPrompt);
    }

    throw new Error(`Provider ${selected} not available`);
  }

  async transcribe(audioBlob: Blob): Promise<string> {
    if (!this.groq) throw new Error("Groq not configured. Set GROQ_API_KEY for transcription.");
    return this.groq.transcribe(audioBlob);
  }

  getAvailableProviders(): AIProviderName[] {
    const providers: AIProviderName[] = [];
    if (this.openrouter) providers.push("openrouter");
    if (this.groq) providers.push("groq");
    return providers;
  }
}

let routerInstance: ModelRouter | null = null;

export function getModelRouter(): ModelRouter {
  if (!routerInstance) {
    routerInstance = new ModelRouter();
  }
  return routerInstance;
}
