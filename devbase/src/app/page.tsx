"use client";

import { useState } from "react";
import { BookOpen, MessageSquare, Mic, FolderPlus, Zap, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { GridBackground } from "@/components/layout/grid-background";
import { Progress } from "@/components/ui/progress";
import { ToastContainer } from "@/components/ui/toast";
import { PhaseSection } from "@/features/guide/components/phase-section";
import { ChatInterface } from "@/features/chat/components/chat-interface";
import { VoiceToApp } from "@/features/voice/components/voice-to-app";
import { ProjectGenerator } from "@/features/scaffold/components/project-generator";
import { useGuideStore } from "@/features/guide/store";
import { useToast } from "@/hooks/use-toast";
import { PHASES, STACK_REFERENCE } from "@/features/guide/data/phases";
import { APP_NAME, APP_VERSION } from "@/lib/constants";

type Tab = "guide" | "chat" | "voice" | "scaffold";

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: "guide", label: "Guide", icon: BookOpen },
  { id: "chat", label: "AI Chat", icon: MessageSquare },
  { id: "voice", label: "Voice", icon: Mic },
  { id: "scaffold", label: "Scaffold", icon: FolderPlus },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("guide");
  const { getProgress, isComplete } = useGuideStore();
  const { toasts, showToast, dismissToast } = useToast();
  const progress = getProgress();

  return (
    <div className="relative min-h-screen bg-bg">
      <GridBackground />

      <div className="relative z-10 max-w-3xl mx-auto px-4 pb-20 pt-0">
        <header className="text-center pt-10 pb-8 animate-fade-down">
          <div className="inline-block font-mono text-[11px] tracking-[3px] text-accent bg-accent/[0.08] border border-accent/20 px-3.5 py-1.5 rounded-sm mb-5 uppercase">
            // {APP_NAME} v{APP_VERSION}
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight mb-3">
            Your{" "}
            <span className="text-accent relative">
              AI-Powered
              <span className="absolute bottom-0.5 left-0 right-0 h-[3px] bg-accent opacity-40 rounded" />
            </span>
            <br />
            Dev Environment
          </h1>
          <p className="text-muted font-mono text-sm">
            android · web · mobile · ai · unlimited apps · 100% free
          </p>
        </header>

        <div className="mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <Progress
            value={progress.done}
            max={progress.total}
            showLabel
            label="// SETUP PROGRESS"
          />
        </div>

        {isComplete() && (
          <div className="mb-6 text-center p-8 bg-accent/5 border border-accent/20 rounded-lg animate-fade-up">
            <h2 className="text-3xl font-extrabold text-accent mb-2">🚀 Setup Complete!</h2>
            <p className="text-muted font-mono text-xs">
              your dev environment is ready.<br />
              go build something amazing with AI.
            </p>
          </div>
        )}

        <div className="flex gap-1 bg-panel border border-border rounded-lg p-1 mb-6 animate-fade-up" style={{ animationDelay: "0.15s" }}>
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 rounded font-mono text-xs transition-all duration-200",
                  activeTab === tab.id
                    ? "bg-accent/10 text-accent border border-accent/20"
                    : "text-muted hover:text-text"
                )}
              >
                <Icon size={13} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {activeTab === "guide" && (
          <div className="space-y-4">
            {PHASES.map((phase) => (
              <PhaseSection
                key={phase.id}
                phase={phase}
                onCopy={(msg) => showToast(msg)}
              />
            ))}

            <div className="border border-border rounded-lg overflow-hidden bg-panel mt-6">
              <button
                className="w-full flex items-center gap-3 px-4 py-4 text-left bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                style={{ borderLeft: "3px solid rgba(255,255,255,0.1)" }}
                onClick={() => {
                  const el = document.getElementById("stack-ref");
                  if (el) el.style.display = el.style.display === "none" ? "block" : "none";
                }}
              >
                <div className="w-7 h-7 rounded flex items-center justify-center bg-white/5 text-sm">⚡</div>
                <div className="flex-1 font-bold text-[15px] text-white">Your Full Stack Reference</div>
                <div className="font-mono text-[10px] text-muted">always free</div>
              </button>
              <div id="stack-ref" style={{ display: "none" }}>
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-1.5 font-mono text-[11px]">
                    <div className="px-2.5 py-2 bg-white/[0.02] border border-border rounded text-muted text-[10px] uppercase tracking-wider">Layer</div>
                    <div className="px-2.5 py-2 bg-white/[0.02] border border-border rounded text-muted text-[10px] uppercase tracking-wider">Tool</div>
                    <div className="px-2.5 py-2 bg-white/[0.02] border border-border rounded text-muted text-[10px] uppercase tracking-wider">Purpose</div>
                    {STACK_REFERENCE.map((row) => (
                      <>
                        <div key={`${row.layer}-l`} className="px-2.5 py-2 bg-white/[0.02] border border-border rounded text-accent4">{row.layer}</div>
                        <div key={`${row.layer}-t`} className="px-2.5 py-2 bg-white/[0.02] border border-border rounded font-bold text-white">{row.tool}</div>
                        <div key={`${row.layer}-d`} className="px-2.5 py-2 bg-white/[0.02] border border-border rounded text-muted">{row.purpose}</div>
                      </>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "chat" && (
          <div className="h-[620px]">
            <ChatInterface
              onCopy={() => showToast("Code copied to clipboard")}
              onToast={(msg) => showToast(msg)}
            />
          </div>
        )}

        {activeTab === "voice" && (
          <div className="bg-panel border border-border rounded-lg p-5">
            <VoiceToApp onToast={(msg) => showToast(msg)} />
          </div>
        )}

        {activeTab === "scaffold" && (
          <div className="bg-panel border border-border rounded-lg p-5">
            <ProjectGenerator onToast={(msg) => showToast(msg)} />
          </div>
        )}

        <div className="mt-8 flex items-center justify-center gap-1 font-mono text-[10px] text-muted animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <Zap size={11} className="text-accent" />
          <span>Powered by</span>
          <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-accent2 hover:underline flex items-center gap-0.5">
            OpenRouter <ExternalLink size={9} />
          </a>
          <span>+</span>
          <a href="https://groq.com" target="_blank" rel="noopener noreferrer" className="text-accent4 hover:underline flex items-center gap-0.5">
            Groq <ExternalLink size={9} />
          </a>
        </div>
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
