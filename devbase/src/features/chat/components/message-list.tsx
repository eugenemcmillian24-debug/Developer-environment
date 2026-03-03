"use client";

import { useEffect, useRef } from "react";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { CodeBlock } from "@/components/ui/code-block";
import type { AIMessage } from "@/types/ai";

interface MessageListProps {
  messages: AIMessage[];
  isLoading: boolean;
  onCopy?: () => void;
}

function parseMessageContent(content: string, onCopy?: () => void): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const codeBlockRegex = /```(\w+)?\s*(\S+\.\w+)?\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      const text = content.slice(lastIndex, match.index);
      parts.push(
        <span key={key++} className="whitespace-pre-wrap leading-relaxed">
          {text}
        </span>
      );
    }

    const lang = match[1] || "text";
    const filename = match[2];
    const code = match[3].trim();
    parts.push(
      <CodeBlock key={key++} code={code} lang={lang} filename={filename} className="my-2" onCopy={onCopy} />
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push(
      <span key={key++} className="whitespace-pre-wrap leading-relaxed">
        {content.slice(lastIndex)}
      </span>
    );
  }

  return parts;
}

export function MessageList({ messages, isLoading, onCopy }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-4xl mb-4">🤖</div>
          <div className="font-bold text-white text-lg mb-2">DevBase AI</div>
          <div className="text-muted text-sm font-mono">
            Ask me to build apps, generate code,<br />
            debug issues, or explain concepts.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex gap-3 animate-slide-in",
            message.role === "user" && "flex-row-reverse"
          )}
        >
          <div
            className={cn(
              "w-7 h-7 rounded flex items-center justify-center flex-shrink-0 mt-0.5",
              message.role === "user"
                ? "bg-accent2/10 text-accent2"
                : "bg-accent/10 text-accent"
            )}
          >
            {message.role === "user" ? <User size={14} /> : <Bot size={14} />}
          </div>

          <div
            className={cn(
              "flex-1 min-w-0 px-3 py-2.5 rounded-lg text-sm",
              message.role === "user"
                ? "bg-accent2/5 border border-accent2/10 text-text ml-8"
                : "bg-white/[0.02] border border-border text-text mr-8"
            )}
          >
            {parseMessageContent(message.content, onCopy)}
            {message.content === "" && message.role === "assistant" && (
              <span className="inline-block w-2 h-4 bg-accent animate-pulse ml-0.5" />
            )}
          </div>
        </div>
      ))}

      {isLoading && messages[messages.length - 1]?.content === "" && (
        <div className="flex gap-3">
          <div className="w-7 h-7 rounded bg-accent/10 flex items-center justify-center flex-shrink-0">
            <Bot size={14} className="text-accent" />
          </div>
          <div className="px-3 py-2.5 rounded-lg bg-white/[0.02] border border-border">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
