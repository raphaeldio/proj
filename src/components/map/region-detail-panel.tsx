import { MapPin, Package, Truck, Users, X } from "lucide-react";

import type { Region } from "@/data/types";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/status-badge";
import { ProgressMeter } from "@/components/common/progress-meter";
import { REGION_STATUS_COLOR, REGION_STATUS_LABEL } from "@/lib/palette";
import {
  formatDate,
  formatIDRCompact,
  formatNumber,
  formatPercent,
} from "@/lib/format";

const DIFFICULTY_LABEL = [
  "",
  "Mudah",
  "Cukup mudah",
  "Sedang",
  "Sulit",
  "Sangat sulit",
];

interface RegionDetailPanelProps {
  region: Region | null;
  onClose: () => void;
}

export function RegionDetailPanel({ region, onClose }: RegionDetailPanelProps) {
  if (!region) {
    return (
      <div className="text-muted-foreground flex h-full min-h-64 flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-6 text-center">
        <MapPin className="size-5" strokeWidth={1.5} />
        <p className="text-sm">
          Pilih sebuah provinsi di peta untuk melihat rinciannya.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full rounded-xl border p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold">{region.name}</h3>
          <p className="text-muted-foreground text-xs">{region.island}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Tutup rincian wilayah"
          className="size-7 shrink-0"
        >
          <X className="size-4" />
        </Button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <StatusBadge color={REGION_STATUS_COLOR[region.status]}>
          {REGION_STATUS_LABEL[region.status]}
        </StatusBadge>
        <StatusBadge color="peri" dot={false}>
          Fase {region.phase}
        </StatusBadge>
      </div>

      <div className="mt-5 space-y-4">
        <ProgressMeter
          label="Cakupan populasi sasaran"
          value={region.coverage}
          color={REGION_STATUS_COLOR[region.status]}
        />
        <ProgressMeter
          label="Indeks kebutuhan gizi"
          value={region.nutritionGapIndex}
          color="peach"
        />
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
        <Stat
          icon={Users}
          label="Populasi sasaran"
          value={formatNumber(region.targetPopulation)}
        />
        <Stat
          icon={MapPin}
          label="Titik layan"
          value={formatNumber(region.outlets)}
        />
        <Stat
          icon={Package}
          label="Sachet terjual"
          value={formatNumber(region.unitsSoldYtd)}
        />
        <Stat
          icon={Truck}
          label="Kesulitan logistik"
          value={DIFFICULTY_LABEL[region.logisticsDifficulty]}
        />
      </dl>

      <div className="mt-5 space-y-2 border-t pt-4 text-sm">
        <Line label="Prevalensi stunting" value={formatPercent(region.stuntingRate, 1)} />
        <Line label="Pendapatan YTD" value={formatIDRCompact(region.revenueYtd)} />
        <Line
          label="Pengiriman terakhir"
          value={region.lastShipment ? formatDate(region.lastShipment) : "Belum ada"}
        />
      </div>

      {region.partners.length > 0 && (
        <div className="mt-5 border-t pt-4">
          <p className="text-muted-foreground mb-2 text-xs font-medium">
            Mitra lokal
          </p>
          <ul className="space-y-1 text-sm">
            {region.partners.map((p) => (
              <li key={p} className="flex items-start gap-2">
                <span
                  className="bg-p-sage mt-1.5 size-1.5 shrink-0 rounded-full"
                  aria-hidden
                />
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="text-muted-foreground flex items-center gap-1.5 text-xs">
        <Icon className="size-3.5" strokeWidth={1.75} />
        {label}
      </dt>
      <dd className="tnum mt-1 font-semibold">{value}</dd>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="tnum font-medium">{value}</span>
    </div>
  );
}
