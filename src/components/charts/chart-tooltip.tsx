export interface TooltipRow {
  name: string;
  value: string;
  color?: string;
}

/**
 * Recharts menyuntikkan active/payload/label ke komponen `content`, tetapi
 * bentuk tipenya berubah antar versi mayor. Prop-nya dideklarasikan sendiri
 * di sini agar tidak terikat pada tipe internal Recharts.
 */
interface Props {
  active?: boolean;
  payload?: readonly any[];
  label?: unknown;
  /** Ubah payload recharts jadi baris yang siap ditampilkan. */
  rows: (payload: readonly any[]) => TooltipRow[];
  titleOf?: (label: unknown, payload: readonly any[]) => string;
}

/**
 * Tooltip seragam untuk seluruh chart. Recharts memberi payload mentah,
 * jadi pemformatan angka diserahkan ke pemanggil lewat `rows`.
 */
export function ChartTooltip({ active, payload, label, rows, titleOf }: Props) {
  if (!active || !payload || payload.length === 0) return null;

  const title = titleOf ? titleOf(label, payload) : String(label ?? "");
  const items = rows(payload);

  return (
    <div className="bg-popover text-popover-foreground min-w-40 rounded-xl border p-3 shadow-lg">
      {title && <p className="mb-2 text-xs font-semibold">{title}</p>}
      <ul className="space-y-1">
        {items.map((r) => (
          <li
            key={r.name}
            className="flex items-baseline justify-between gap-4 text-xs"
          >
            <span className="text-muted-foreground flex items-center gap-1.5">
              {r.color && (
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ background: r.color }}
                  aria-hidden
                />
              )}
              {r.name}
            </span>
            <span className="tnum font-semibold">{r.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Properti sumbu yang dipakai berulang di semua chart. */
export const axisProps = {
  stroke: "var(--border)",
  tick: { fill: "var(--muted-foreground)", fontSize: 11 },
  tickLine: false,
  axisLine: false,
} as const;
