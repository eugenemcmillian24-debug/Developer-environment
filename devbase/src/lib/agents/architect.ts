import { BaseAgent } from "./base";
import type { AgentTask, AgentResult } from "@/types/ai";

export class ArchitectAgent extends BaseAgent {
  type = "architect";
  systemPrompt = `You are a senior software architect specializing in modern web and mobile applications.
Your role is to:
- Design scalable system architectures
- Select appropriate tech stacks based on requirements
- Define project structure and folder organization
- Identify potential issues and edge cases
- Provide clear technical specifications

Always respond with structured, actionable architectural decisions.
Format your response with clear sections: Overview, Tech Stack, Architecture, File Structure, Key Decisions.`;

  async execute(
    task: AgentTask,
    completeChat: (messages: Array<{ role: string; content: string }>, systemPrompt?: string) => Promise<string>
  ): Promise<AgentResult> {
    const content = await completeChat(
      [{ role: "user", content: this.buildUserMessage(task) }],
      this.systemPrompt
    );
    return { taskId: task.id, type: "architect", content };
  }
}
