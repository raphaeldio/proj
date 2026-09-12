/**
 * Pemetaan semantik warna. Komponen TIDAK boleh memilih warna ad-hoc —
 * ambil dari sini supaya arti sebuah warna sama di peta, chart, dan badge.
 *
 * Pastel dipakai sebagai warna kategori data. Varian "-ink" adalah versi
 * gelap dari hue yang sama, untuk teks atau garis di atas fill pastel.
 */

export type PastelKey =
  | "butter"
  | "peach"
  | "rose"
  | "blush"
  | "lilac"
  | "peri"
  | "sky"
  | "aqua"
  | "sage"
  | "lime"
  | "slate";

/** Nilai CSS untuk SVG dan Recharts (fill / stroke). */
export const pastel = (key: PastelKey) => `var(--p-${key})`;
export const pastelInk = (key: PastelKey) => `var(--p-${key}-ink)`;

/**
 * Kelas Tailwind harus berupa literal agar terdeteksi scanner, jadi
 * ditulis lengkap di sini dan tidak pernah dirangkai secara dinamis.
 */
export const PASTEL_CLASS: Record<
  PastelKey,
  { soft: string; ink: string; border: string; dot: string }
> = {
  butter: {
    soft: "bg-p-butter/30",
    ink: "text-p-butter-ink",
    border: "border-p-butter/50",
    dot: "bg-p-butter",
  },
  peach: {
    soft: "bg-p-peach/30",
    ink: "text-p-peach-ink",
    border: "border-p-peach/50",
    dot: "bg-p-peach",
  },
  rose: {
    soft: "bg-p-rose/30",
    ink: "text-p-rose-ink",
    border: "border-p-rose/50",
    dot: "bg-p-rose",
  },
  blush: {
    soft: "bg-p-blush/30",
    ink: "text-p-blush-ink",
    border: "border-p-blush/50",
    dot: "bg-p-blush",
  },
  lilac: {
    soft: "bg-p-lilac/30",
    ink: "text-p-lilac-ink",
    border: "border-p-lilac/50",
    dot: "bg-p-lilac",
  },
  peri: {
    soft: "bg-p-peri/30",
    ink: "text-p-peri-ink",
    border: "border-p-peri/50",
    dot: "bg-p-peri",
  },
  sky: {
    soft: "bg-p-sky/30",
    ink: "text-p-sky-ink",
    border: "border-p-sky/50",
    dot: "bg-p-sky",
  },
  aqua: {
    soft: "bg-p-aqua/30",
    ink: "text-p-aqua-ink",
    border: "border-p-aqua/50",
    dot: "bg-p-aqua",
  },
  sage: {
    soft: "bg-p-sage/30",
    ink: "text-p-sage-ink",
    border: "border-p-sage/50",
    dot: "bg-p-sage",
  },
  lime: {
    soft: "bg-p-lime/30",
    ink: "text-p-lime-ink",
    border: "border-p-lime/50",
    dot: "bg-p-lime",
  },
  slate: {
    soft: "bg-p-slate/40",
    ink: "text-p-slate-ink",
    border: "border-p-slate/60",
    dot: "bg-p-slate",
  },
};

/* ---------- Pemetaan semantik ---------- */

export const REGION_STATUS_COLOR = {
  aktif: "sage",
  perintis: "aqua",
  prioritas: "peach",
  belum: "slate",
} as const satisfies Record<string, PastelKey>;

export const REGION_STATUS_LABEL = {
  aktif: "Distribusi Aktif",
  perintis: "Rintisan",
  prioritas: "Prioritas Berikutnya",
  belum: "Belum Terjangkau",
} as const;

export const SUPPLY_STATUS_COLOR = {
  normal: "sage",
  perhatian: "butter",
  kritis: "rose",
} as const satisfies Record<string, PastelKey>;

export const SUPPLY_STATUS_LABEL = {
  normal: "Normal",
  perhatian: "Perlu Perhatian",
  kritis: "Kritis",
} as const;

export const ESG_PILLAR_COLOR = {
  lingkungan: "sage",
  sosial: "sky",
  tata_kelola: "lilac",
} as const satisfies Record<string, PastelKey>;

export const ESG_PILLAR_LABEL = {
  lingkungan: "Lingkungan",
  sosial: "Sosial",
  tata_kelola: "Tata Kelola",
} as const;

export const INDICATOR_STATUS_COLOR = {
  tercapai: "sage",
  berjalan: "sky",
  tertinggal: "peach",
} as const satisfies Record<string, PastelKey>;

export const ALERT_SEVERITY_COLOR = {
  info: "sky",
  peringatan: "butter",
  kritis: "rose",
} as const satisfies Record<string, PastelKey>;

export const CHANNEL_COLOR = {
  posyandu: "sage",
  koperasi: "sky",
  ritel: "peach",
  program_pemerintah: "lilac",
  online: "butter",
} as const satisfies Record<string, PastelKey>;

export const CHANNEL_LABEL = {
  posyandu: "Posyandu & Puskesmas",
  koperasi: "Koperasi Desa",
  ritel: "Ritel Modern",
  program_pemerintah: "Program Pemerintah",
  online: "Daring",
} as const;

/** Urutan seri untuk chart multi-kategori yang tidak punya arti semantik. */
export const SERIES_ORDER: PastelKey[] = [
  "sage",
  "sky",
  "peach",
  "lilac",
  "butter",
  "peri",
  "aqua",
  "blush",
];

/**
 * Skala choropleth untuk mode "Indeks Kebutuhan": makin tinggi indeks,
 * makin pekat. Memakai satu hue (peach) agar terbaca sebagai urutan,
 * bukan sebagai kategori terpisah.
 */
export function needsScaleColor(index: number): string {
  if (index >= 80) return "var(--p-rose)";
  if (index >= 65) return "var(--p-peach)";
  if (index >= 50) return "var(--p-butter)";
  if (index >= 35) return "var(--p-lime)";
  return "var(--p-sage)";
}

export const NEEDS_SCALE_STOPS = [
  { label: "Sangat tinggi", min: 80, color: "var(--p-rose)" },
  { label: "Tinggi", min: 65, color: "var(--p-peach)" },
  { label: "Sedang", min: 50, color: "var(--p-butter)" },
  { label: "Rendah", min: 35, color: "var(--p-lime)" },
  { label: "Sangat rendah", min: 0, color: "var(--p-sage)" },
];
