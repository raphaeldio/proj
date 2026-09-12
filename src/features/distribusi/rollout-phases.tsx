import { CircleDashed, CircleDot, CircleCheck } from "lucide-react";

import type { RolloutPhase } from "@/data/types";
import { SectionCard } from "@/components/common/section-card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/common/status-badge";
import { ProgressMeter } from "@/components/common/progress-meter";
import { useRegions, useRolloutPhases } from "@/hooks/use-data";
import { formatNumber } from "@/lib/format";
import type { PastelKey } from "@/lib/palette";

const PHASE_META: Record<
  RolloutPhase["status"],
  { label: string; color: PastelKey; icon: typeof CircleDot }
> = {
  berjalan: { label: "Berjalan", color: "sage", icon: CircleDot },
  persiapan: { label: "Persiapan", color: "butter", icon: CircleDashed },
  rencana: { label: "Rencana", color: "slate", icon: CircleCheck },
};

/**
 * Rencana rollout bertahap. Inti strategi produk ini: masuk lebih dulu ke
 * wilayah dengan indeks kebutuhan tertinggi, baru meluas.
 */
export function RolloutPhases() {
  const { data: phases, isLoading } = useRolloutPhases();
  const { data: regions } = useRegions();

  if (isLoading || !phases) {
    return (
      <div className="grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {phases.map((p) => {
        const meta = PHASE_META[p.status];
        const Icon = meta.icon;
        const inPhase = (regions ?? []).filter((r) => p.regionIds.includes(r.id));
        const outlets = inPhase.reduce((a, r) => a + r.outlets, 0);
        const beneficiaries = inPhase.reduce(
          (a, r) => a + Math.round(r.unitsSoldYtd / 135),
          0,
        );

        return (
          <SectionCard
            key={p.phase}
            title={p.name}
            description={p.period}
            action={
              <StatusBadge color={meta.color} dot={false}>
                <Icon className="size-3" strokeWidth={2} />
                {meta.label}
              </StatusBadge>
            }
          >
            <p className="text-muted-foreground text-sm leading-relaxed">
              {p.objective}
            </p>

            <div className="mt-5 space-y-4">
              <ProgressMeter
                label={`Titik layan — ${formatNumber(outlets)} dari ${formatNumber(p.targetOutlets)}`}
                value={outlets}
                max={p.targetOutlets}
                color={meta.color}
                showValue={false}
              />
              <ProgressMeter
                label={`Penerima manfaat — ${formatNumber(beneficiaries)} dari ${formatNumber(p.targetBeneficiaries)}`}
                value={beneficiaries}
                max={p.targetBeneficiaries}
                color={meta.color}
                showValue={false}
              />
            </div>

            <div className="mt-5 border-t pt-4">
              <p className="text-muted-foreground mb-2 text-xs font-medium">
                {inPhase.length} provinsi
              </p>
              <p className="text-sm leading-relaxed">
                {inPhase.map((r) => r.name).join(", ")}
              </p>
            </div>
          </SectionCard>
        );
      })}
    </div>
  );
}
