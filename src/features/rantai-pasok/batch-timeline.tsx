import { AlertTriangle, Check, CircleDot, Clock } from "lucide-react";

import type { Batch } from "@/data/types";
import { StatusBadge } from "@/components/common/status-badge";
import { STAGE_LABEL } from "@/data/supply-chain";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Jejak satu batch dari petani sampai titik layan, plus hasil uji mutu.
 * Inilah bukti ketertelusuran yang dirujuk indikator T1 di modul ESG.
 */
export function BatchTimeline({ batch }: { batch: Batch }) {
  return (
    <div className="grid gap-6 py-2 lg:grid-cols-5">
      <ol className="lg:col-span-3">
        {batch.timeline.map((e, i) => {
          const last = i === batch.timeline.length - 1;
          const Icon =
            e.status === "selesai"
              ? Check
              : e.status === "berjalan"
                ? CircleDot
                : Clock;

          return (
            <li key={e.stage} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "grid size-6 shrink-0 place-items-center rounded-full border",
                    e.status === "selesai" &&
                      "bg-p-sage/40 text-p-sage-ink border-p-sage/60",
                    e.status === "berjalan" &&
                      "bg-p-sky/40 text-p-sky-ink border-p-sky/60",
                    e.status === "menunggu" &&
                      "bg-muted text-muted-foreground border-border",
                  )}
                >
                  <Icon className="size-3.5" strokeWidth={2} />
                </span>
                {!last && (
                  <span
                    className={cn(
                      "w-px flex-1",
                      e.status === "selesai" ? "bg-p-sage" : "bg-border",
                    )}
                    aria-hidden
                  />
                )}
              </div>

              <div className={cn("min-w-0 flex-1", last ? "pb-0" : "pb-5")}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-semibold">{STAGE_LABEL[e.stage]}</p>
                  <p className="text-muted-foreground text-xs">
                    {formatDateTime(e.timestamp)}
                  </p>
                </div>
                <p className="text-muted-foreground text-xs">{e.location}</p>
                <p className="mt-1 text-sm leading-relaxed">{e.note}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="lg:col-span-2">
        <p className="mb-2.5 text-sm font-semibold">Pemeriksaan Mutu</p>
        <ul className="space-y-2">
          {batch.qcChecks.map((q) => (
            <li
              key={q.name}
              className="flex items-start justify-between gap-3 rounded-lg border p-2.5"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium">{q.name}</p>
                <p className="text-muted-foreground mt-0.5 text-xs">{q.value}</p>
              </div>
              <StatusBadge
                color={
                  q.result === "lulus"
                    ? "sage"
                    : q.result === "gagal"
                      ? "rose"
                      : "butter"
                }
                dot={false}
                className="shrink-0 capitalize"
              >
                {q.result}
              </StatusBadge>
            </li>
          ))}
        </ul>

        {batch.riskFlags.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-sm font-semibold">Penanda Risiko</p>
            <ul className="space-y-1.5">
              {batch.riskFlags.map((f) => (
                <li
                  key={f}
                  className="text-p-peach-ink flex items-start gap-2 text-xs"
                >
                  <AlertTriangle
                    className="mt-px size-3.5 shrink-0"
                    strokeWidth={1.75}
                  />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
