"use client";

import { useCallback } from "react";
import { useChatStore } from "../store";
import type { AIMessage } from "@/types/ai";

export function useChat() {
  const store = useChatStore();

  const sendMessage = useCallback(
    async (content: string) => {
      const { settings, addMessage, updateLastMessage, setLoading, setError } = store;

      const userMessage = addMessage({ role: "user", content });
      const assistantMessage = addMessage({ role: "assistant", content: "" });

      setLoading(true);
      setError(null);

      try {
        const messagesToSend: Array<{ role: string; content: string }> = store.messages
          .filter((m) => m.id !== assistantMessage.id)
          .map((m) => ({ role: m.role, content: m.content }));

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: messagesToSend,
            model: settings.model,
            provider: settings.provider,
            systemPrompt: settings.systemPrompt,
            stream: true,
          }),
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || "Chat request failed");
        }

        if (!response.body) throw new Error("No response body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim();
              if (data === "[DONE]") break;
              try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices?.[0]?.delta?.content;
                if (delta) {
                  accumulated += delta;
                  updateLastMessage(accumulated);
                }
              } catch {
                // skip
              }
            }
          }
        }

        if (!accumulated) {
          updateLastMessage("I encountered an issue generating a response. Please try again.");
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Something went wrong";
        updateLastMessage(`Error: ${message}`);
        setError(message);
      } finally {
        setLoading(false);
      }

      return userMessage;
    },
    [store]
  );

  return {
    messages: store.messages as AIMessage[],
    settings: store.settings,
    isLoading: store.isLoading,
    error: store.error,
    sendMessage,
    clearMessages: store.clearMessages,
    setSettings: store.setSettings,
  };
}
