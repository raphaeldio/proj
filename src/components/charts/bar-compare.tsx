import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartTooltip, axisProps, type TooltipRow } from "./chart-tooltip";
import { formatCompact } from "@/lib/format";
import { SERIES_ORDER, pastel } from "@/lib/palette";

export interface BarDatum {
  name: string;
  value: number;
  /** Rincian tambahan yang muncul di tooltip. */
  detail?: string;
}

interface BarCompareProps {
  data: BarDatum[];
  height?: number;
  valueLabel?: string;
  formatValue?: (n: number) => string;
}

/** Bar horizontal — label kategori panjang tetap terbaca. */
export function BarCompare({
  data,
  height = 280,
  valueLabel = "Sachet",
  formatValue = formatCompact,
}: BarCompareProps) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer
        width="100%"
        height="100%"
        initialDimension={{ width: 520, height }}
      >
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 16, bottom: 4, left: 4 }}
        >
          <XAxis type="number" tickFormatter={formatValue} {...axisProps} />
          <YAxis
            type="category"
            dataKey="name"
            width={132}
            {...axisProps}
            tick={{ fill: "var(--foreground)", fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: "var(--muted)", opacity: 0.5 }}
            content={
              <ChartTooltip
                titleOf={(label) => String(label)}
                rows={(payload) => {
                  const p = payload[0];
                  const d = p?.payload as BarDatum;
                  const out: TooltipRow[] = [
                    {
                      name: valueLabel,
                      value: formatValue(Number(p?.value ?? 0)),
                      color: p?.payload?.fill,
                    },
                  ];
                  if (d?.detail) out.push({ name: "Cocok untuk", value: d.detail });
                  return out;
                }}
              />
            }
          />
          <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={26}>
            {data.map((d, i) => (
              <Cell
                key={d.name}
                fill={pastel(SERIES_ORDER[i % SERIES_ORDER.length])}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
