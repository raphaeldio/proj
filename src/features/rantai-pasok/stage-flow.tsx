import { ChevronRight } from "lucide-react";

import type { StageKey, SupplyStage } from "@/data/types";
import { SectionCard } from "@/components/common/section-card";
import { ProgressMeter } from "@/components/common/progress-meter";
import { StatusBadge } from "@/components/common/status-badge";
import { SUPPLY_STATUS_COLOR, SUPPLY_STATUS_LABEL } from "@/lib/palette";
import { formatNumber, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

interface StageFlowProps {
  stages: SupplyStage[];
  selected: StageKey | null;
  onSelect: (key: StageKey | null) => void;
}

/**
 * Alur tujuh tahap. Klik sebuah tahap untuk menyaring tabel batch di
 * bawahnya — ini cara tercepat menjawab "apa yang sedang tertahan di mana".
 */
export function StageFlow({ stages, selected, onSelect }: StageFlowProps) {
  return (
    <SectionCard
      title="Alur Rantai Pasok"
      description="Dari petani sampai titik layan. Klik sebuah tahap untuk menyaring batch."
      bodyClassName="p-5 pb-4"
    >
      <div className="-mx-1 overflow-x-auto px-1 pb-2">
        <ol className="flex min-w-max items-stretch gap-1">
          {stages.map((s, i) => {
            const active = selected === s.key;
            const color = SUPPLY_STATUS_COLOR[s.status];

            return (
              <li key={s.key} className="flex items-center">
                <button
                  type="button"
                  onClick={() => onSelect(active ? null : s.key)}
                  aria-pressed={active}
                  className={cn(
                    "w-44 rounded-xl border p-3 text-left transition",
                    active
                      ? "border-primary bg-accent/60"
                      : "hover:bg-muted/60",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm leading-tight font-semibold">
                      {s.name}
                    </span>
                    <span
                      className={cn(
                        "mt-1 size-2 shrink-0 rounded-full",
                        color === "sage" && "bg-p-sage",
                        color === "butter" && "bg-p-butter",
                        color === "rose" && "bg-p-rose",
                      )}
                      aria-label={SUPPLY_STATUS_LABEL[s.status]}
                    />
                  </div>

                  <dl className="text-muted-foreground mt-2.5 space-y-1 text-[11px]">
                    <div className="flex justify-between gap-2">
                      <dt>Throughput</dt>
                      <dd className="tnum text-foreground font-medium">
                        {formatNumber(s.throughputKg)} kg
                      </dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt>Lead time</dt>
                      <dd className="tnum text-foreground font-medium">
                        {s.leadTimeDays} hari
                      </dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt>Rendemen</dt>
                      <dd className="tnum text-foreground font-medium">
                        {formatPercent(s.yieldPct, 1)}
                      </dd>
                    </div>
                  </dl>

                  <ProgressMeter
                    className="mt-2.5"
                    label="Kapasitas"
                    value={s.capacityPct}
                    color={color}
                    size="sm"
                  />
                </button>

                {i < stages.length - 1 && (
                  <ChevronRight
                    className="text-muted-foreground mx-0.5 size-4 shrink-0"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 border-t pt-3">
        {(["normal", "perhatian", "kritis"] as const).map((s) => (
          <StatusBadge key={s} color={SUPPLY_STATUS_COLOR[s]}>
            {SUPPLY_STATUS_LABEL[s]}
          </StatusBadge>
        ))}
      </div>
    </SectionCard>
  );
}
