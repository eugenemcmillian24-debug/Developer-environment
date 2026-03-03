"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS, MAX_CHAT_HISTORY } from "@/lib/constants";
import { DEFAULT_MODEL_GROQ, DEFAULT_MODEL_OPENROUTER } from "@/lib/ai/types";
import type { AIMessage, AIProviderName } from "@/types/ai";

interface AISettings {
  provider: AIProviderName;
  model: string;
  systemPrompt: string;
}

interface ChatState {
  messages: AIMessage[];
  settings: AISettings;
  isLoading: boolean;
  error: string | null;
  addMessage: (message: Omit<AIMessage, "id" | "timestamp">) => AIMessage;
  updateLastMessage: (content: string) => void;
  clearMessages: () => void;
  setSettings: (settings: Partial<AISettings>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      settings: {
        provider: "groq",
        model: DEFAULT_MODEL_GROQ,
        systemPrompt:
          "You are DevBase AI — an expert full-stack developer assistant. Help users build web, mobile, and backend applications. Provide clean, working code with explanations. Focus on React, Next.js, Expo, Node.js, and TypeScript.",
      },
      isLoading: false,
      error: null,

      addMessage: (message) => {
        const newMessage: AIMessage = {
          ...message,
          id: `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          timestamp: Date.now(),
        };
        set((state) => ({
          messages: [...state.messages.slice(-MAX_CHAT_HISTORY + 1), newMessage],
        }));
        return newMessage;
      },

      updateLastMessage: (content) =>
        set((state) => {
          const messages = [...state.messages];
          const last = messages[messages.length - 1];
          if (last && last.role === "assistant") {
            messages[messages.length - 1] = { ...last, content };
          }
          return { messages };
        }),

      clearMessages: () => set({ messages: [] }),

      setSettings: (settings) =>
        set((state) => {
          const updated = { ...state.settings, ...settings };
          if (settings.provider === "openrouter" && state.settings.provider === "groq") {
            updated.model = DEFAULT_MODEL_OPENROUTER;
          } else if (settings.provider === "groq" && state.settings.provider === "openrouter") {
            updated.model = DEFAULT_MODEL_GROQ;
          }
          return { settings: updated };
        }),

      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    {
      name: STORAGE_KEYS.CHAT_HISTORY,
      partialize: (state) => ({
        messages: state.messages.slice(-20),
        settings: state.settings,
      }),
    }
  )
);
