import { useId } from "react";
import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

import { Card } from "@/components/ui/card";
import { CountUp } from "@/components/common/count-up";
import { cn } from "@/lib/utils";
import { formatDelta } from "@/lib/format";

interface KpiCardProps {
  label: string;
  value: number;
  format: (n: number) => string;
  icon: LucideIcon;
  /** Persen bila deltaKind "percent", jumlah absolut bila "absolute". */
  delta?: number;
  deltaKind?: "percent" | "absolute";
  deltaSuffix?: string;
  caption?: string;
  /** Deret kecil untuk sparkline; boleh dikosongkan. */
  trend?: number[];
  className?: string;
}

export function KpiCard({
  label,
  value,
  format,
  icon: Icon,
  delta,
  deltaKind = "percent",
  deltaSuffix,
  caption,
  trend,
  className,
}: KpiCardProps) {
  // useId bisa menghasilkan karakter yang tidak aman untuk url(#...)
  const gradientId = `spark-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const positive = (delta ?? 0) >= 0;
  const DeltaIcon = positive ? TrendingUp : TrendingDown;

  const deltaText =
    delta === undefined
      ? null
      : deltaKind === "percent"
        ? formatDelta(delta)
        : `${positive ? "+" : ""}${delta}${deltaSuffix ? ` ${deltaSuffix}` : ""}`;

  const sparkData = trend?.map((v, i) => ({ i, v }));

  return (
    <Card
      className={cn(
        "relative gap-0 overflow-hidden p-5 transition-shadow hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="bg-accent text-accent-foreground grid size-8 place-items-center rounded-lg">
            <Icon className="size-4" strokeWidth={1.75} />
          </span>
          <span className="text-muted-foreground text-sm font-medium">
            {label}
          </span>
        </div>

        {deltaText && (
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
              positive
                ? "bg-p-sage/30 text-p-sage-ink border-p-sage/50"
                : "bg-p-rose/30 text-p-rose-ink border-p-rose/50",
            )}
          >
            <DeltaIcon className="size-3" strokeWidth={2} />
            <span className="tnum">{deltaText}</span>
          </span>
        )}
      </div>

      <div className="mt-4 font-display text-3xl leading-none font-semibold">
        <CountUp value={value} format={format} />
      </div>

      {caption && (
        <p className="text-muted-foreground mt-2 text-xs">{caption}</p>
      )}

      {sparkData && sparkData.length > 1 && (
        <div className="mt-3 -mb-1 h-10" aria-hidden>
          <ResponsiveContainer
              width="100%"
              height="100%"
              initialDimension={{ width: 240, height: 40 }}
            >
            <AreaChart data={sparkData} margin={{ top: 2, bottom: 0, left: 0, right: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--p-sage)" stopOpacity={0.55} />
                  <stop offset="100%" stopColor="var(--p-sage)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke="var(--p-sage-ink)"
                strokeWidth={1.5}
                fill={`url(#${gradientId})`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
