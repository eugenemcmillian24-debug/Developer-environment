import type { AIModel, AIProviderName } from "@/types/ai";

export const OPENROUTER_MODELS: AIModel[] = [
  { id: "meta-llama/llama-3.3-70b-instruct:free", name: "Llama 3.3 70B (Free)", provider: "openrouter", contextLength: 131072, free: true },
  { id: "meta-llama/llama-3.1-405b-instruct", name: "Llama 3.1 405B", provider: "openrouter", contextLength: 131072 },
  { id: "deepseek/deepseek-r1:free", name: "DeepSeek R1 (Free)", provider: "openrouter", contextLength: 163840, free: true },
  { id: "deepseek/deepseek-chat-v3-0324:free", name: "DeepSeek Chat V3 (Free)", provider: "openrouter", contextLength: 131072, free: true },
  { id: "google/gemma-3-27b-it:free", name: "Gemma 3 27B (Free)", provider: "openrouter", contextLength: 131072, free: true, supportsVision: true },
  { id: "google/gemini-2.0-flash-001", name: "Gemini 2.0 Flash", provider: "openrouter", contextLength: 1048576, supportsVision: true },
  { id: "mistralai/devstral-small:free", name: "Devstral Small (Free)", provider: "openrouter", contextLength: 131072, free: true, description: "Code-focused" },
  { id: "mistralai/mistral-small-3.1-24b-instruct:free", name: "Mistral Small 3.1 24B (Free)", provider: "openrouter", contextLength: 131072, free: true, supportsVision: true },
  { id: "qwen/qwen3-coder:free", name: "Qwen3 Coder (Free)", provider: "openrouter", contextLength: 131072, free: true, description: "Code-focused" },
  { id: "qwen/qwen3-235b-a22b:free", name: "Qwen3 235B (Free)", provider: "openrouter", contextLength: 131072, free: true },
  { id: "nvidia/llama-3.1-nemotron-ultra-253b-v1:free", name: "Nemotron Ultra 253B (Free)", provider: "openrouter", contextLength: 131072, free: true },
  { id: "moonshotai/kimi-vl-a3b-thinking:free", name: "Kimi VL A3B (Free)", provider: "openrouter", contextLength: 131072, free: true, supportsVision: true },
];

export const GROQ_MODELS: AIModel[] = [
  { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B Versatile", provider: "groq", contextLength: 128000, description: "Best quality, versatile" },
  { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B Instant", provider: "groq", contextLength: 131072, description: "Fastest responses" },
  { id: "deepseek-r1-distill-llama-70b", name: "DeepSeek R1 Distill 70B", provider: "groq", contextLength: 131072, description: "Reasoning model" },
  { id: "gemma2-9b-it", name: "Gemma 2 9B", provider: "groq", contextLength: 8192, description: "Efficient & fast" },
  { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B", provider: "groq", contextLength: 32768, description: "MoE architecture" },
];

export const ALL_MODELS: AIModel[] = [...OPENROUTER_MODELS, ...GROQ_MODELS];

export function getModelsByProvider(provider: AIProviderName): AIModel[] {
  return ALL_MODELS.filter((m) => m.provider === provider);
}

export function getModelById(id: string): AIModel | undefined {
  return ALL_MODELS.find((m) => m.id === id);
}

export const DEFAULT_MODEL_OPENROUTER = "meta-llama/llama-3.3-70b-instruct:free";
export const DEFAULT_MODEL_GROQ = "llama-3.3-70b-versatile";
export const GROQ_TRANSCRIPTION_MODEL = "distil-whisper-large-v3-en";
