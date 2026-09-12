import type { ActivityItem, Channel, SalesMonth, SalesSummary } from "./types";
import {
  TOTAL_BENEFICIARIES,
  TOTAL_OUTLETS,
  TOTAL_REVENUE_YTD,
  TOTAL_UNITS_YTD,
  regions,
} from "./regions";

/**
 * Deret bulanan Januari 2025 - September 2026.
 *
 * Bulan-bulan 2026 dinormalisasi agar penjumlahannya PERSIS sama dengan
 * TOTAL_UNITS_YTD dan TOTAL_REVENUE_YTD dari regions.ts. Tanpa ini, angka
 * KPI dan angka per wilayah akan saling bertentangan di layar.
 */

const MONTHS_2025 = [
  "2025-01", "2025-02", "2025-03", "2025-04", "2025-05", "2025-06",
  "2025-07", "2025-08", "2025-09", "2025-10", "2025-11", "2025-12",
];
const MONTHS_2026 = [
  "2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06",
  "2026-07", "2026-08", "2026-09",
];

/** Kurva pertumbuhan; masing-masing berjumlah 1. */
const W_2025 = [
  0.048, 0.052, 0.058, 0.063, 0.069, 0.075,
  0.082, 0.089, 0.096, 0.105, 0.117, 0.146,
];
const W_2026 = [0.085, 0.09, 0.096, 0.102, 0.108, 0.114, 0.121, 0.13, 0.154];

const TOTAL_UNITS_2025 = 16_800_000;

/** Rasio aktual terhadap target — ada bulan meleset, ada yang terlampaui. */
const TARGET_RATIO = [
  1.04, 1.01, 0.97, 1.02, 1.06, 0.99, 0.95, 1.03, 1.07, 1.01, 0.98, 0.96,
  1.05, 1.02, 0.98, 0.94, 1.01, 1.05, 0.97, 0.99, 1.03,
];

/** Bauran kanal bergeser: posyandu menyusut, koperasi dan ritel tumbuh. */
const MIX_START: Record<Channel, number> = {
  posyandu: 0.58,
  koperasi: 0.2,
  program_pemerintah: 0.16,
  ritel: 0.04,
  online: 0.02,
};
const MIX_END: Record<Channel, number> = {
  posyandu: 0.42,
  koperasi: 0.26,
  program_pemerintah: 0.19,
  ritel: 0.08,
  online: 0.05,
};

const CHANNELS = Object.keys(MIX_START) as Channel[];

/** Bagi `total` menurut `shares`, sisa pembulatan ke porsi terbesar. */
function splitExact(total: number, shares: number[]): number[] {
  const raw = shares.map((s) => Math.round(total * s));
  const diff = total - raw.reduce((a, b) => a + b, 0);
  const largest = shares.indexOf(Math.max(...shares));
  raw[largest] += diff;
  return raw;
}

function buildYear(
  months: string[],
  weights: number[],
  totalUnits: number,
  offset: number,
): SalesMonth[] {
  const unitsPerMonth = splitExact(totalUnits, weights);
  const span = MONTHS_2025.length + MONTHS_2026.length - 1;

  return months.map((month, i) => {
    const units = unitsPerMonth[i];
    const t = (offset + i) / span;
    const shares = CHANNELS.map(
      (c) => MIX_START[c] + (MIX_END[c] - MIX_START[c]) * t,
    );
    const channelUnits = splitExact(units, shares);
    const byChannel = Object.fromEntries(
      CHANNELS.map((c, ci) => [c, channelUnits[ci]]),
    ) as Record<Channel, number>;

    return {
      month,
      units,
      revenue: 0, // diisi setelah normalisasi
      targetUnits: Math.round(units / TARGET_RATIO[offset + i]),
      byChannel,
    };
  });
}

const series2025 = buildYear(MONTHS_2025, W_2025, TOTAL_UNITS_2025, 0);
const series2026 = buildYear(
  MONTHS_2026,
  W_2026,
  TOTAL_UNITS_YTD,
  MONTHS_2025.length,
);

/** Harga jual rata-rata naik perlahan seiring bauran kanal bergeser. */
const ASP_START = 3_280;
const ASP_END = 3_540;

function applyRevenue(series: SalesMonth[], offset: number, span: number) {
  for (let i = 0; i < series.length; i++) {
    const t = (offset + i) / span;
    series[i].revenue = Math.round(
      series[i].units * (ASP_START + (ASP_END - ASP_START) * t),
    );
  }
}

const SPAN = MONTHS_2025.length + MONTHS_2026.length - 1;
applyRevenue(series2025, 0, SPAN);
applyRevenue(series2026, MONTHS_2025.length, SPAN);

// Normalisasi pendapatan 2026 agar persis sama dengan total dari regions.ts.
{
  const raw = series2026.reduce((a, m) => a + m.revenue, 0);
  const factor = TOTAL_REVENUE_YTD / raw;
  series2026.forEach((m) => {
    m.revenue = Math.round(m.revenue * factor);
  });
  const drift =
    TOTAL_REVENUE_YTD - series2026.reduce((a, m) => a + m.revenue, 0);
  series2026[series2026.length - 1].revenue += drift;
}

export const salesSeries: SalesMonth[] = [...series2025, ...series2026];

export const salesSeries2026 = series2026;

/** Periode yang sama tahun lalu (Jan-Sep 2025) untuk perhitungan delta. */
const samePeriodLastYear = series2025.slice(0, MONTHS_2026.length);
const unitsLastYear = samePeriodLastYear.reduce((a, m) => a + m.units, 0);
const revenueLastYear = samePeriodLastYear.reduce((a, m) => a + m.revenue, 0);

const pctChange = (now: number, before: number) =>
  Math.round(((now / before - 1) * 100) * 10) / 10;

export const salesSummary: SalesSummary = {
  unitsYtd: TOTAL_UNITS_YTD,
  unitsDelta: pctChange(TOTAL_UNITS_YTD, unitsLastYear),
  revenueYtd: TOTAL_REVENUE_YTD,
  revenueDelta: pctChange(TOTAL_REVENUE_YTD, revenueLastYear),
  activeRegions: regions.filter(
    (r) => r.status === "aktif" || r.status === "perintis",
  ).length,
  /** Jumlah provinsi baru yang dibuka sejak awal tahun — angka absolut. */
  activeRegionsDelta: 4,
  beneficiaries: TOTAL_BENEFICIARIES,
  beneficiariesDelta: pctChange(TOTAL_UNITS_YTD, unitsLastYear),
  averageOrderValue: Math.round(TOTAL_REVENUE_YTD / TOTAL_UNITS_YTD),
  outletCount: TOTAL_OUTLETS,
};

/** Komposisi kanal pada bulan terakhir. */
export const channelBreakdown = CHANNELS.map((channel) => {
  const last = series2026[series2026.length - 1];
  return { channel, units: last.byChannel[channel] };
}).sort((a, b) => b.units - a.units);

export const activityFeed: ActivityItem[] = [
  {
    id: "act-01",
    type: "pengiriman",
    title: "Pengiriman 120.000 sachet tiba di Waingapu",
    detail: "Batch BTC-2026-0418 diterima gudang mitra Sumba Timur, seluruh uji QC lulus.",
    regionId: "53",
    timestamp: "2026-09-11T08:20:00+08:00",
  },
  {
    id: "act-02",
    type: "titik_layan",
    title: "14 posyandu baru aktif di Kabupaten Bima",
    detail: "Pelatihan kader selesai, stok awal 8.400 sachet sudah didistribusikan.",
    regionId: "52",
    timestamp: "2026-09-10T13:05:00+08:00",
  },
  {
    id: "act-03",
    type: "mitra",
    title: "Koperasi Jagung Pohuwato menandatangani kontrak pasok",
    detail: "Komitmen 40 ton jagung per kuartal dengan premi harga 12 persen di atas pasar.",
    regionId: "75",
    timestamp: "2026-09-09T10:40:00+08:00",
  },
  {
    id: "act-04",
    type: "produksi",
    title: "Lini fortifikasi Kupang mencapai 92 persen utilisasi",
    detail: "Perlu penambahan satu sif untuk mengantisipasi permintaan kuartal keempat.",
    regionId: "53",
    timestamp: "2026-09-08T16:15:00+08:00",
  },
  {
    id: "act-05",
    type: "sertifikasi",
    title: "Sertifikasi kemasan terkompos diperbarui",
    detail: "Film pati jagung lolos uji disintegrasi ulang untuk periode 2026-2028.",
    regionId: null,
    timestamp: "2026-09-05T09:00:00+07:00",
  },
  {
    id: "act-06",
    type: "pengiriman",
    title: "Pengiriman ke Nabire tertunda tiga hari",
    detail: "Cuaca menutup jalur laut Nabire. Stok titik layan masih cukup untuk sembilan hari.",
    regionId: "92",
    timestamp: "2026-09-04T11:30:00+09:00",
  },
];

/** Sepuluh wilayah dengan penjualan tertinggi. */
export const topRegions = [...regions]
  .filter((r) => r.unitsSoldYtd > 0)
  .sort((a, b) => b.unitsSoldYtd - a.unitsSoldYtd)
  .slice(0, 8);

/** Wilayah paling membutuhkan yang belum atau baru sedikit terjangkau. */
export const priorityRegions = [...regions].sort(
  (a, b) => b.nutritionGapIndex - a.nutritionGapIndex,
);
