import {
  Award,
  Factory,
  Handshake,
  MapPin,
  Truck,
  type LucideIcon,
} from "lucide-react";

import type { ActivityItem } from "@/data/types";
import { SectionCard } from "@/components/common/section-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useActivityFeed } from "@/hooks/use-data";
import { formatRelative } from "@/lib/format";
import { PASTEL_CLASS, type PastelKey } from "@/lib/palette";
import { cn } from "@/lib/utils";

const ICON: Record<ActivityItem["type"], { icon: LucideIcon; color: PastelKey }> =
  {
    pengiriman: { icon: Truck, color: "sky" },
    titik_layan: { icon: MapPin, color: "sage" },
    mitra: { icon: Handshake, color: "lilac" },
    produksi: { icon: Factory, color: "butter" },
    sertifikasi: { icon: Award, color: "aqua" },
  };

export function ActivityFeed() {
  const { data, isLoading } = useActivityFeed();

  return (
    <SectionCard title="Aktivitas Terbaru" description="Tujuh hari terakhir">
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : (
        <ul className="space-y-4">
          {(data ?? []).map((a) => {
            const { icon: Icon, color } = ICON[a.type];
            const c = PASTEL_CLASS[color];
            return (
              <li key={a.id} className="flex gap-3">
                <span
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-lg border",
                    c.soft,
                    c.ink,
                    c.border,
                  )}
                >
                  <Icon className="size-4" strokeWidth={1.75} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-snug font-medium">{a.title}</p>
                  <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
                    {a.detail}
                  </p>
                  <p className="text-muted-foreground mt-1 text-[11px]">
                    {formatRelative(a.timestamp)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </SectionCard>
  );
}
