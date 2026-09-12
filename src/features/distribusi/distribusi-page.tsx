import { useMemo, useState } from "react";
import { MapPin, Package, Target, Users } from "lucide-react";

import type { RegionStatus } from "@/data/types";
import { PageHeader } from "@/components/common/page-header";
import { SectionCard } from "@/components/common/section-card";
import { KpiCard } from "@/components/common/kpi-card";
import { Skeleton } from "@/components/ui/skeleton";
import { IndonesiaMap, type MapMode } from "@/components/map/indonesia-map";
import { MapLegend } from "@/components/map/map-legend";
import { RegionDetailPanel } from "@/components/map/region-detail-panel";
import { PrioritasTable } from "./prioritas-table";
import { RolloutPhases } from "./rollout-phases";
import { useProvinceGeo, useRegions } from "@/hooks/use-data";
import { formatCompact, formatNumber, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

const MODES: { key: MapMode; label: string }[] = [
  { key: "status", label: "Status Distribusi" },
  { key: "needs", label: "Indeks Kebutuhan" },
];

export function DistribusiPage() {
  const { data: regions, isLoading } = useRegions();
  const { data: geo } = useProvinceGeo();

  const [mode, setMode] = useState<MapMode>("status");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeStatuses, setActiveStatuses] = useState<Set<RegionStatus>>(
    new Set(),
  );

  const counts = useMemo(() => {
    const base: Record<RegionStatus, number> = {
      aktif: 0,
      perintis: 0,
      prioritas: 0,
      belum: 0,
    };
    for (const r of regions ?? []) base[r.status] += 1;
    return base;
  }, [regions]);

  const stats = useMemo(() => {
    const list = regions ?? [];
    const served = list.filter((r) => r.unitsSoldYtd > 0);
    const targetTotal = list.reduce((a, r) => a + r.targetPopulation, 0);
    const reached = list.reduce(
      (a, r) => a + Math.round(r.unitsSoldYtd / 135),
      0,
    );
    const untouched = list.filter((r) => r.status === "belum");
    return {
      served: served.length,
      outlets: list.reduce((a, r) => a + r.outlets, 0),
      nationalCoverage: targetTotal > 0 ? (reached / targetTotal) * 100 : 0,
      reached,
      untouchedPopulation: untouched.reduce(
        (a, r) => a + r.targetPopulation,
        0,
      ),
    };
  }, [regions]);

  const selected = regions?.find((r) => r.id === selectedId) ?? null;

  function toggleStatus(status: RegionStatus) {
    setActiveStatuses((prev) => {
      const next = new Set(prev);
      // Set kosong berarti "tampilkan semua"; klik pertama menyaring ke satu status.
      if (next.size === 0) {
        (["aktif", "perintis", "prioritas", "belum"] as RegionStatus[]).forEach(
          (s) => next.add(s),
        );
      }
      if (next.has(status)) next.delete(status);
      else next.add(status);
      if (next.size === 4) next.clear();
      return next;
    });
  }

  return (
    <>
      <PageHeader
        title="Persebaran & Prioritas Wilayah"
        description="Ke mana produk sudah sampai, dan ke mana ia paling dibutuhkan berikutnya"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-36 w-full rounded-xl" />
          ))
        ) : (
          <>
            <KpiCard
              label="Provinsi Terlayani"
              value={stats.served}
              format={(n) => `${Math.round(n)} / 32`}
              icon={MapPin}
              caption="Dari 32 provinsi pada basemap"
            />
            <KpiCard
              label="Titik Layan"
              value={stats.outlets}
              format={(n) => formatNumber(Math.round(n))}
              icon={Package}
              caption="Posyandu, puskesmas, koperasi, warung mitra"
            />
            <KpiCard
              label="Cakupan Nasional"
              value={stats.nationalCoverage}
              format={(n) => formatPercent(n, 1)}
              icon={Target}
              caption={`${formatCompact(stats.reached)} penerima manfaat terjangkau`}
            />
            <KpiCard
              label="Belum Terjangkau"
              value={stats.untouchedPopulation}
              format={formatCompact}
              icon={Users}
              caption="Populasi sasaran di provinsi fase 3"
            />
          </>
        )}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <SectionCard
          className="min-w-0 xl:col-span-2"
          title="Peta Persebaran"
          description="Arahkan kursor untuk melihat metrik, klik untuk membuka rincian"
          action={
            <div className="bg-muted inline-flex rounded-lg p-0.5">
              {MODES.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setMode(m.key)}
                  aria-pressed={mode === m.key}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs font-medium transition",
                    mode === m.key
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
          }
        >
          {geo && regions ? (
            <>
              <IndonesiaMap
                geo={geo}
                regions={regions}
                mode={mode}
                activeStatuses={activeStatuses}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
              <div className="mt-4 border-t pt-4">
                <MapLegend
                  mode={mode}
                  counts={counts}
                  activeStatuses={activeStatuses}
                  onToggle={toggleStatus}
                />
              </div>
            </>
          ) : (
            <Skeleton className="h-72 w-full" />
          )}
        </SectionCard>

        <RegionDetailPanel
          region={selected}
          onClose={() => setSelectedId(null)}
        />
      </div>

      <div className="mt-4">
        <PrioritasTable
          regions={regions}
          isLoading={isLoading}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Strategi Rollout Bertahap</h2>
        <RolloutPhases />
      </div>
    </>
  );
}
