"use client";

import { cn } from "@/lib/utils/cn";

interface ToastItem {
  id: string;
  message: string;
  type?: "success" | "error" | "info";
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

const typeStyles = {
  success: "border-accent text-accent shadow-glow",
  error: "border-accent3 text-accent3 shadow-glow-red",
  info: "border-accent2 text-accent2 shadow-glow-cyan",
};

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 right-5 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          onClick={() => onDismiss(toast.id)}
          className={cn(
            "bg-panel border rounded-lg px-4 py-3 font-mono text-xs cursor-pointer",
            "animate-slide-in max-w-[260px]",
            typeStyles[toast.type || "success"]
          )}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
