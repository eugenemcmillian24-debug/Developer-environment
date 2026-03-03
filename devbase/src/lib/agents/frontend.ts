import { BaseAgent } from "./base";
import type { AgentTask, AgentResult } from "@/types/ai";

export class FrontendAgent extends BaseAgent {
  type = "frontend";
  systemPrompt = `You are an expert frontend developer specializing in React, Next.js, TypeScript, and Tailwind CSS.
Your role is to generate production-ready frontend code.

Guidelines:
- Write TypeScript with strict typing
- Use modern React patterns (hooks, functional components)
- Apply Tailwind CSS for styling with responsive design
- Include proper error handling and loading states
- Follow accessibility best practices (ARIA labels, semantic HTML)
- Add proper file imports
- For Expo/React Native, use StyleSheet and platform-appropriate components

When generating code:
1. Start with the main component file
2. Include all necessary imports
3. Add TypeScript interfaces/types
4. Export the component as default
5. Provide usage example in comments

Format: Output complete, runnable code files. Use \`\`\`typescript filename.tsx blocks.`;

  async execute(
    task: AgentTask,
    completeChat: (messages: Array<{ role: string; content: string }>, systemPrompt?: string) => Promise<string>
  ): Promise<AgentResult> {
    const content = await completeChat(
      [{ role: "user", content: this.buildUserMessage(task) }],
      this.systemPrompt
    );

    const files = this.extractFiles(content);
    return { taskId: task.id, type: "frontend", content, files };
  }

  private extractFiles(content: string): Record<string, string> {
    const files: Record<string, string> = {};
    const regex = /```(?:typescript|tsx|jsx|javascript|js|ts)\s+(\S+)\n([\s\S]*?)```/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      files[match[1]] = match[2].trim();
    }
    return files;
  }
}
