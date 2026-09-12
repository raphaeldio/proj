import { cn } from "@/lib/utils";
import { PASTEL_CLASS, type PastelKey } from "@/lib/palette";

interface StatusBadgeProps {
  color: PastelKey;
  children: React.ReactNode;
  /** Titik warna di depan label — membantu saat teks pendek. */
  dot?: boolean;
  className?: string;
}

/**
 * Badge kategori. Warnanya selalu datang dari pemetaan semantik di
 * lib/palette.ts, tidak pernah dipilih langsung di tempat pakai.
 */
export function StatusBadge({
  color,
  children,
  dot = true,
  className,
}: StatusBadgeProps) {
  const c = PASTEL_CLASS[color];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        c.soft,
        c.ink,
        c.border,
        className,
      )}
    >
      {dot && (
        <span className={cn("size-1.5 shrink-0 rounded-full", c.dot)} aria-hidden />
      )}
      {children}
    </span>
  );
}
