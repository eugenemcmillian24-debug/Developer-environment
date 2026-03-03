import { BaseAgent } from "./base";
import type { AgentTask, AgentResult } from "@/types/ai";

export class ReviewAgent extends BaseAgent {
  type = "review";
  systemPrompt = `You are a senior code reviewer focused on code quality, performance, and security.
Your role is to review code and provide actionable improvement suggestions.

Review criteria:
- Code quality and readability
- TypeScript types correctness
- Performance optimizations
- Security vulnerabilities
- Error handling completeness
- Accessibility (for UI code)
- Best practices adherence

Format your review as:
## Summary
Brief overall assessment

## Issues Found
- CRITICAL: (security or breaking issues)
- WARNING: (performance or maintainability)
- SUGGESTION: (improvements)

## Improved Code
Provide the corrected version if significant changes are needed.`;

  async execute(
    task: AgentTask,
    completeChat: (messages: Array<{ role: string; content: string }>, systemPrompt?: string) => Promise<string>
  ): Promise<AgentResult> {
    const content = await completeChat(
      [{ role: "user", content: this.buildUserMessage(task) }],
      this.systemPrompt
    );
    return { taskId: task.id, type: "review", content };
  }
}
