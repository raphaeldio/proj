import { useMemo, useState } from "react";
import { Boxes, Clock, ShieldAlert, Sprout } from "lucide-react";

import type { StageKey } from "@/data/types";
import { PageHeader } from "@/components/common/page-header";
import { KpiCard } from "@/components/common/kpi-card";
import { Skeleton } from "@/components/ui/skeleton";
import { StageFlow } from "./stage-flow";
import { BatchTable } from "./batch-table";
import { SupplierScorecard } from "./supplier-scorecard";
import { AlertsPanel, InventoryCard } from "./alerts-panel";
import { useProducts, useRegions, useSupplyChain } from "@/hooks/use-data";
import { formatNumber, formatPercent } from "@/lib/format";

export function SupplyPage() {
  const { data, isLoading } = useSupplyChain();
  const { data: products } = useProducts();
  const { data: regions } = useRegions();
  const [stageFilter, setStageFilter] = useState<StageKey | null>(null);

  const productNameById = useMemo(
    () => new Map((products ?? []).map((p) => [p.id, p.name])),
    [products],
  );
  const regionNameById = useMemo(
    () => new Map((regions ?? []).map((r) => [r.id, r.name])),
    [regions],
  );

  const stats = useMemo(() => {
    if (!data) return null;
    const totalFarmers = data.suppliers.reduce((a, s) => a + s.farmers, 0);
    const avgLeadTime = data.stages.reduce((a, s) => a + s.leadTimeDays, 0);
    // Rendemen menyeluruh: hasil perkalian rendemen tiap tahap.
    const overallYield =
      data.stages.reduce((a, s) => a * (s.yieldPct / 100), 1) * 100;
    return {
      activeBatches: data.batches.length,
      totalFarmers,
      avgLeadTime,
      overallYield,
      criticalAlerts: data.alerts.filter((a) => a.severity === "kritis").length,
    };
  }, [data]);

  return (
    <>
      <PageHeader
        title="Pemantauan Rantai Pasok"
        description="Posisi setiap batch, kinerja pemasok, dan titik yang sedang tertahan"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {!stats ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-36 w-full rounded-xl" />
          ))
        ) : (
          <>
            <KpiCard
              label="Batch Berjalan"
              value={stats.activeBatches}
              format={(n) => String(Math.round(n))}
              icon={Boxes}
              caption="Sedang bergerak di sepanjang rantai"
            />
            <KpiCard
              label="Lead Time Total"
              value={stats.avgLeadTime}
              format={(n) => `${Math.round(n)} hari`}
              icon={Clock}
              caption="Dari panen sampai titik layan"
            />
            <KpiCard
              label="Rendemen Menyeluruh"
              value={stats.overallYield}
              format={(n) => formatPercent(n, 1)}
              icon={Sprout}
              caption="Hasil perkalian rendemen tujuh tahap"
            />
            <KpiCard
              label="Petani Mitra"
              value={stats.totalFarmers}
              format={(n) => formatNumber(Math.round(n))}
              icon={ShieldAlert}
              caption={`${stats.criticalAlerts} peringatan kritis aktif`}
            />
          </>
        )}
      </div>

      {isLoading || !data ? (
        <div className="mt-4 space-y-4">
          <Skeleton className="h-56 w-full rounded-xl" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      ) : (
        <>
          <div className="mt-4">
            <StageFlow
              stages={data.stages}
              selected={stageFilter}
              onSelect={setStageFilter}
            />
          </div>

          <div className="mt-4">
            <BatchTable
              batches={data.batches}
              suppliers={data.suppliers}
              productNameById={productNameById}
              regionNameById={regionNameById}
              stageFilter={stageFilter}
              onClearFilter={() => setStageFilter(null)}
            />
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            <AlertsPanel alerts={data.alerts} />
            <InventoryCard
              warehouses={data.warehouses}
              regionNameById={regionNameById}
            />
          </div>

          <div className="mt-4">
            <SupplierScorecard
              suppliers={data.suppliers}
              regionNameById={regionNameById}
            />
          </div>
        </>
      )}
    </>
  );
}
