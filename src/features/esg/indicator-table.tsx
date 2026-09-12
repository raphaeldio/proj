import { useState } from "react";

import type { EsgPillar, EsgFramework } from "@/data/types";
import { SectionCard } from "@/components/common/section-card";
import { StatusBadge } from "@/components/common/status-badge";
import { ProgressMeter } from "@/components/common/progress-meter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ESG_PILLAR_COLOR,
  ESG_PILLAR_LABEL,
  INDICATOR_STATUS_COLOR,
} from "@/lib/palette";
import { formatNumber } from "@/lib/format";

const FRAMEWORKS: (EsgFramework | "semua")[] = [
  "semua",
  "GRI",
  "SDG",
  "OJK",
  "ISSB",
];

const STATUS_LABEL = {
  tercapai: "Tercapai",
  berjalan: "Berjalan",
  tertinggal: "Tertinggal",
} as const;

export function IndicatorTable({ pillars }: { pillars: EsgPillar[] }) {
  const [framework, setFramework] = useState<string>("semua");

  const rows = pillars.flatMap((p) =>
    p.indicators
      .filter((i) => framework === "semua" || i.framework === framework)
      .map((i) => ({ ...i, pillar: p.pillar })),
  );

  return (
    <SectionCard
      title="Indikator Lengkap"
      description="Nilai terkini dibanding target, dikelompokkan per kerangka pelaporan"
      bodyClassName="p-0"
      action={
        <Select value={framework} onValueChange={setFramework}>
          <SelectTrigger className="h-8 w-40 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FRAMEWORKS.map((f) => (
              <SelectItem key={f} value={f}>
                {f === "semua" ? "Semua kerangka" : f}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
    >
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-14">Kode</TableHead>
              <TableHead className="min-w-56">Indikator</TableHead>
              <TableHead>Pilar</TableHead>
              <TableHead className="text-right">Nilai</TableHead>
              <TableHead className="text-right">Target</TableHead>
              <TableHead className="w-32">Progres</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((i) => {
              // Untuk indikator yang lebih kecil lebih baik, progres dibalik
              // supaya bar tetap terbaca "makin penuh makin baik".
              const progress = i.higherIsBetter
                ? i.target > 0
                  ? (i.value / i.target) * 100
                  : 0
                : i.value <= i.target
                  ? 100
                  : Math.max(0, 100 - ((i.value - i.target) / Math.max(i.target, 1)) * 100);

              return (
                <TableRow key={i.code}>
                  <TableCell className="text-muted-foreground font-mono text-xs">
                    {i.code}
                  </TableCell>
                  <TableCell>
                    <span className="block font-medium">{i.name}</span>
                    {i.note && (
                      <span className="text-muted-foreground mt-0.5 block text-xs leading-relaxed">
                        {i.note}
                      </span>
                    )}
                    <span className="text-muted-foreground mt-1 inline-block font-mono text-[10px] tracking-wide">
                      {i.framework}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge color={ESG_PILLAR_COLOR[i.pillar]}>
                      {ESG_PILLAR_LABEL[i.pillar]}
                    </StatusBadge>
                  </TableCell>
                  <TableCell className="tnum text-right whitespace-nowrap">
                    {formatNumber(i.value)}{" "}
                    <span className="text-muted-foreground text-xs">{i.unit}</span>
                  </TableCell>
                  <TableCell className="tnum text-muted-foreground text-right whitespace-nowrap">
                    {i.higherIsBetter ? "≥ " : "≤ "}
                    {formatNumber(i.target)}
                  </TableCell>
                  <TableCell>
                    <ProgressMeter
                      value={Math.min(progress, 100)}
                      color={INDICATOR_STATUS_COLOR[i.status]}
                      size="sm"
                      showValue={false}
                    />
                  </TableCell>
                  <TableCell>
                    <StatusBadge color={INDICATOR_STATUS_COLOR[i.status]}>
                      {STATUS_LABEL[i.status]}
                    </StatusBadge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </SectionCard>
  );
}
