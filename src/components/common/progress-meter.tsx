import { cn } from "@/lib/utils";
import { PASTEL_CLASS, type PastelKey } from "@/lib/palette";
import { formatPercent } from "@/lib/format";

interface ProgressMeterProps {
  value: number;
  max?: number;
  color?: PastelKey;
  label?: string;
  /** Tampilkan nilai persen di kanan label. */
  showValue?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function ProgressMeter({
  value,
  max = 100,
  color = "sage",
  label,
  showValue = true,
  size = "md",
  className,
}: ProgressMeterProps) {
  const pct = max > 0 ? Math.min(Math.max((value / max) * 100, 0), 100) : 0;
  const c = PASTEL_CLASS[color];

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="mb-1.5 flex items-baseline justify-between gap-2 text-xs">
          {label && <span className="text-muted-foreground truncate">{label}</span>}
          {showValue && (
            <span className="tnum shrink-0 font-semibold">
              {formatPercent(Math.round(pct * 10) / 10, 1)}
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          "bg-muted w-full overflow-hidden rounded-full",
          size === "sm" ? "h-1.5" : "h-2",
        )}
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className={cn("h-full rounded-full transition-[width] duration-700", c.dot)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
