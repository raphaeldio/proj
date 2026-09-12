import type {
  ActivityItem,
  EsgSummary,
  Product,
  Region,
  ReportTemplate,
  RolloutPhase,
  SalesMonth,
  SalesSummary,
  SupplyChainData,
} from "@/data/types";

import { regions, rolloutPhases } from "@/data/regions";
import {
  activityFeed,
  channelBreakdown,
  salesSeries,
  salesSummary,
} from "@/data/sales";
import { products } from "@/data/products";
import { esgSummary, reportTemplates } from "@/data/esg";
import { supplyChain } from "@/data/supply-chain";

/**
 * Lapisan akses data. Komponen tidak pernah mengimpor src/data langsung —
 * selalu lewat hook yang membungkus fungsi di sini.
 *
 * Saat backend nyata siap, ganti isi setiap fungsi dengan fetch ke endpoint
 * yang sesuai. Bentuk kembaliannya sudah sama, jadi tidak ada komponen yang
 * perlu disentuh.
 *
 *   export async function getRegions() {
 *     const res = await fetch("/api/regions");
 *     if (!res.ok) throw new Error("Gagal memuat data wilayah");
 *     return res.json() as Promise<Region[]>;
 *   }
 */

const delay = (ms = 240) => new Promise((r) => setTimeout(r, ms));

export interface ProvinceFeature {
  type: "Feature";
  properties: { code: string; name: string; island: string };
  geometry: GeoJSON.Geometry;
}

export interface ProvinceCollection {
  type: "FeatureCollection";
  features: ProvinceFeature[];
}

export async function getRegions(): Promise<Region[]> {
  await delay();
  return regions;
}

export async function getRolloutPhases(): Promise<RolloutPhase[]> {
  await delay(180);
  return rolloutPhases;
}

/**
 * Berkas peta diimpor secara dinamis agar ~139 KB geometri tidak ikut
 * terunduh sebelum ada yang benar-benar merender peta.
 */
async function loadGeo(): Promise<ProvinceCollection> {
  const mod = await import("@/data/geo/indonesia-provinces.geo.json");
  return mod.default as unknown as ProvinceCollection;
}

export async function getProvinceGeo(): Promise<ProvinceCollection> {
  await delay(120);
  return loadGeo();
}

export async function getSalesSeries(): Promise<SalesMonth[]> {
  await delay();
  return salesSeries;
}

export async function getSalesSummary(): Promise<SalesSummary> {
  await delay(200);
  return salesSummary;
}

export async function getChannelBreakdown() {
  await delay(180);
  return channelBreakdown;
}

export async function getActivityFeed(): Promise<ActivityItem[]> {
  await delay(220);
  return activityFeed;
}

export async function getProducts(): Promise<Product[]> {
  await delay(180);
  return products;
}

export async function getEsgSummary(): Promise<EsgSummary> {
  await delay(260);
  return esgSummary;
}

export async function getReportTemplates(): Promise<ReportTemplate[]> {
  await delay(160);
  return reportTemplates;
}

export async function getSupplyChain(): Promise<SupplyChainData> {
  await delay(280);
  return supplyChain;
}

/* ============================================================
   Pemeriksaan konsistensi data benih.
   Dijalankan sekali saat pengembangan. Angka yang saling
   bertentangan di layar jauh lebih sulit ditemukan daripada
   gagal lebih awal di konsol.
   ============================================================ */

export async function validateSeedData(): Promise<string[]> {
  const problems: string[] = [];

  const geo = await loadGeo();
  const geoCodes = new Set(geo.features.map((f) => f.properties.code));
  const regionIds = new Set(regions.map((r) => r.id));

  for (const id of regionIds) {
    if (!geoCodes.has(id)) {
      problems.push(`Wilayah ${id} tidak punya geometri di berkas peta.`);
    }
  }
  for (const code of geoCodes) {
    if (!regionIds.has(code)) {
      problems.push(`Geometri ${code} tidak punya data wilayah.`);
    }
  }

  const totalRegionUnits = regions.reduce((a, r) => a + r.unitsSoldYtd, 0);
  const series2026 = salesSeries.filter((m) => m.month.startsWith("2026"));
  const totalSeriesUnits = series2026.reduce((a, m) => a + m.units, 0);
  if (totalRegionUnits !== totalSeriesUnits) {
    problems.push(
      `Unit YTD tidak cocok: wilayah ${totalRegionUnits} vs deret bulanan ${totalSeriesUnits}.`,
    );
  }

  const totalRegionRevenue = regions.reduce((a, r) => a + r.revenueYtd, 0);
  const totalSeriesRevenue = series2026.reduce((a, m) => a + m.revenue, 0);
  if (totalRegionRevenue !== totalSeriesRevenue) {
    problems.push(
      `Pendapatan YTD tidak cocok: wilayah ${totalRegionRevenue} vs deret bulanan ${totalSeriesRevenue}.`,
    );
  }

  const totalProductUnits = products.reduce((a, p) => a + p.unitsSoldYtd, 0);
  if (totalProductUnits !== totalRegionUnits) {
    problems.push(
      `Unit per produk (${totalProductUnits}) tidak menjumlah ke total wilayah (${totalRegionUnits}).`,
    );
  }

  for (const m of salesSeries) {
    const sum = Object.values(m.byChannel).reduce((a, b) => a + b, 0);
    if (sum !== m.units) {
      problems.push(`Bauran kanal ${m.month} berjumlah ${sum}, bukan ${m.units}.`);
    }
  }

  const productIds = new Set(products.map((p) => p.id));
  const supplierIds = new Set(supplyChain.suppliers.map((s) => s.id));
  for (const b of supplyChain.batches) {
    if (!productIds.has(b.productId))
      problems.push(`Batch ${b.id} merujuk produk tidak dikenal: ${b.productId}`);
    if (!supplierIds.has(b.supplierId))
      problems.push(`Batch ${b.id} merujuk pemasok tidak dikenal: ${b.supplierId}`);
    if (!regionIds.has(b.destinationRegionId))
      problems.push(
        `Batch ${b.id} merujuk wilayah tujuan tidak dikenal: ${b.destinationRegionId}`,
      );
  }
  for (const s of supplyChain.suppliers) {
    if (!regionIds.has(s.regionId))
      problems.push(`Pemasok ${s.id} merujuk wilayah tidak dikenal: ${s.regionId}`);
  }
  for (const w of supplyChain.warehouses) {
    if (!regionIds.has(w.regionId))
      problems.push(`Gudang ${w.id} merujuk wilayah tidak dikenal: ${w.regionId}`);
  }
  for (const a of supplyChain.alerts) {
    if (a.batchId && !supplyChain.batches.some((b) => b.id === a.batchId))
      problems.push(`Peringatan ${a.id} merujuk batch tidak dikenal: ${a.batchId}`);
  }
  for (const a of activityFeed) {
    if (a.regionId && !regionIds.has(a.regionId))
      problems.push(`Aktivitas ${a.id} merujuk wilayah tidak dikenal: ${a.regionId}`);
  }

  return problems;
}
