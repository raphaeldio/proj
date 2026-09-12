import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { ChartTooltip } from "./chart-tooltip";

export interface RadarDatum {
  pillar: string;
  skor: number;
  target: number;
}

interface RadarScoreProps {
  data: RadarDatum[];
  height?: number;
}

/** Skor pilar ESG dibanding targetnya. */
export function RadarScore({ data, height = 280 }: RadarScoreProps) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer
        width="100%"
        height="100%"
        initialDimension={{ width: 360, height }}
      >
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke="var(--border)" />
          <PolarAngleAxis
            dataKey="pillar"
            tick={{ fill: "var(--foreground)", fontSize: 12 }}
          />
          <PolarRadiusAxis
            domain={[0, 100]}
            tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
            axisLine={false}
          />
          <Tooltip
            content={
              <ChartTooltip
                titleOf={(label) => String(label)}
                rows={(payload) => {
                  const d = payload[0]?.payload as RadarDatum;
                  return [
                    { name: "Skor", value: `${d.skor}`, color: "var(--p-sage)" },
                    { name: "Target", value: `${d.target}`, color: "var(--p-peri)" },
                  ];
                }}
              />
            }
          />
          <Radar
            name="Target"
            dataKey="target"
            stroke="var(--p-peri-ink)"
            strokeDasharray="4 4"
            fill="var(--p-peri)"
            fillOpacity={0.12}
          />
          <Radar
            name="Skor"
            dataKey="skor"
            stroke="var(--p-sage-ink)"
            strokeWidth={2}
            fill="var(--p-sage)"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
