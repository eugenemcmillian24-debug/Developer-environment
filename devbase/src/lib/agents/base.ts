import type { AgentTask, AgentResult } from "@/types/ai";

export abstract class BaseAgent {
  abstract type: string;
  abstract systemPrompt: string;

  abstract execute(task: AgentTask, completeChat: (messages: Array<{ role: string; content: string }>, systemPrompt?: string) => Promise<string>): Promise<AgentResult>;

  protected buildUserMessage(task: AgentTask): string {
    let message = task.prompt;
    if (task.context) {
      message = `Context:\n${task.context}\n\nTask:\n${task.prompt}`;
    }
    return message;
  }
}
