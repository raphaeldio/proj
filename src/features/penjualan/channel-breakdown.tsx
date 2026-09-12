import { SectionCard } from "@/components/common/section-card";
import { Skeleton } from "@/components/ui/skeleton";
import { DonutSplit, type DonutDatum } from "@/components/charts/donut-split";
import { BarCompare, type BarDatum } from "@/components/charts/bar-compare";
import { useChannelBreakdown, useProducts } from "@/hooks/use-data";
import { CHANNEL_COLOR, CHANNEL_LABEL } from "@/lib/palette";
import { formatCompact } from "@/lib/format";

export function ChannelBreakdown() {
  const { data, isLoading } = useChannelBreakdown();

  const donut: DonutDatum[] =
    data?.map((d) => ({
      name: CHANNEL_LABEL[d.channel],
      value: d.units,
      color: CHANNEL_COLOR[d.channel],
    })) ?? [];

  const total = donut.reduce((a, d) => a + d.value, 0);

  return (
    <SectionCard
      title="Kanal Distribusi"
      description="Komposisi penjualan bulan berjalan"
    >
      {isLoading ? (
        <Skeleton className="h-[260px] w-full" />
      ) : (
        <DonutSplit
          data={donut}
          centerValue={formatCompact(total)}
          centerLabel="sachet bulan ini"
        />
      )}
    </SectionCard>
  );
}

export function ProductBreakdown() {
  const { data, isLoading } = useProducts();

  const bars: BarDatum[] =
    data?.map((p) => ({
      name: p.name.replace("Tabur ", ""),
      value: p.unitsSoldYtd,
      detail: p.basePairing.join(", "),
    })) ?? [];

  return (
    <SectionCard
      title="Penjualan per Varian"
      description="Sachet terjual sepanjang 2026 berjalan"
    >
      {isLoading ? (
        <Skeleton className="h-[280px] w-full" />
      ) : (
        <BarCompare data={bars} />
      )}
    </SectionCard>
  );
}
