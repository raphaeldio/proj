/**
 * Formatter locale id-ID terpusat.
 * Jangan panggil toLocaleString langsung di komponen — pakai helper di sini
 * supaya format angka konsisten di seluruh aplikasi.
 */

const idr = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const decimal = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 });

const decimal1 = new Intl.NumberFormat("id-ID", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function formatIDR(value: number): string {
  return idr.format(value);
}

/** Rupiah ringkas: 127,3 M / 4,2 jt — untuk KPI dan sumbu chart. */
export function formatIDRCompact(value: number): string {
  if (Math.abs(value) >= 1_000_000_000_000)
    return `Rp ${decimal1.format(value / 1_000_000_000_000)} T`;
  if (Math.abs(value) >= 1_000_000_000)
    return `Rp ${decimal1.format(value / 1_000_000_000)} M`;
  if (Math.abs(value) >= 1_000_000)
    return `Rp ${decimal1.format(value / 1_000_000)} jt`;
  if (Math.abs(value) >= 1_000)
    return `Rp ${decimal1.format(value / 1_000)} rb`;
  return idr.format(value);
}

/** Angka ringkas tanpa mata uang: 284,5 rb / 1,2 jt */
export function formatCompact(value: number): string {
  if (Math.abs(value) >= 1_000_000_000)
    return `${decimal1.format(value / 1_000_000_000)} M`;
  if (Math.abs(value) >= 1_000_000)
    return `${decimal1.format(value / 1_000_000)} jt`;
  if (Math.abs(value) >= 10_000)
    return `${decimal1.format(value / 1_000)} rb`;
  return decimal.format(value);
}

export function formatNumber(value: number): string {
  return decimal.format(value);
}

export function formatPercent(value: number, digits = 0): string {
  return `${new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)}%`;
}

/** Delta bertanda untuk badge KPI: +18,4% */
export function formatDelta(value: number, digits = 1): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)}%`;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

/** "3 hari lalu" — untuk feed aktivitas dan peringatan. */
export function formatRelative(iso: string, now = new Date()): string {
  const diffMs = now.getTime() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 60) return `${Math.max(mins, 1)} menit lalu`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} hari lalu`;
  const months = Math.round(days / 30);
  return `${months} bulan lalu`;
}

/** "Jan", "Feb" dari "2026-01" — label sumbu chart. */
export function monthLabel(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  return new Intl.DateTimeFormat("id-ID", { month: "short" }).format(
    new Date(y, m - 1, 1),
  );
}

export function monthLabelLong(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(new Date(y, m - 1, 1));
}
