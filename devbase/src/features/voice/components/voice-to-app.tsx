"use client";

import { useState } from "react";
import { Wand2, Loader2, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import { VoiceRecorder } from "./voice-recorder";

interface VoiceToAppProps {
  onToast?: (msg: string) => void;
}

export function VoiceToApp({ onToast }: VoiceToAppProps) {
  const [transcript, setTranscript] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTranscript = (text: string) => {
    setTranscript(text);
  };

  const handleGenerate = async () => {
    if (!transcript.trim()) return;
    setIsGenerating(true);
    setGeneratedCode("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: transcript,
          type: "react",
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Generation failed");
      }

      const { code } = await response.json();
      setGeneratedCode(code);
      onToast?.("Code generated!");
    } catch (err) {
      onToast?.("Generation failed — check AI settings");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="font-mono text-xs text-muted mb-1">// VOICE TO APP</div>
        <div className="text-white font-bold">Describe your app with voice</div>
        <div className="text-muted text-xs mt-1">Speak your idea → AI generates code</div>
      </div>

      <VoiceRecorder onTranscript={handleTranscript} onToast={onToast} />

      {transcript && (
        <div className="bg-bg border border-border rounded-lg p-3">
          <div className="text-xs text-muted font-mono mb-1.5">// TRANSCRIPT</div>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className="w-full bg-transparent text-sm text-text outline-none resize-none leading-relaxed"
            rows={3}
          />
          <Button
            variant="glow"
            size="sm"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="mt-2 w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                Generating with AI...
              </>
            ) : (
              <>
                <Wand2 size={13} />
                Generate App Code
              </>
            )}
          </Button>
        </div>
      )}

      {generatedCode && (
        <div>
          <div className="text-xs text-muted font-mono mb-2">// GENERATED CODE</div>
          <CodeBlock
            code={generatedCode}
            lang="tsx"
            filename="App.tsx"
            onCopy={() => onToast?.("Code copied!")}
          />
        </div>
      )}
    </div>
  );
}
