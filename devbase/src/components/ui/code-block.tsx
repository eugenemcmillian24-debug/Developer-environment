"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface CodeBlockProps {
  code: string;
  lang?: string;
  filename?: string;
  className?: string;
  onCopy?: () => void;
}

export function CodeBlock({ code, lang = "bash", filename, className, onCopy }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    onCopy?.();
    setTimeout(() => setCopied(false), 2000);
  };

  const label = filename || lang.toUpperCase();

  return (
    <div className={cn("rounded-md border border-border overflow-hidden bg-[#0a0e14]", className)}>
      <div className="flex items-center justify-between px-3 py-2 bg-white/[0.03] border-b border-border">
        <span className="font-mono text-[10px] text-muted tracking-wider uppercase">{label}</span>
        <button
          onClick={handleCopy}
          className={cn(
            "flex items-center gap-1.5 font-mono text-[10px] tracking-wider px-2 py-1 rounded border transition-all duration-200",
            copied
              ? "text-accent border-accent/20 bg-accent/5"
              : "text-accent2 border-accent2/20 hover:bg-accent2/10 hover:shadow-glow-cyan"
          )}
        >
          {copied ? <Check size={10} /> : <Copy size={10} />}
          {copied ? "COPIED!" : "COPY"}
        </button>
      </div>
      <pre className="p-3.5 font-mono text-[12px] leading-relaxed overflow-x-auto text-[#8be9fd] whitespace-pre-wrap break-words">
        {code}
      </pre>
    </div>
  );
}
