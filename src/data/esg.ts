import type { EsgPillar, EsgSummary, ReportTemplate } from "./types";
import { TOTAL_BENEFICIARIES, TOTAL_UNITS_YTD } from "./regions";

/**
 * PERINGATAN: seluruh angka di modul ini adalah proyeksi business plan.
 * Ini BUKAN laporan keberlanjutan terverifikasi dan tidak boleh dipakai
 * untuk pengungkapan resmi ke regulator atau investor.
 *
 * Metrik lingkungan diturunkan dari volume penjualan nyata di aplikasi ini
 * memakai faktor konversi yang ditulis eksplisit di bawah, supaya asumsinya
 * bisa diperiksa dan tidak sekadar angka yang enak dilihat.
 */

/** Laminasi plastik yang digantikan per sachet. */
const PLASTIC_PER_SACHET_G = 1.2;
/** Jejak karbon produksi laminasi plastik per kilogram. */
const CO2_PER_KG_PLASTIC = 2.7;
/** Penghematan angkutan jarak jauh berkat bahan baku lokal, per sachet. */
const CO2_LOCAL_SOURCING_PER_SACHET_KG = 0.014;

export const PLASTIC_AVOIDED_KG = Math.round(
  (TOTAL_UNITS_YTD * PLASTIC_PER_SACHET_G) / 1000,
);

export const CARBON_AVOIDED_TCO2E =
  Math.round(
    ((PLASTIC_AVOIDED_KG * CO2_PER_KG_PLASTIC +
      TOTAL_UNITS_YTD * CO2_LOCAL_SOURCING_PER_SACHET_KG) /
      1000) *
      10,
  ) / 10;

const FARMER_PARTNERS = 1_840;
const TRACEABILITY_RATE = 87.4;

const pillars: EsgPillar[] = [
  {
    pillar: "lingkungan",
    score: 84,
    targetScore: 90,
    grade: "A-",
    summary:
      "Kemasan sudah sepenuhnya bebas plastik sekali pakai. Yang masih tertinggal adalah efisiensi air pada tahap pencucian bahan baku.",
    indicators: [
      {
        code: "L1",
        name: "Kemasan bebas plastik sekali pakai",
        value: 100,
        unit: "%",
        target: 100,
        status: "tercapai",
        framework: "GRI",
        higherIsBetter: true,
        note: "Kertas kraft berlapis lilin lebah, anyaman lontar, dan film pati jagung.",
      },
      {
        code: "L2",
        name: "Plastik laminasi yang dihindari",
        value: PLASTIC_AVOIDED_KG,
        unit: "kg",
        target: 30_000,
        status: "berjalan",
        framework: "SDG",
        higherIsBetter: true,
        note: `Asumsi ${PLASTIC_PER_SACHET_G} g laminasi per sachet yang digantikan.`,
      },
      {
        code: "L3",
        name: "Emisi yang terhindarkan",
        value: CARBON_AVOIDED_TCO2E,
        unit: "tCO2e",
        target: 500,
        status: "berjalan",
        framework: "ISSB",
        higherIsBetter: true,
        note: "Gabungan penggantian plastik dan pemendekan rantai angkut bahan baku.",
      },
      {
        code: "L4",
        name: "Konsumsi air per kg produk",
        value: 9.4,
        unit: "liter",
        target: 8,
        status: "tertinggal",
        framework: "GRI",
        higherIsBetter: false,
        note: "Pencucian kelor dan rumput laut masih memakai air alir.",
      },
      {
        code: "L5",
        name: "Limbah produksi terdaur ulang",
        value: 78,
        unit: "%",
        target: 85,
        status: "berjalan",
        framework: "GRI",
        higherIsBetter: true,
      },
      {
        code: "L6",
        name: "Bahan baku dari radius 150 km",
        value: 71,
        unit: "%",
        target: 80,
        status: "berjalan",
        framework: "SDG",
        higherIsBetter: true,
      },
    ],
  },
  {
    pillar: "sosial",
    score: 88,
    targetScore: 90,
    grade: "A",
    summary:
      "Pilar terkuat. Mayoritas tenaga kerja pengemasan adalah perempuan di wilayah fase 1, dan premi harga ke petani di atas target.",
    indicators: [
      {
        code: "S1",
        name: "Penerima manfaat anak dan ibu hamil",
        value: TOTAL_BENEFICIARIES,
        unit: "orang",
        target: 200_000,
        status: "berjalan",
        framework: "SDG",
        higherIsBetter: true,
      },
      {
        code: "S2",
        name: "Petani dan nelayan mitra",
        value: FARMER_PARTNERS,
        unit: "orang",
        target: 2_500,
        status: "berjalan",
        framework: "SDG",
        higherIsBetter: true,
      },
      {
        code: "S3",
        name: "Pekerja perempuan di lini pengemasan",
        value: 64,
        unit: "%",
        target: 50,
        status: "tercapai",
        framework: "GRI",
        higherIsBetter: true,
      },
      {
        code: "S4",
        name: "Premi harga di atas harga pasar",
        value: 12.4,
        unit: "%",
        target: 10,
        status: "tercapai",
        framework: "GRI",
        higherIsBetter: true,
        note: "Dibayarkan langsung ke koperasi, bukan lewat tengkulak.",
      },
      {
        code: "S5",
        name: "Kader posyandu terlatih",
        value: 3_120,
        unit: "orang",
        target: 4_000,
        status: "berjalan",
        framework: "SDG",
        higherIsBetter: true,
      },
      {
        code: "S6",
        name: "Insiden kecelakaan kerja",
        value: 2,
        unit: "kasus",
        target: 0,
        status: "tertinggal",
        framework: "GRI",
        higherIsBetter: false,
        note: "Keduanya luka ringan di lini pengeringan Kupang, sudah ditindaklanjuti.",
      },
    ],
  },
  {
    pillar: "tata_kelola",
    score: 79,
    targetScore: 85,
    grade: "B+",
    summary:
      "Ketertelusuran batch belum mencapai target karena pencatatan di titik petani sebagian masih manual.",
    indicators: [
      {
        code: "T1",
        name: "Batch tertelusuri penuh sampai petani",
        value: TRACEABILITY_RATE,
        unit: "%",
        target: 95,
        status: "berjalan",
        framework: "ISSB",
        higherIsBetter: true,
        note: "Sisanya tercatat manual di buku koperasi dan baru direkap bulanan.",
      },
      {
        code: "T2",
        name: "Pemasok lolos audit mutu",
        value: 92,
        unit: "%",
        target: 100,
        status: "berjalan",
        framework: "GRI",
        higherIsBetter: true,
      },
      {
        code: "T3",
        name: "Sertifikasi aktif",
        value: 3,
        unit: "sertifikat",
        target: 4,
        status: "berjalan",
        framework: "OJK",
        higherIsBetter: true,
        note: "BPOM, Halal, dan HACCP aktif. ISO 22000 masih dalam proses.",
      },
      {
        code: "T4",
        name: "Pengaduan ditindaklanjuti dalam 14 hari",
        value: 96,
        unit: "%",
        target: 100,
        status: "berjalan",
        framework: "OJK",
        higherIsBetter: true,
      },
      {
        code: "T5",
        name: "Rapat dewan pengawas",
        value: 4,
        unit: "kali/tahun",
        target: 4,
        status: "tercapai",
        framework: "OJK",
        higherIsBetter: true,
      },
      {
        code: "T6",
        name: "Insiden ketidakpatuhan regulasi",
        value: 0,
        unit: "kasus",
        target: 0,
        status: "tercapai",
        framework: "GRI",
        higherIsBetter: false,
      },
    ],
  },
];

const composite =
  Math.round(
    (pillars.reduce((a, p) => a + p.score, 0) / pillars.length) * 10,
  ) / 10;

export const esgSummary: EsgSummary = {
  compositeScore: composite,
  compositeGrade: "A-",
  lastVerified: "2026-09-04",
  plasticAvoidedKg: PLASTIC_AVOIDED_KG,
  carbonAvoidedTco2e: CARBON_AVOIDED_TCO2E,
  beneficiaries: TOTAL_BENEFICIARIES,
  farmerPartners: FARMER_PARTNERS,
  traceabilityRate: TRACEABILITY_RATE,
  pillars,
};

export const reportTemplates: ReportTemplate[] = [
  {
    id: "keberlanjutan-tahunan",
    name: "Laporan Keberlanjutan Tahunan",
    framework: "Selaras GRI",
    description:
      "Pengungkapan lengkap kinerja lingkungan, sosial, dan tata kelola untuk satu tahun buku.",
    pages: "24-32 halaman",
    formats: ["PDF", "XLSX"],
    audience: "Publik, mitra pendanaan, regulator",
    sections: [
      { order: "01", title: "Profil Usaha dan Model Bisnis", status: "siap" },
      { order: "02", title: "Kinerja Ekonomi dan Distribusi Nilai", status: "siap" },
      { order: "03", title: "Kinerja Lingkungan (L1-L6)", status: "siap" },
      { order: "04", title: "Kinerja Sosial (S1-S6)", status: "siap" },
      { order: "05", title: "Kinerja Tata Kelola (T1-T6)", status: "siap" },
      { order: "06", title: "Peta Distribusi dan Cakupan Wilayah", status: "siap" },
      { order: "07", title: "Bukti Ketertelusuran Rantai Pasok", status: "proses" },
      { order: "08", title: "Pernyataan Verifikasi Pihak Ketiga", status: "proses" },
    ],
  },
  {
    id: "dampak-triwulan",
    name: "Laporan Dampak Triwulanan",
    framework: "Selaras TCFD",
    description:
      "Ringkasan kinerja distribusi dan dampak gizi per kuartal berjalan, per provinsi.",
    pages: "12-16 halaman",
    formats: ["PDF"],
    audience: "Dewan pengawas, mitra dinas kesehatan",
    sections: [
      { order: "01", title: "Ikhtisar Kuartal", status: "siap" },
      { order: "02", title: "Cakupan per Provinsi", status: "siap" },
      { order: "03", title: "Indikator Gizi Penerima Manfaat", status: "siap" },
      { order: "04", title: "Risiko Iklim dan Rantai Pasok", status: "proses" },
      { order: "05", title: "Rencana Kuartal Berikutnya", status: "siap" },
    ],
  },
  {
    id: "ringkasan-investor",
    name: "Ringkasan Investor",
    framework: "Selaras ISSB",
    description:
      "Versi ringkas untuk rapat pemegang saham dan calon pendana dampak.",
    pages: "6-8 halaman",
    formats: ["PDF"],
    audience: "Investor dampak, lembaga filantropi",
    sections: [
      { order: "01", title: "Tesis Dampak dan Ukuran Pasar", status: "siap" },
      { order: "02", title: "Kinerja Penjualan dan Unit Ekonomi", status: "siap" },
      { order: "03", title: "Skor ESG Komposit", status: "siap" },
      { order: "04", title: "Rencana Rollout Fase 2", status: "siap" },
    ],
  },
  {
    id: "kepatuhan-regulator",
    name: "Kepatuhan Regulator",
    framework: "Selaras OJK & BPOM",
    description:
      "Berkas pengungkapan keberlanjutan dan keamanan pangan untuk pengajuan ke regulator.",
    pages: "18-24 halaman",
    formats: ["PDF", "DOCX"],
    audience: "OJK, BPOM, Dinas Kesehatan Provinsi",
    sections: [
      { order: "01", title: "Identitas dan Perizinan Usaha", status: "siap" },
      { order: "02", title: "Kepatuhan Keamanan Pangan", status: "siap" },
      { order: "03", title: "Pengungkapan Keberlanjutan OJK", status: "siap" },
      { order: "04", title: "Registri Pemasok dan Audit", status: "proses" },
      { order: "05", title: "Penanganan Pengaduan Konsumen", status: "siap" },
      { order: "06", title: "Lampiran Hasil Uji Laboratorium", status: "proses" },
    ],
  },
];
