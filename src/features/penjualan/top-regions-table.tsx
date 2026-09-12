import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";

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
import { useRegions } from "@/hooks/use-data";
import { REGION_STATUS_COLOR, REGION_STATUS_LABEL } from "@/lib/palette";
import { formatCompact, formatIDRCompact } from "@/lib/format";

export function TopRegionsTable() {
  const { data, isLoading } = useRegions();

  const rows = (data ?? [])
    .filter((r) => r.unitsSoldYtd > 0)
    .sort((a, b) => b.unitsSoldYtd - a.unitsSoldYtd)
    .slice(0, 8);

  return (
    <SectionCard
      title="Wilayah Teratas"
      description="Delapan provinsi dengan penjualan tertinggi"
      bodyClassName="p-0"
      action={
        <Link
          to="/dashboard/distribusi"
          className="text-primary inline-flex items-center gap-1 text-xs font-medium hover:underline"
        >
          Lihat semua
          <ArrowUpRight className="size-3.5" strokeWidth={2} />
        </Link>
      }
    >
      {isLoading ? (
        <div className="space-y-2 p-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provinsi</TableHead>
                <TableHead className="text-right">Sachet</TableHead>
                <TableHead className="text-right">Pendapatan</TableHead>
                <TableHead className="w-36">Cakupan</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">
                    <span className="block">{r.name}</span>
                    <span className="text-muted-foreground text-xs">
                      {r.island}
                    </span>
                  </TableCell>
                  <TableCell className="tnum text-right">
                    {formatCompact(r.unitsSoldYtd)}
                  </TableCell>
                  <TableCell className="tnum text-right">
                    {formatIDRCompact(r.revenueYtd)}
                  </TableCell>
                  <TableCell>
                    <ProgressMeter
                      value={r.coverage}
                      color={REGION_STATUS_COLOR[r.status]}
                      size="sm"
                      showValue
                    />
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
