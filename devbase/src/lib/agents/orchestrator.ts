import { ArchitectAgent } from "./architect";
import { FrontendAgent } from "./frontend";
import { BackendAgent } from "./backend";
import { ReviewAgent } from "./review";
import type { AgentTask, AgentResult, AgentType } from "@/types/ai";

type ChatFn = (messages: Array<{ role: string; content: string }>, systemPrompt?: string) => Promise<string>;

export class AgentOrchestrator {
  private agents: Record<AgentType, { execute: (task: AgentTask, fn: ChatFn) => Promise<AgentResult> }>;

  constructor() {
    this.agents = {
      architect: new ArchitectAgent(),
      frontend: new FrontendAgent(),
      backend: new BackendAgent(),
      review: new ReviewAgent(),
    };
  }

  async runAgent(task: AgentTask, chatFn: ChatFn): Promise<AgentResult> {
    const agent = this.agents[task.type];
    if (!agent) throw new Error(`Unknown agent type: ${task.type}`);
    return agent.execute(task, chatFn);
  }

  async runPipeline(
    prompt: string,
    types: AgentType[],
    chatFn: ChatFn
  ): Promise<AgentResult[]> {
    const results: AgentResult[] = [];
    let context = "";

    for (const type of types) {
      const task: AgentTask = {
        id: `${type}-${Date.now()}`,
        type,
        prompt,
        context: context || undefined,
      };
      const result = await this.runAgent(task, chatFn);
      results.push(result);
      context = result.content;
    }

    return results;
  }

  detectTaskType(prompt: string): AgentType {
    const lower = prompt.toLowerCase();
    if (lower.includes("architecture") || lower.includes("design") || lower.includes("plan")) return "architect";
    if (lower.includes("review") || lower.includes("check") || lower.includes("improve")) return "review";
    if (lower.includes("api") || lower.includes("server") || lower.includes("backend") || lower.includes("express")) return "backend";
    return "frontend";
  }
}
