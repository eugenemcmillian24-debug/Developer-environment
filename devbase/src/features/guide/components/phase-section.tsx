"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useGuideStore } from "../store";
import { StepItem } from "./step-item";
import { PHASE_COLORS } from "@/lib/constants";
import type { Phase } from "@/types/guide";

interface PhaseSectionProps {
  phase: Phase;
  onCopy?: (msg: string) => void;
}

export function PhaseSection({ phase, onCopy }: PhaseSectionProps) {
  const { openPhases, togglePhase } = useGuideStore();
  const isOpen = !!openPhases[phase.id];
  const colors = PHASE_COLORS[phase.id as keyof typeof PHASE_COLORS];

  return (
    <div
      className={cn(
        "border border-border rounded-lg overflow-hidden bg-panel transition-all duration-200",
        "animate-fade-up"
      )}
      style={{ animationDelay: `${phase.id * 0.05}s` }}
    >
      <button
        onClick={() => togglePhase(phase.id)}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-4 text-left transition-colors duration-200",
          "bg-white/[0.02] hover:bg-white/[0.04]",
          isOpen && "border-b border-border"
        )}
        style={{ borderLeft: `3px solid ${colors.accent}` }}
      >
        <div
          className="w-7 h-7 rounded flex items-center justify-center font-mono text-[11px] font-bold flex-shrink-0"
          style={{ background: colors.bg, color: colors.accent }}
        >
          {phase.num}
        </div>
        <div className="flex-1 font-bold text-[15px] text-white">{phase.title}</div>
        <div className="font-mono text-[10px] text-muted">{phase.duration}</div>
        <ChevronDown
          size={16}
          className={cn("text-muted transition-transform duration-300 flex-shrink-0", isOpen && "rotate-180")}
        />
      </button>

      {isOpen && (
        <div className="px-4 py-1">
          {phase.steps.map((step) => (
            <StepItem key={step.id} step={step} onCopy={onCopy} />
          ))}
        </div>
      )}
    </div>
  );
}
