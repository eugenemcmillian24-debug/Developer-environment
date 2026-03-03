"use client";

import { Mic, MicOff, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useVoice } from "../hooks/use-voice";

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  onToast?: (msg: string) => void;
}

export function VoiceRecorder({ onTranscript, onToast }: VoiceRecorderProps) {
  const { isRecording, isTranscribing, error, startRecording, stopRecording, transcribeAudio } = useVoice();

  const handleToggle = async () => {
    if (isRecording) {
      const blob = await stopRecording();
      if (blob) {
        try {
          const transcript = await transcribeAudio(blob);
          if (transcript.trim()) {
            onTranscript(transcript.trim());
            onToast?.("Transcription complete!");
          }
        } catch (err) {
          onToast?.("Transcription failed");
        }
      }
    } else {
      await startRecording();
      onToast?.("Listening... click again to stop & transcribe");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <button
        onClick={handleToggle}
        disabled={isTranscribing}
        className={cn(
          "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300",
          isRecording
            ? "bg-accent3/20 border-2 border-accent3 shadow-glow-red animate-pulse"
            : isTranscribing
            ? "bg-accent4/10 border-2 border-accent4/30 opacity-70"
            : "bg-accent/10 border-2 border-accent/30 hover:bg-accent/20 hover:border-accent shadow-glow"
        )}
      >
        {isTranscribing ? (
          <Loader2 size={32} className="text-accent4 animate-spin" />
        ) : isRecording ? (
          <MicOff size={32} className="text-accent3" />
        ) : (
          <Mic size={32} className="text-accent" />
        )}
      </button>

      <div className="font-mono text-sm text-center">
        {isTranscribing ? (
          <span className="text-accent4">Transcribing with Groq Whisper...</span>
        ) : isRecording ? (
          <span className="text-accent3 animate-pulse">Recording — click to stop</span>
        ) : (
          <span className="text-muted">Click to start voice input</span>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-accent3 font-mono text-xs">
          <AlertCircle size={13} />
          {error}
        </div>
      )}
    </div>
  );
}
