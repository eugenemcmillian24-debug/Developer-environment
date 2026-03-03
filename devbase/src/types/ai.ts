export type AIProviderName = "openrouter" | "groq";

export interface AIModel {
  id: string;
  name: string;
  provider: AIProviderName;
  contextLength?: number;
  description?: string;
  free?: boolean;
  supportsVision?: boolean;
}

export interface AIMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  model?: string;
  provider?: AIProviderName;
}

export interface AIProvider {
  name: AIProviderName;
  chat(messages: AIMessage[], model: string, systemPrompt?: string): Promise<AsyncIterable<string>>;
  transcribe?(audio: Blob): Promise<string>;
  getModels(): AIModel[];
}

export interface ChatRequest {
  messages: Array<{ role: string; content: string }>;
  model: string;
  provider: AIProviderName;
  systemPrompt?: string;
  stream?: boolean;
}

export interface ChatResponse {
  content: string;
  model: string;
  provider: AIProviderName;
}

export interface TranscribeRequest {
  audioBase64: string;
  mimeType: string;
}

export interface GenerateRequest {
  prompt: string;
  type: "react" | "nextjs" | "expo" | "nodejs" | "generic";
  model?: string;
  provider?: AIProviderName;
  context?: string;
}

export interface ScaffoldRequest {
  projectName: string;
  template: "nextjs" | "react" | "expo" | "nodejs";
  features?: string[];
  aiAssisted?: boolean;
  prompt?: string;
}

export type AgentType = "architect" | "frontend" | "backend" | "review";

export interface AgentTask {
  id: string;
  type: AgentType;
  prompt: string;
  context?: string;
  model?: string;
}

export interface AgentResult {
  taskId: string;
  type: AgentType;
  content: string;
  files?: Record<string, string>;
}
