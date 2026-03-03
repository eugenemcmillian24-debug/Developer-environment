"use client";

import { useState } from "react";
import { ChevronDown, Zap, Globe } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { OPENROUTER_MODELS, GROQ_MODELS } from "@/lib/ai/types";
import type { AIProviderName } from "@/types/ai";

interface ModelSelectorProps {
  provider: AIProviderName;
  model: string;
  onProviderChange: (provider: AIProviderName) => void;
  onModelChange: (model: string) => void;
}

export function ModelSelector({ provider, model, onProviderChange, onModelChange }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const models = provider === "groq" ? GROQ_MODELS : OPENROUTER_MODELS;
  const currentModel = models.find((m) => m.id === model) || models[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-panel border border-border rounded font-mono text-xs text-text hover:border-accent2 hover:text-accent2 transition-all duration-200"
      >
        {provider === "groq" ? <Zap size={12} className="text-accent4" /> : <Globe size={12} className="text-accent2" />}
        <span className="max-w-[140px] truncate">{currentModel?.name || model}</span>
        <ChevronDown size={12} className={cn("transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 right-0 w-72 bg-panel border border-border rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="flex border-b border-border">
            {(["groq", "openrouter"] as AIProviderName[]).map((p) => (
              <button
                key={p}
                onClick={() => { onProviderChange(p); setIsOpen(false); }}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-2.5 font-mono text-xs transition-all",
                  provider === p
                    ? "bg-white/5 text-accent border-b-2 border-accent"
                    : "text-muted hover:text-text"
                )}
              >
                {p === "groq" ? <Zap size={11} /> : <Globe size={11} />}
                {p === "groq" ? "Groq" : "OpenRouter"}
              </button>
            ))}
          </div>

          <div className="max-h-64 overflow-y-auto">
            {models.map((m) => (
              <button
                key={m.id}
                onClick={() => { onModelChange(m.id); setIsOpen(false); }}
                className={cn(
                  "w-full text-left px-3 py-2.5 font-mono text-xs transition-colors border-b border-white/[0.04] last:border-0",
                  model === m.id
                    ? "bg-accent/5 text-accent"
                    : "text-text hover:bg-white/5 hover:text-white"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate">{m.name}</span>
                  <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                    {m.free && (
                      <span className="text-[9px] bg-accent/10 text-accent border border-accent/20 px-1 rounded">FREE</span>
                    )}
                    {m.supportsVision && (
                      <span className="text-[9px] bg-accent2/10 text-accent2 border border-accent2/20 px-1 rounded">VISION</span>
                    )}
                  </div>
                </div>
                {m.description && (
                  <div className="text-muted text-[10px] mt-0.5">{m.description}</div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
