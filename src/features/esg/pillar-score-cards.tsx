import { Landmark, Leaf, Users } from "lucide-react";

import type { EsgPillar, EsgPillarKey } from "@/data/types";
import { Card } from "@/components/ui/card";
import { ProgressMeter } from "@/components/common/progress-meter";
import { StatusBadge } from "@/components/common/status-badge";
import { ESG_PILLAR_COLOR, ESG_PILLAR_LABEL, PASTEL_CLASS } from "@/lib/palette";
import { cn } from "@/lib/utils";

const PILLAR_ICON = {
  lingkungan: Leaf,
  sosial: Users,
  tata_kelola: Landmark,
} as const satisfies Record<EsgPillarKey, typeof Leaf>;

export function PillarScoreCards({ pillars }: { pillars: EsgPillar[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {pillars.map((p) => {
        const Icon = PILLAR_ICON[p.pillar];
        const color = ESG_PILLAR_COLOR[p.pillar];
        const c = PASTEL_CLASS[color];
        const achieved = p.indicators.filter(
          (i) => i.status === "tercapai",
        ).length;

        return (
          <Card key={p.pillar} className="gap-0 p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "grid size-9 place-items-center rounded-xl border",
                    c.soft,
                    c.ink,
                    c.border,
                  )}
                >
                  <Icon className="size-4.5" strokeWidth={1.75} />
                </span>
                <div>
                  <p className="font-semibold">{ESG_PILLAR_LABEL[p.pillar]}</p>
                  <p className="text-muted-foreground text-xs">
                    {achieved} dari {p.indicators.length} indikator tercapai
                  </p>
                </div>
              </div>
              <StatusBadge color={color} dot={false}>
                {p.grade}
              </StatusBadge>
            </div>

            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="font-display tnum text-3xl leading-none font-semibold">
                {p.score}
              </span>
              <span className="text-muted-foreground text-sm">
                / 100 · target {p.targetScore}
              </span>
            </div>

            <ProgressMeter
              className="mt-3"
              value={p.score}
              max={100}
              color={color}
              showValue={false}
            />

            <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
              {p.summary}
            </p>
          </Card>
        );
      })}
    </div>
  );
}
