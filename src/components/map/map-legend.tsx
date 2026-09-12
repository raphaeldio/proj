import type { RegionStatus } from "@/data/types";
import type { MapMode } from "./indonesia-map";
import {
  NEEDS_SCALE_STOPS,
  PASTEL_CLASS,
  REGION_STATUS_COLOR,
  REGION_STATUS_LABEL,
} from "@/lib/palette";
import { cn } from "@/lib/utils";

const STATUS_ORDER: RegionStatus[] = ["aktif", "perintis", "prioritas", "belum"];

interface MapLegendProps {
  mode: MapMode;
  counts: Record<RegionStatus, number>;
  activeStatuses: Set<RegionStatus>;
  onToggle: (status: RegionStatus) => void;
}

/**
 * Legenda yang sekaligus jadi filter. Pada mode Indeks Kebutuhan legenda
 * hanya menjelaskan skala, karena skala kontinu tidak masuk akal difilter.
 */
export function MapLegend({
  mode,
  counts,
  activeStatuses,
  onToggle,
}: MapLegendProps) {
  if (mode === "needs") {
    return (
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="text-muted-foreground text-xs font-medium">
          Indeks kebutuhan
        </span>
        {NEEDS_SCALE_STOPS.map((s) => (
          <span key={s.label} className="flex items-center gap-1.5 text-xs">
            <span
              className="size-3 rounded-[4px]"
              style={{ background: s.color }}
              aria-hidden
            />
            {s.label}
          </span>
        ))}
      </div>
    );
  }

  const noneActive = activeStatuses.size === 0;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {STATUS_ORDER.map((status) => {
        const color = REGION_STATUS_COLOR[status];
        const c = PASTEL_CLASS[color];
        const on = noneActive || activeStatuses.has(status);

        return (
          <button
            key={status}
            type="button"
            onClick={() => onToggle(status)}
            aria-pressed={on}
            className={cn(
              "focus-visible:ring-ring inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition focus-visible:ring-2 focus-visible:outline-none",
              on
                ? cn(c.soft, c.ink, c.border)
                : "text-muted-foreground border-border opacity-50",
            )}
          >
            <span className={cn("size-2 rounded-full", c.dot)} aria-hidden />
            {REGION_STATUS_LABEL[status]}
            <span className="tnum opacity-70">{counts[status]}</span>
          </button>
        );
      })}
    </div>
  );
}
