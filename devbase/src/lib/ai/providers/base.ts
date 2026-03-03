import type { AIMessage, AIModel } from "@/types/ai";

export abstract class BaseAIProvider {
  abstract getModels(): AIModel[];

  protected formatMessages(messages: AIMessage[]): Array<{ role: string; content: string }> {
    return messages.map((m) => ({ role: m.role, content: m.content }));
  }

  protected async *streamToAsyncIterable(response: Response): AsyncIterable<string> {
    if (!response.body) throw new Error("No response body");
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data === "[DONE]") return;
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) yield content;
            } catch {
              // skip malformed chunks
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}
