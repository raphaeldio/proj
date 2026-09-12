import { useId } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { SalesMonth } from "@/data/types";
import { ChartTooltip, axisProps } from "./chart-tooltip";
import { formatCompact, monthLabel, monthLabelLong } from "@/lib/format";

interface AreaTrendProps {
  data: SalesMonth[];
  height?: number;
}

/** Penjualan aktual (area) dibanding target (garis putus-putus). */
export function AreaTrend({ data, height = 300 }: AreaTrendProps) {
  const gid = `area-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <div style={{ height }}>
      <ResponsiveContainer
        width="100%"
        height="100%"
        initialDimension={{ width: 640, height }}
      >
        <ComposedChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 0, left: -12 }}
        >
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--p-sage)" stopOpacity={0.75} />
              <stop offset="100%" stopColor="var(--p-sage)" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid
            vertical={false}
            stroke="var(--border)"
            strokeDasharray="3 3"
          />
          <XAxis dataKey="month" tickFormatter={monthLabel} {...axisProps} />
          <YAxis tickFormatter={formatCompact} width={56} {...axisProps} />

          <Tooltip
            cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
            content={
              <ChartTooltip
                titleOf={(label) => monthLabelLong(String(label))}
                rows={(payload) => {
                  const d = payload[0]?.payload as SalesMonth;
                  return [
                    {
                      name: "Aktual",
                      value: `${formatCompact(d.units)} sachet`,
                      color: "var(--p-sage)",
                    },
                    {
                      name: "Target",
                      value: `${formatCompact(d.targetUnits)} sachet`,
                      color: "var(--p-peri)",
                    },
                  ];
                }}
              />
            }
          />

          <Area
            type="monotone"
            dataKey="units"
            stroke="var(--p-sage-ink)"
            strokeWidth={2}
            fill={`url(#${gid})`}
            name="Aktual"
          />
          <Line
            type="monotone"
            dataKey="targetUnits"
            stroke="var(--p-peri-ink)"
            strokeWidth={1.75}
            strokeDasharray="5 4"
            dot={false}
            name="Target"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
