import { Info } from "lucide-react";
import { DATA_DISCLAIMER } from "@/lib/brand";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("mb-6", className)}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
          <p className="text-muted-foreground mt-1.5 text-sm">{description}</p>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <DataDisclaimer className="mt-4" />
    </div>
  );
}

/**
 * Penanda wajib di setiap halaman dashboard.
 * Laporan yang tampak resmi tetapi berisi angka simulasi bisa menyesatkan
 * pembaca, jadi penanda ini tidak boleh dihilangkan selama data masih benih.
 */
export function DataDisclaimer({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "text-muted-foreground bg-muted/60 inline-flex items-start gap-2 rounded-lg border px-3 py-2 text-xs",
        className,
      )}
    >
      <Info className="mt-px size-3.5 shrink-0" strokeWidth={1.75} />
      <span>{DATA_DISCLAIMER}</span>
    </p>
  );
}
