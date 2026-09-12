import { AlertTriangle, Info, OctagonAlert } from "lucide-react";

import type { SupplyAlert, WarehouseStock } from "@/data/types";
import { SectionCard } from "@/components/common/section-card";
import { ProgressMeter } from "@/components/common/progress-meter";
import { StatusBadge } from "@/components/common/status-badge";
import { STAGE_LABEL } from "@/data/supply-chain";
import {
  ALERT_SEVERITY_COLOR,
  PASTEL_CLASS,
  SUPPLY_STATUS_COLOR,
  SUPPLY_STATUS_LABEL,
} from "@/lib/palette";
import { formatCompact, formatRelative } from "@/lib/format";
import { cn } from "@/lib/utils";

const SEVERITY_ORDER = { kritis: 0, peringatan: 1, info: 2 } as const;
const SEVERITY_ICON = {
  kritis: OctagonAlert,
  peringatan: AlertTriangle,
  info: Info,
} as const;

export function AlertsPanel({ alerts }: { alerts: SupplyAlert[] }) {
  const sorted = [...alerts].sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity],
  );

  return (
    <SectionCard
      title="Peringatan Aktif"
      description="Diurutkan dari tingkat keparahan tertinggi"
    >
      <ul className="space-y-3">
        {sorted.map((a) => {
          const color = ALERT_SEVERITY_COLOR[a.severity];
          const c = PASTEL_CLASS[color];
          const Icon = SEVERITY_ICON[a.severity];

          return (
            <li key={a.id} className={cn("rounded-xl border p-3.5", c.border)}>
              <div className="flex items-start gap-2.5">
                <span
                  className={cn(
                    "grid size-7 shrink-0 place-items-center rounded-lg",
                    c.soft,
                    c.ink,
                  )}
                >
                  <Icon className="size-4" strokeWidth={1.75} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-snug font-semibold">{a.title}</p>
                  <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                    {a.message}
                  </p>
                  <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
                    <span>{STAGE_LABEL[a.stage]}</span>
                    {a.batchId && (
                      <span className="font-mono">{a.batchId}</span>
                    )}
                    <span>{formatRelative(a.createdAt)}</span>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </SectionCard>
  );
}

export function InventoryCard({
  warehouses,
  regionNameById,
}: {
  warehouses: WarehouseStock[];
  regionNameById: Map<string, string>;
}) {
  const sorted = [...warehouses].sort((a, b) => a.daysOfCover - b.daysOfCover);

  return (
    <SectionCard
      title="Stok Gudang Regional"
      description="Gudang dengan hari persediaan paling tipis ditampilkan lebih dulu"
    >
      <ul className="space-y-4">
        {sorted.map((w) => (
          <li key={w.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-medium">{w.name}</p>
                <p className="text-muted-foreground text-xs">
                  {regionNameById.get(w.regionId) ?? w.regionId}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="tnum text-sm font-semibold">
                  {w.daysOfCover} hari
                </span>
                <StatusBadge color={SUPPLY_STATUS_COLOR[w.status]}>
                  {SUPPLY_STATUS_LABEL[w.status]}
                </StatusBadge>
              </div>
            </div>
            <ProgressMeter
              className="mt-2"
              value={w.stockUnits}
              max={w.capacityUnits}
              color={SUPPLY_STATUS_COLOR[w.status]}
              size="sm"
              showValue={false}
              label={`${formatCompact(w.stockUnits)} dari ${formatCompact(w.capacityUnits)} sachet`}
            />
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
