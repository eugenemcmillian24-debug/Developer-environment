import { cn } from "@/lib/utils/cn";

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  label?: string;
}

export function Progress({ value, max = 100, className, showLabel, label }: ProgressProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2 font-mono text-xs">
          <span className="text-muted">{label || "// PROGRESS"}</span>
          <span className="text-accent font-bold">{value} / {max} steps</span>
        </div>
      )}
      <div className="h-1 bg-border rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percent}%`,
            background: "linear-gradient(90deg, #00ff88, #00c6ff)",
            boxShadow: percent > 0 ? "0 0 10px rgba(0,255,136,0.5)" : "none",
          }}
        />
      </div>
    </div>
  );
}
