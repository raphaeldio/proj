import { useState } from "react";

import type { Region } from "@/data/types";
import { SectionCard } from "@/components/common/section-card";
import { Skeleton } from "@/components/ui/skeleton";
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
import { REGION_STATUS_COLOR, REGION_STATUS_LABEL } from "@/lib/palette";
import { formatNumber, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

const DIFFICULTY_LABEL = ["", "Mudah", "Cukup mudah", "Sedang", "Sulit", "Sangat sulit"];

interface PrioritasTableProps {
  regions: Region[] | undefined;
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

/**
 * Tabel diurutkan indeks kebutuhan menurun — wilayah yang paling
 * membutuhkan selalu berada di baris teratas, apa pun filternya.
 */
export function PrioritasTable({
  regions,
  isLoading,
  selectedId,
  onSelect,
}: PrioritasTableProps) {
  const [phase, setPhase] = useState<string>("semua");

  const rows = (regions ?? [])
    .filter((r) => phase === "semua" || String(r.phase) === phase)
    .sort((a, b) => b.nutritionGapIndex - a.nutritionGapIndex);

  return (
    <SectionCard
      title="Prioritas Wilayah"
      description="Diurutkan dari indeks kebutuhan gizi tertinggi"
      bodyClassName="p-0"
      action={
        <Select value={phase} onValueChange={setPhase}>
          <SelectTrigger className="h-8 w-36 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua fase</SelectItem>
            <SelectItem value="1">Fase 1</SelectItem>
            <SelectItem value="2">Fase 2</SelectItem>
            <SelectItem value="3">Fase 3</SelectItem>
          </SelectContent>
        </Select>
      }
    >
      {isLoading ? (
        <div className="space-y-2 p-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </div>
      ) : (
        <div className="max-h-[560px] overflow-auto">
          <Table>
            <TableHeader className="bg-card sticky top-0 z-10">
              <TableRow>
                <TableHead className="w-10 text-right">#</TableHead>
                <TableHead>Provinsi</TableHead>
                <TableHead className="w-32">Indeks kebutuhan</TableHead>
                <TableHead className="text-right">Stunting</TableHead>
                <TableHead className="text-right">Populasi sasaran</TableHead>
                <TableHead className="text-right">Cakupan</TableHead>
                <TableHead>Logistik</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r, i) => (
                <TableRow
                  key={r.id}
                  onClick={() => onSelect(selectedId === r.id ? null : r.id)}
                  className={cn(
                    "cursor-pointer",
                    selectedId === r.id && "bg-accent/60",
                  )}
                >
                  <TableCell className="tnum text-muted-foreground text-right text-xs">
                    {i + 1}
                  </TableCell>
                  <TableCell className="font-medium">
                    <span className="block whitespace-nowrap">{r.name}</span>
                    <span className="text-muted-foreground text-xs">
                      Fase {r.phase}
                    </span>
                  </TableCell>
                  <TableCell>
                    <ProgressMeter
                      value={r.nutritionGapIndex}
                      color="peach"
                      size="sm"
                      showValue={false}
                      label={`${r.nutritionGapIndex} / 100`}
                    />
                  </TableCell>
                  <TableCell className="tnum text-right">
                    {formatPercent(r.stuntingRate, 1)}
                  </TableCell>
                  <TableCell className="tnum text-right">
                    {formatNumber(r.targetPopulation)}
                  </TableCell>
                  <TableCell className="tnum text-right">
                    {formatPercent(r.coverage, 1)}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                    {DIFFICULTY_LABEL[r.logisticsDifficulty]}
                  </TableCell>
                  <TableCell>
                    <StatusBadge color={REGION_STATUS_COLOR[r.status]}>
                      {REGION_STATUS_LABEL[r.status]}
                    </StatusBadge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </SectionCard>
  );
}
