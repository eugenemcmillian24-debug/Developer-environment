"use client";

import { Check } from "lucide-react";
import { CodeBlock } from "@/components/ui/code-block";
import { cn } from "@/lib/utils/cn";
import { useGuideStore } from "../store";
import type { Step } from "@/types/guide";

interface StepItemProps {
  step: Step;
  onCopy?: (msg: string) => void;
}

export function StepItem({ step, onCopy }: StepItemProps) {
  const { completedSteps, toggleStep } = useGuideStore();
  const isDone = !!completedSteps[step.id];

  return (
    <div
      className={cn(
        "flex gap-3 py-3 border-b border-white/[0.04] last:border-0 cursor-pointer transition-opacity duration-200",
        isDone && "opacity-60"
      )}
      onClick={() => toggleStep(step.id)}
    >
      <div
        className={cn(
          "w-5 h-5 border-2 rounded flex-shrink-0 mt-0.5 flex items-center justify-center transition-all duration-200",
          isDone
            ? "bg-accent border-accent shadow-glow"
            : "border-border"
        )}
      >
        {isDone && <Check size={11} className="text-bg font-bold" strokeWidth={3} />}
      </div>

      <div className="flex-1 min-w-0">
        <div className={cn("text-sm font-bold text-white mb-1", isDone && "line-through")}>
          {step.title}
        </div>
        <div className="text-xs text-muted leading-relaxed mb-2">
          {step.description}
        </div>

        {step.codeBlocks?.map((block, i) => (
          <CodeBlock
            key={i}
            code={block.code}
            lang={block.lang}
            filename={block.filename}
            className="mt-2"
            onCopy={() => onCopy?.("Command copied to clipboard")}
          />
        ))}

        {step.links && step.links.length > 0 && (
          <div className={cn(
            "grid gap-2 mt-2",
            step.links.length > 1 ? "grid-cols-2" : "grid-cols-1",
            "sm:grid-cols-2"
          )}>
            {step.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 px-3 py-2.5 bg-white/[0.03] border border-border rounded text-xs font-mono text-text hover:border-accent2 hover:text-accent2 hover:bg-accent2/5 transition-all duration-200"
              >
                <span className="text-base">{link.icon}</span>
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
