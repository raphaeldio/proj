import { Fragment, useState } from "react";
import { ChevronDown } from "lucide-react";

import type { Batch, StageKey, Supplier } from "@/data/types";
import { SectionCard } from "@/components/common/section-card";
import { StatusBadge } from "@/components/common/status-badge";
import { BatchTimeline } from "./batch-timeline";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { STAGE_LABEL } from "@/data/supply-chain";
import { SUPPLY_STATUS_COLOR, SUPPLY_STATUS_LABEL } from "@/lib/palette";
import { formatDate, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

interface BatchTableProps {
  batches: Batch[];
  suppliers: Supplier[];
  productNameById: Map<string, string>;
  regionNameById: Map<string, string>;
  stageFilter: StageKey | null;
  onClearFilter: () => void;
}

export function BatchTable({
  batches,
  suppliers,
  productNameById,
  regionNameById,
  stageFilter,
  onClearFilter,
}: BatchTableProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const supplierName = new Map(suppliers.map((s) => [s.id, s.name]));
  const rows = stageFilter
    ? batches.filter((b) => b.currentStage === stageFilter)
    : batches;

  return (
    <SectionCard
      title="Batch Berjalan"
      description="Klik sebuah baris untuk membuka jejak ketertelusuran penuh"
      bodyClassName="p-0"
      action={
        stageFilter && (
          <button
            type="button"
            onClick={onClearFilter}
            className="text-primary text-xs font-medium hover:underline"
          >
            Hapus filter: {STAGE_LABEL[stageFilter]}
          </button>
        )
      }
    >
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8" />
              <TableHead>Kode batch</TableHead>
              <TableHead>Varian</TableHead>
              <TableHead>Pemasok</TableHead>
              <TableHead className="text-right">Kuantitas</TableHead>
              <TableHead>Tahap saat ini</TableHead>
              <TableHead>Tujuan</TableHead>
              <TableHead>ETA</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-muted-foreground py-8 text-center text-sm"
                >
                  Tidak ada batch pada tahap ini.
                </TableCell>
              </TableRow>
            )}

            {rows.map((b) => {
              const open = expanded === b.id;
              return (
                <Fragment key={b.id}>
                  <TableRow
                    onClick={() => setExpanded(open ? null : b.id)}
                    className={cn("cursor-pointer", open && "bg-accent/50")}
                  >
                    <TableCell>
                      <ChevronDown
                        className={cn(
                          "text-muted-foreground size-4 transition-transform",
                          open && "rotate-180",
                        )}
                        strokeWidth={1.75}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-xs font-medium">
                      {b.id}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {productNameById.get(b.productId) ?? b.productId}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {supplierName.get(b.supplierId) ?? b.supplierId}
                    </TableCell>
                    <TableCell className="tnum text-right whitespace-nowrap">
                      {formatNumber(b.quantityKg)} kg
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {STAGE_LABEL[b.currentStage]}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {regionNameById.get(b.destinationRegionId) ??
                        b.destinationRegionId}
                    </TableCell>
                    <TableCell className="tnum whitespace-nowrap">
                      {formatDate(b.eta)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge color={SUPPLY_STATUS_COLOR[b.status]}>
                        {SUPPLY_STATUS_LABEL[b.status]}
                      </StatusBadge>
                    </TableCell>
                  </TableRow>

                  {open && (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={9} className="bg-muted/30 px-6">
                        <BatchTimeline batch={b} />
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </SectionCard>
  );
}
