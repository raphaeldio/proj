import type { Supplier } from "@/data/types";
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
import { SUPPLY_STATUS_COLOR, SUPPLY_STATUS_LABEL } from "@/lib/palette";
import { formatNumber, formatPercent } from "@/lib/format";

interface Props {
  suppliers: Supplier[];
  regionNameById: Map<string, string>;
}

export function SupplierScorecard({ suppliers, regionNameById }: Props) {
  const rows = [...suppliers].sort((a, b) => a.onTimeRate - b.onTimeRate);

  return (
    <SectionCard
      title="Kartu Skor Pemasok"
      description="Diurutkan dari ketepatan waktu terendah — yang paling perlu ditindaklanjuti di atas"
      bodyClassName="p-0"
    >
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-48">Koperasi mitra</TableHead>
              <TableHead>Komoditas</TableHead>
              <TableHead className="text-right">Petani</TableHead>
              <TableHead className="w-32">Ketepatan waktu</TableHead>
              <TableHead className="w-28">Mutu</TableHead>
              <TableHead className="text-right">Premi harga</TableHead>
              <TableHead>Sertifikasi</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">
                  <span className="block">{s.name}</span>
                  <span className="text-muted-foreground text-xs">
                    {regionNameById.get(s.regionId) ?? s.regionId}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {s.commodity}
                </TableCell>
                <TableCell className="tnum text-right">
                  {formatNumber(s.farmers)}
                </TableCell>
                <TableCell>
                  <ProgressMeter
                    value={s.onTimeRate}
                    color={SUPPLY_STATUS_COLOR[s.status]}
                    size="sm"
                  />
                </TableCell>
                <TableCell>
                  <ProgressMeter
                    value={s.qualityScore}
                    color="sky"
                    size="sm"
                    showValue={false}
                    label={`${s.qualityScore} / 100`}
                  />
                </TableCell>
                <TableCell className="tnum text-p-sage-ink text-right font-medium">
                  +{formatPercent(s.fairPricePremium, 1)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {s.certifications.map((c) => (
                      <StatusBadge key={c} color="aqua" dot={false}>
                        {c}
                      </StatusBadge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge color={SUPPLY_STATUS_COLOR[s.status]}>
                    {SUPPLY_STATUS_LABEL[s.status]}
                  </StatusBadge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </SectionCard>
  );
}
