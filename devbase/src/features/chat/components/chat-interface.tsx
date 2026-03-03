"use client";

import { useState, useRef, type KeyboardEvent } from "react";
import { Send, Trash2, Mic, MicOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { MessageList } from "./message-list";
import { ModelSelector } from "./model-selector";
import { useChat } from "../hooks/use-chat";
import { useVoice } from "@/features/voice/hooks/use-voice";
import type { AIProviderName } from "@/types/ai";

interface ChatInterfaceProps {
  onCopy?: () => void;
  onToast?: (msg: string) => void;
}

export function ChatInterface({ onCopy, onToast }: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { messages, settings, isLoading, sendMessage, clearMessages, setSettings } = useChat();
  const { isRecording, isTranscribing, startRecording, stopRecording, transcribeAudio } = useVoice();

  const handleSend = async () => {
    const content = input.trim();
    if (!content || isLoading) return;
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    await sendMessage(content);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  };

  const handleVoiceToggle = async () => {
    if (isRecording) {
      const blob = await stopRecording();
      if (blob) {
        try {
          const transcript = await transcribeAudio(blob);
          if (transcript) {
            setInput((prev) => prev + (prev ? " " : "") + transcript);
            textareaRef.current?.focus();
          }
        } catch {
          onToast?.("Transcription failed — check Groq API key");
        }
      }
    } else {
      await startRecording();
      onToast?.("Recording... click mic again to stop");
    }
  };

  const handleClear = () => {
    clearMessages();
    onToast?.("Chat cleared");
  };

  return (
    <div className="flex flex-col h-full bg-panel rounded-lg border border-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <span className="text-accent font-mono text-xs">// AI CHAT</span>
          {isLoading && <Loader2 size={12} className="text-accent animate-spin" />}
        </div>
        <div className="flex items-center gap-2">
          <ModelSelector
            provider={settings.provider}
            model={settings.model}
            onProviderChange={(p: AIProviderName) => setSettings({ provider: p })}
            onModelChange={(m: string) => setSettings({ model: m })}
          />
          <Button variant="ghost" size="sm" onClick={handleClear} title="Clear chat">
            <Trash2 size={13} />
          </Button>
        </div>
      </div>

      <MessageList
        messages={messages}
        isLoading={isLoading}
        onCopy={() => onCopy?.()}
      />

      <div className="p-3 border-t border-border">
        <div className="flex items-end gap-2 bg-bg border border-border rounded-lg px-3 py-2 focus-within:border-accent2 transition-colors">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder="Ask me to build something... (Enter to send, Shift+Enter for newline)"
            className="flex-1 bg-transparent text-sm text-text placeholder-muted resize-none outline-none font-sans min-h-[36px] max-h-[120px] py-1 leading-relaxed"
            rows={1}
            disabled={isLoading}
          />
          <div className="flex gap-1.5 flex-shrink-0 pb-1">
            <button
              onClick={handleVoiceToggle}
              disabled={isTranscribing}
              className={cn(
                "p-1.5 rounded transition-all duration-200",
                isRecording
                  ? "text-accent3 bg-accent3/10 animate-pulse"
                  : isTranscribing
                  ? "text-accent4 opacity-50"
                  : "text-muted hover:text-accent2"
              )}
              title={isRecording ? "Stop recording" : "Voice input"}
            >
              {isRecording ? <MicOff size={16} /> : isTranscribing ? <Loader2 size={16} className="animate-spin" /> : <Mic size={16} />}
            </button>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="p-1.5 rounded text-muted hover:text-accent disabled:opacity-30 transition-colors"
              title="Send message"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
        <div className="mt-1.5 text-[10px] text-muted font-mono text-center">
          Powered by {settings.provider === "groq" ? "Groq" : "OpenRouter"} · {settings.model.split("/").pop()?.split(":")[0]}
        </div>
      </div>
    </div>
  );
}
