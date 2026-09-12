import { useMemo, useRef, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";

import type { Region, RegionStatus } from "@/data/types";
import type { ProvinceCollection } from "@/services/api";
import {
  REGION_STATUS_COLOR,
  REGION_STATUS_LABEL,
  needsScaleColor,
  pastel,
} from "@/lib/palette";
import { formatNumber, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

export type MapMode = "status" | "needs";

interface IndonesiaMapProps {
  geo: ProvinceCollection;
  regions: Region[];
  mode?: MapMode;
  /** Status yang sedang ditampilkan; kosong berarti semua. */
  activeStatuses?: Set<RegionStatus>;
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  /** Versi ringkas untuk landing: tanpa interaksi klik. */
  interactive?: boolean;
  className?: string;
}

/**
 * Choropleth provinsi Indonesia.
 *
 * Digambar langsung dengan d3-geo (geoMercator + geoPath) alih-alih memakai
 * pustaka peta React. Ini hanya butuh proyeksi dan path, sementara pustaka
 * peta membawa dependensi peer yang rapuh dan lapisan abstraksi yang justru
 * menghalangi saat perlu mengatur warna dan interaksi sendiri.
 */
export function IndonesiaMap({
  geo,
  regions,
  mode = "status",
  activeStatuses,
  selectedId,
  onSelect,
  interactive = true,
  className,
}: IndonesiaMapProps) {
  const W = 1000;
  const H = 400;
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<{
    region: Region | null;
    name: string;
    x: number;
    y: number;
  } | null>(null);

  const regionMap = useMemo(
    () => new Map(regions.map((r) => [r.id, r])),
    [regions],
  );

  const paths = useMemo(() => {
    const projection = geoMercator().fitExtent(
      [
        [6, 6],
        [W - 6, H - 6],
      ],
      geo as unknown as GeoJSON.FeatureCollection,
    );
    const pathGen = geoPath(projection);

    return geo.features.map((f) => ({
      code: f.properties.code,
      name: f.properties.name,
      d: pathGen(f as unknown as GeoJSON.Feature) ?? "",
    }));
  }, [geo]);

  function fillFor(region: Region | undefined): string {
    if (!region) return "var(--muted)";
    if (mode === "needs") return needsScaleColor(region.nutritionGapIndex);
    return pastel(REGION_STATUS_COLOR[region.status]);
  }

  function dimmed(region: Region | undefined): boolean {
    if (!activeStatuses || activeStatuses.size === 0) return false;
    if (!region) return true;
    return !activeStatuses.has(region.status);
  }

  function handleMove(
    e: React.MouseEvent<SVGPathElement>,
    code: string,
    name: string,
  ) {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    setHovered({
      region: regionMap.get(code) ?? null,
      name,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }

  return (
    <div ref={wrapRef} className={cn("relative w-full", className)}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label="Peta persebaran distribusi NusaTabur per provinsi"
      >
        <g>
          {paths.map((p) => {
            const region = regionMap.get(p.code);
            const isSelected = selectedId === p.code;
            const isDim = dimmed(region);

            return (
              <path
                key={p.code}
                d={p.d}
                fill={fillFor(region)}
                stroke="var(--card)"
                strokeWidth={isSelected ? 2 : 0.7}
                className={cn(
                  "transition-[opacity,stroke-width] duration-200",
                  interactive && "cursor-pointer",
                  isDim ? "opacity-20" : "opacity-100",
                )}
                style={
                  isSelected
                    ? { stroke: "var(--foreground)", strokeWidth: 2 }
                    : undefined
                }
                onMouseMove={(e) => handleMove(e, p.code, p.name)}
                onMouseLeave={() => setHovered(null)}
                onClick={
                  interactive
                    ? () => onSelect?.(isSelected ? null : p.code)
                    : undefined
                }
              >
                <title>{p.name}</title>
              </path>
            );
          })}
        </g>
      </svg>

      {hovered && (
        <MapTooltip
          name={hovered.name}
          region={hovered.region}
          mode={mode}
          x={hovered.x}
          y={hovered.y}
          containerWidth={wrapRef.current?.clientWidth ?? 0}
        />
      )}
    </div>
  );
}

function MapTooltip({
  name,
  region,
  mode,
  x,
  y,
  containerWidth,
}: {
  name: string;
  region: Region | null;
  mode: MapMode;
  x: number;
  y: number;
  containerWidth: number;
}) {
  // Balikkan arah tooltip di dekat tepi kanan agar tidak terpotong.
  const flip = containerWidth > 0 && x > containerWidth - 220;

  return (
    <div
      className="bg-popover text-popover-foreground pointer-events-none absolute z-20 w-52 rounded-xl border p-3 shadow-lg"
      style={{
        left: flip ? x - 216 : x + 14,
        top: Math.max(y - 10, 4),
      }}
    >
      <p className="text-sm leading-tight font-semibold">{name}</p>

      {region ? (
        <dl className="mt-2 space-y-1 text-xs">
          <Row
            label="Status"
            value={REGION_STATUS_LABEL[region.status]}
            highlight={mode === "status"}
          />
          <Row
            label="Indeks kebutuhan"
            value={`${region.nutritionGapIndex} / 100`}
            highlight={mode === "needs"}
          />
          <Row label="Stunting" value={formatPercent(region.stuntingRate, 1)} />
          <Row label="Cakupan" value={formatPercent(region.coverage, 1)} />
          <Row label="Titik layan" value={formatNumber(region.outlets)} />
        </dl>
      ) : (
        <p className="text-muted-foreground mt-1 text-xs">
          Belum ada data wilayah.
        </p>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "tnum text-right",
          highlight ? "font-semibold" : "font-medium",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
