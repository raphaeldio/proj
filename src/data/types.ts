/* ============================================================
   Model domain NusaTabur
   Bentuk tipe di sini sengaja dibuat seperti response API agar
   perpindahan ke backend nyata tidak mengubah komponen.
   ============================================================ */

/* ---------- Wilayah & distribusi ---------- */

export type RegionStatus = "aktif" | "perintis" | "prioritas" | "belum";

export interface Region {
  /** Kode provinsi, harus cocok dengan properti di TopoJSON peta. */
  id: string;
  name: string;
  island: string;
  status: RegionStatus;
  /** Fase rollout bertahap: 1 = paling mendesak. */
  phase: 1 | 2 | 3;
  /** Populasi sasaran: anak balita + ibu hamil. */
  targetPopulation: number;
  stuntingRate: number;
  /** Skor prioritas 0-100. Komposit stunting, akses pangan, daya beli. */
  nutritionGapIndex: number;
  /** 1 = mudah dijangkau, 5 = sangat sulit (kepulauan, pegunungan). */
  logisticsDifficulty: 1 | 2 | 3 | 4 | 5;
  /** Titik layan aktif: posyandu, koperasi, warung mitra. */
  outlets: number;
  /** Persen populasi sasaran yang sudah terjangkau. */
  coverage: number;
  unitsSoldYtd: number;
  revenueYtd: number;
  partners: string[];
  lastShipment: string | null;
}

/* ---------- Penjualan ---------- */

export type Channel =
  | "posyandu"
  | "koperasi"
  | "ritel"
  | "program_pemerintah"
  | "online";

export interface SalesMonth {
  /** Format "2026-01". */
  month: string;
  units: number;
  revenue: number;
  targetUnits: number;
  byChannel: Record<Channel, number>;
}

export interface SalesSummary {
  unitsYtd: number;
  unitsDelta: number;
  revenueYtd: number;
  revenueDelta: number;
  activeRegions: number;
  activeRegionsDelta: number;
  beneficiaries: number;
  beneficiariesDelta: number;
  averageOrderValue: number;
  outletCount: number;
}

export interface ActivityItem {
  id: string;
  type: "pengiriman" | "titik_layan" | "mitra" | "produksi" | "sertifikasi";
  title: string;
  detail: string;
  regionId: string | null;
  timestamp: string;
}

/* ---------- Produk ---------- */

export type PackagingType =
  | "kertas_kraft_berlapis_lilin_lebah"
  | "daun_lontar_laminasi_pati"
  | "kompos_pati_jagung";

export interface Micronutrient {
  name: string;
  amountMg: number;
  /** Persen Angka Kecukupan Gizi harian anak 4-6 tahun. */
  rdaPercent: number;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  micronutrients: Micronutrient[];
  /** Pangan pokok yang cocok ditaburi varian ini. */
  basePairing: string[];
  pricePerSachet: number;
  gramsPerSachet: number;
  shelfLifeMonths: number;
  packaging: PackagingType;
  unitsSoldYtd: number;
}

/* ---------- ESG ---------- */

export type EsgPillarKey = "lingkungan" | "sosial" | "tata_kelola";
export type EsgFramework = "GRI" | "SDG" | "OJK" | "ISSB";
export type IndicatorStatus = "tercapai" | "berjalan" | "tertinggal";

export interface EsgIndicator {
  code: string;
  name: string;
  value: number;
  unit: string;
  target: number;
  status: IndicatorStatus;
  framework: EsgFramework;
  /** Arah yang diinginkan: true bila nilai lebih tinggi lebih baik. */
  higherIsBetter: boolean;
  note?: string;
}

export interface EsgPillar {
  pillar: EsgPillarKey;
  score: number;
  targetScore: number;
  grade: string;
  summary: string;
  indicators: EsgIndicator[];
}

export interface EsgSummary {
  compositeScore: number;
  compositeGrade: string;
  lastVerified: string;
  plasticAvoidedKg: number;
  carbonAvoidedTco2e: number;
  beneficiaries: number;
  farmerPartners: number;
  traceabilityRate: number;
  pillars: EsgPillar[];
}

export interface ReportSection {
  order: string;
  title: string;
  status: "siap" | "proses";
}

export interface ReportTemplate {
  id: string;
  name: string;
  framework: string;
  description: string;
  pages: string;
  formats: string[];
  audience: string;
  sections: ReportSection[];
}

/* ---------- Rantai pasok ---------- */

export type StageKey =
  | "petani"
  | "pengolahan"
  | "fortifikasi"
  | "pengemasan"
  | "gudang"
  | "distribusi"
  | "titik_layan";

export type SupplyStatus = "normal" | "perhatian" | "kritis";

export interface SupplyStage {
  key: StageKey;
  name: string;
  description: string;
  status: SupplyStatus;
  throughputKg: number;
  capacityPct: number;
  leadTimeDays: number;
  yieldPct: number;
  activeBatches: number;
}

export interface BatchEvent {
  stage: StageKey;
  timestamp: string;
  location: string;
  note: string;
  status: "selesai" | "berjalan" | "menunggu";
}

export interface QcCheck {
  name: string;
  result: "lulus" | "gagal" | "menunggu";
  value: string;
}

export interface Batch {
  id: string;
  productId: string;
  supplierId: string;
  quantityKg: number;
  currentStage: StageKey;
  destinationRegionId: string;
  eta: string;
  status: SupplyStatus;
  riskFlags: string[];
  timeline: BatchEvent[];
  qcChecks: QcCheck[];
}

export interface Supplier {
  id: string;
  name: string;
  commodity: string;
  regionId: string;
  farmers: number;
  certifications: string[];
  onTimeRate: number;
  qualityScore: number;
  /** Premi di atas harga pasar yang dibayarkan ke petani, persen. */
  fairPricePremium: number;
  status: SupplyStatus;
}

export interface SupplyAlert {
  id: string;
  severity: "info" | "peringatan" | "kritis";
  stage: StageKey;
  title: string;
  message: string;
  batchId: string | null;
  createdAt: string;
}

export interface WarehouseStock {
  id: string;
  name: string;
  regionId: string;
  stockUnits: number;
  capacityUnits: number;
  /** Perkiraan hari persediaan tersisa pada laju keluar saat ini. */
  daysOfCover: number;
  status: SupplyStatus;
}

export interface SupplyChainData {
  stages: SupplyStage[];
  batches: Batch[];
  suppliers: Supplier[];
  alerts: SupplyAlert[];
  warehouses: WarehouseStock[];
}

/* ---------- Rencana rollout ---------- */

export interface RolloutPhase {
  phase: 1 | 2 | 3;
  name: string;
  period: string;
  objective: string;
  regionIds: string[];
  targetOutlets: number;
  targetBeneficiaries: number;
  status: "berjalan" | "persiapan" | "rencana";
}
