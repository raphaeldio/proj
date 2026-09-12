import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { ChartTooltip } from "./chart-tooltip";
import { formatCompact, formatPercent } from "@/lib/format";
import { pastel, type PastelKey } from "@/lib/palette";

export interface DonutDatum {
  name: string;
  value: number;
  color: PastelKey;
}

interface DonutSplitProps {
  data: DonutDatum[];
  height?: number;
  /** Teks di tengah donat; biasanya total. */
  centerLabel?: string;
  centerValue?: string;
}

export function DonutSplit({
  data,
  height = 260,
  centerLabel,
  centerValue,
}: DonutSplitProps) {
  const total = data.reduce((a, d) => a + d.value, 0);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      {/* Lebar mengikuti kontainer sampai batas `height`, supaya donat tidak
          memaksa kartu melebar di layar sempit. */}
      <div
        className="relative aspect-square w-full shrink-0"
        style={{ maxWidth: height }}
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={{ width: height, height }}
        >
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="62%"
              outerRadius="92%"
              paddingAngle={2}
              stroke="var(--card)"
              strokeWidth={2}
            >
              {data.map((d) => (
                <Cell key={d.name} fill={pastel(d.color)} />
              ))}
            </Pie>
            <Tooltip
              content={
                <ChartTooltip
                  titleOf={(_, payload) => String(payload[0]?.name ?? "")}
                  rows={(payload) => {
                    const p = payload[0];
                    const v = Number(p?.value ?? 0);
                    return [
                      {
                        name: "Sachet",
                        value: formatCompact(v),
                        color: p?.payload?.fill,
                      },
                      {
                        name: "Porsi",
                        value: formatPercent((v / total) * 100, 1),
                      },
                    ];
                  }}
                />
              }
            />
          </PieChart>
        </ResponsiveContainer>

        {(centerLabel || centerValue) && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            {centerValue && (
              <span className="font-display tnum text-2xl font-semibold">
                {centerValue}
              </span>
            )}
            {centerLabel && (
              <span className="text-muted-foreground mt-0.5 text-xs">
                {centerLabel}
              </span>
            )}
          </div>
        )}
      </div>

      <ul className="min-w-0 flex-1 space-y-2.5">
        {data.map((d) => (
          <li key={d.name} className="flex items-center gap-2.5 text-sm">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ background: pastel(d.color) }}
              aria-hidden
            />
            <span className="min-w-0 flex-1 truncate">{d.name}</span>
            <span className="tnum text-muted-foreground shrink-0 text-xs">
              {formatPercent((d.value / total) * 100, 1)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
