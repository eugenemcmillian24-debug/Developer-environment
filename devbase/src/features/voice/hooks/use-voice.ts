"use client";

import { useState, useRef, useCallback } from "react";

interface VoiceState {
  isRecording: boolean;
  isTranscribing: boolean;
  transcript: string;
  error: string | null;
}

export function useVoice() {
  const [state, setState] = useState<VoiceState>({
    isRecording: false,
    isTranscribing: false,
    transcript: "",
    error: null,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, error: null, transcript: "" }));
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.start(100);
      setState((prev) => ({ ...prev, isRecording: true }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : "Microphone access denied",
      }));
    }
  }, []);

  const stopRecording = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const mediaRecorder = mediaRecorderRef.current;
      if (!mediaRecorder || mediaRecorder.state === "inactive") {
        resolve(null);
        return;
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        mediaRecorder.stream.getTracks().forEach((track) => track.stop());
        setState((prev) => ({ ...prev, isRecording: false }));
        resolve(blob);
      };

      mediaRecorder.stop();
    });
  }, []);

  const transcribeAudio = useCallback(async (audioBlob: Blob): Promise<string> => {
    setState((prev) => ({ ...prev, isTranscribing: true, error: null }));

    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve((reader.result as string).split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(audioBlob);
      });

      const response = await fetch("/api/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audioBase64: base64, mimeType: audioBlob.type }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Transcription failed");
      }

      const { transcript } = await response.json();
      setState((prev) => ({ ...prev, transcript, isTranscribing: false }));
      return transcript;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Transcription failed";
      setState((prev) => ({ ...prev, error: message, isTranscribing: false }));
      throw err;
    }
  }, []);

  const recordAndTranscribe = useCallback(async (): Promise<string> => {
    await startRecording();
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const blob = await stopRecording();
          if (!blob) throw new Error("No audio recorded");
          const transcript = await transcribeAudio(blob);
          resolve(transcript);
        } catch (err) {
          reject(err);
        }
      }, 5000);
    });
  }, [startRecording, stopRecording, transcribeAudio]);

  return {
    ...state,
    startRecording,
    stopRecording,
    transcribeAudio,
    recordAndTranscribe,
  };
}
