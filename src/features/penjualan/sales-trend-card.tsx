import { useMemo, useState } from "react";

import { SectionCard } from "@/components/common/section-card";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaTrend } from "@/components/charts/area-trend";
import { useSalesSeries } from "@/hooks/use-data";
import { cn } from "@/lib/utils";

type Range = "6b" | "12b" | "semua";

const RANGES: { key: Range; label: string; months: number | null }[] = [
  { key: "6b", label: "6 bulan", months: 6 },
  { key: "12b", label: "12 bulan", months: 12 },
  { key: "semua", label: "Semua", months: null },
];

export function SalesTrendCard() {
  const [range, setRange] = useState<Range>("12b");
  const { data, isLoading } = useSalesSeries();

  const sliced = useMemo(() => {
    if (!data) return [];
    const months = RANGES.find((r) => r.key === range)?.months;
    return months ? data.slice(-months) : data;
  }, [data, range]);

  return (
    <SectionCard
      title="Tren Penjualan"
      description="Sachet terjual per bulan, aktual dibanding target"
      action={
        <div className="bg-muted inline-flex rounded-lg p-0.5">
          {RANGES.map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => setRange(r.key)}
              aria-pressed={range === r.key}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition",
                range === r.key
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      }
    >
      {isLoading ? (
        <Skeleton className="h-[300px] w-full" />
      ) : (
        <AreaTrend data={sliced} />
      )}

      <div className="text-muted-foreground mt-4 flex flex-wrap items-center gap-4 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="bg-p-sage size-2.5 rounded-full" aria-hidden />
          Aktual
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="border-p-peri-ink h-0 w-4 border-t-2 border-dashed"
            aria-hidden
          />
          Target
        </span>
      </div>
    </SectionCard>
  );
}
