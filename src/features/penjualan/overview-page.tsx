import { Link } from "react-router";
import { ArrowUpRight, Coins, MapPin, Package, Users } from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { SectionCard } from "@/components/common/section-card";
import { KpiCard } from "@/components/common/kpi-card";
import { Skeleton } from "@/components/ui/skeleton";
import { IndonesiaMap } from "@/components/map/indonesia-map";
import { SalesTrendCard } from "./sales-trend-card";
import { ChannelBreakdown, ProductBreakdown } from "./channel-breakdown";
import { TopRegionsTable } from "./top-regions-table";
import { ActivityFeed } from "./activity-feed";
import {
  useProvinceGeo,
  useRegions,
  useSalesSeries,
  useSalesSummary,
} from "@/hooks/use-data";
import { formatCompact, formatIDRCompact, formatNumber } from "@/lib/format";

export function OverviewPage() {
  const { data: summary, isLoading } = useSalesSummary();
  const { data: series } = useSalesSeries();
  const { data: regions } = useRegions();
  const { data: geo } = useProvinceGeo();

  const trend = series?.slice(-12).map((m) => m.units) ?? [];
  const revenueTrend = series?.slice(-12).map((m) => m.revenue) ?? [];

  return (
    <>
      <PageHeader
        title="Ikhtisar Operasi"
        description="Ringkasan penjualan, cakupan wilayah, dan dampak gizi tahun berjalan"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading || !summary ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-xl" />
          ))
        ) : (
          <>
            <KpiCard
              label="Sachet Terjual"
              value={summary.unitsYtd}
              format={formatCompact}
              icon={Package}
              delta={summary.unitsDelta}
              caption="Januari hingga September 2026"
              trend={trend}
            />
            <KpiCard
              label="Pendapatan"
              value={summary.revenueYtd}
              format={formatIDRCompact}
              icon={Coins}
              delta={summary.revenueDelta}
              caption={`Rata-rata Rp ${formatNumber(summary.averageOrderValue)} per sachet`}
              trend={revenueTrend}
            />
            <KpiCard
              label="Provinsi Terlayani"
              value={summary.activeRegions}
              format={(n) => String(Math.round(n))}
              icon={MapPin}
              delta={summary.activeRegionsDelta}
              deltaKind="absolute"
              deltaSuffix="baru"
              caption={`${formatNumber(summary.outletCount)} titik layan aktif`}
            />
            <KpiCard
              label="Penerima Manfaat"
              value={summary.beneficiaries}
              format={formatCompact}
              icon={Users}
              delta={summary.beneficiariesDelta}
              caption="Anak balita dan ibu hamil"
            />
          </>
        )}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <SalesTrendCard />
        </div>
        <ActivityFeed />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <ChannelBreakdown />
        <ProductBreakdown />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-5">
        <SectionCard
          className="min-w-0 xl:col-span-2"
          title="Persebaran Distribusi"
          description="Warna menunjukkan status distribusi tiap provinsi"
          action={
            <Link
              to="/dashboard/distribusi"
              className="text-primary inline-flex items-center gap-1 text-xs font-medium hover:underline"
            >
              Peta lengkap
              <ArrowUpRight className="size-3.5" strokeWidth={2} />
            </Link>
          }
        >
          {geo && regions ? (
            <IndonesiaMap geo={geo} regions={regions} interactive={false} />
          ) : (
            <Skeleton className="h-48 w-full" />
          )}
        </SectionCard>

        <div className="min-w-0 xl:col-span-3">
          <TopRegionsTable />
        </div>
      </div>
    </>
  );
}
