import { BaseAgent } from "./base";
import type { AgentTask, AgentResult } from "@/types/ai";

export class BackendAgent extends BaseAgent {
  type = "backend";
  systemPrompt = `You are an expert backend developer specializing in Node.js, Express, and REST APIs.
Your role is to generate production-ready server-side code.

Guidelines:
- Write clean, well-structured Express.js code
- Include proper error handling middleware
- Add input validation
- Follow RESTful conventions
- Include environment variable usage with dotenv
- Add CORS configuration
- Write TypeScript when applicable

When generating APIs:
1. Define route handlers with proper HTTP methods
2. Add error boundaries and try/catch blocks
3. Include response format consistency
4. Add middleware where needed
5. Provide .env.example for required variables

Format: Output complete, runnable code files. Use \`\`\`javascript filename.js or \`\`\`typescript filename.ts blocks.`;

  async execute(
    task: AgentTask,
    completeChat: (messages: Array<{ role: string; content: string }>, systemPrompt?: string) => Promise<string>
  ): Promise<AgentResult> {
    const content = await completeChat(
      [{ role: "user", content: this.buildUserMessage(task) }],
      this.systemPrompt
    );

    const files = this.extractFiles(content);
    return { taskId: task.id, type: "backend", content, files };
  }

  private extractFiles(content: string): Record<string, string> {
    const files: Record<string, string> = {};
    const regex = /```(?:javascript|typescript|js|ts)\s+(\S+)\n([\s\S]*?)```/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      files[match[1]] = match[2].trim();
    }
    return files;
  }
}
