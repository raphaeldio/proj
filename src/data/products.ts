import type { Product, PackagingType } from "./types";
import { TOTAL_UNITS_YTD } from "./regions";

/**
 * Lima varian taburan. Semuanya kering, tidak perlu rantai dingin, dan
 * ditaburkan langsung ke pangan pokok yang sudah dimasak.
 *
 * AKG yang dipakai sebagai acuan rdaPercent adalah anak usia 4-6 tahun.
 */

export const PACKAGING_LABEL: Record<PackagingType, string> = {
  kertas_kraft_berlapis_lilin_lebah: "Kertas kraft berlapis lilin lebah",
  daun_lontar_laminasi_pati: "Anyaman daun lontar laminasi pati",
  kompos_pati_jagung: "Film pati jagung terkompos",
};

export const PACKAGING_DETAIL: Record<
  PackagingType,
  { decomposeMonths: number; note: string }
> = {
  kertas_kraft_berlapis_lilin_lebah: {
    decomposeMonths: 3,
    note: "Terurai di komposter rumah tangga dalam 3 bulan. Lilin lebah dari peternak mitra di Sumbawa.",
  },
  daun_lontar_laminasi_pati: {
    decomposeMonths: 5,
    note: "Dianyam perajin di Timor dan Rote, memberi pendapatan tambahan di wilayah fase 1.",
  },
  kompos_pati_jagung: {
    decomposeMonths: 6,
    note: "Untuk sachet satuan. Terkompos industrial, bukan untuk dibuang ke tanah terbuka.",
  },
};

/** Porsi penjualan per varian. Total harus 1. */
const SHARES = [0.31, 0.22, 0.188, 0.16, 0.122];

interface ProductSeed extends Omit<Product, "unitsSoldYtd"> {}

const SEEDS: ProductSeed[] = [
  {
    id: "kelor-ikan",
    name: "Tabur Kelor Ikan",
    tagline: "Zat besi dan kalsium untuk pertumbuhan",
    description:
      "Daun kelor kering, ikan teri, dan wijen sangrai yang digiling kasar. Rasanya gurih asin sehingga diterima anak tanpa perlu dibujuk, dan menutup kebutuhan zat besi yang paling sering kurang pada pola makan berbasis nasi putih.",
    micronutrients: [
      { name: "Zat Besi", amountMg: 6.4, rdaPercent: 64 },
      { name: "Kalsium", amountMg: 210, rdaPercent: 21 },
      { name: "Zinc", amountMg: 3.1, rdaPercent: 62 },
      { name: "Vitamin A", amountMg: 0.28, rdaPercent: 62 },
    ],
    basePairing: ["Nasi", "Bubur", "Jagung"],
    pricePerSachet: 3_400,
    gramsPerSachet: 8,
    shelfLifeMonths: 12,
    packaging: "kertas_kraft_berlapis_lilin_lebah",
  },
  {
    id: "kacang-merah",
    name: "Tabur Kacang Merah",
    tagline: "Protein nabati dan folat",
    description:
      "Kacang merah dan kedelai yang disangrai lalu dicampur bawang goreng. Dirancang untuk mendampingi kentang dan singkong yang padat energi tetapi miskin protein.",
    micronutrients: [
      { name: "Protein", amountMg: 2_100, rdaPercent: 16 },
      { name: "Folat", amountMg: 0.12, rdaPercent: 60 },
      { name: "Zinc", amountMg: 2.8, rdaPercent: 56 },
      { name: "Zat Besi", amountMg: 4.1, rdaPercent: 41 },
    ],
    basePairing: ["Kentang", "Singkong", "Nasi"],
    pricePerSachet: 3_600,
    gramsPerSachet: 8,
    shelfLifeMonths: 12,
    packaging: "kertas_kraft_berlapis_lilin_lebah",
  },
  {
    id: "rumput-laut",
    name: "Tabur Rumput Laut",
    tagline: "Yodium untuk wilayah pesisir dan pegunungan",
    description:
      "Rumput laut kering, ikan tongkol suwir, dan jagung sangrai. Diformulasikan untuk daerah dengan gangguan akibat kekurangan yodium, memakai bahan baku dari koperasi nelayan setempat.",
    micronutrients: [
      { name: "Yodium", amountMg: 0.09, rdaPercent: 75 },
      { name: "Zat Besi", amountMg: 3.8, rdaPercent: 38 },
      { name: "Vitamin B12", amountMg: 0.0014, rdaPercent: 70 },
      { name: "Zinc", amountMg: 2.2, rdaPercent: 44 },
    ],
    basePairing: ["Nasi", "Singkong", "Sagu"],
    pricePerSachet: 3_500,
    gramsPerSachet: 8,
    shelfLifeMonths: 10,
    packaging: "daun_lontar_laminasi_pati",
  },
  {
    id: "labu-wijen",
    name: "Tabur Labu Wijen",
    tagline: "Vitamin A dan lemak sehat",
    description:
      "Labu kuning kering, wijen, dan kacang tanah. Warnanya oranye terang dan rasanya manis gurih, jadi cocok untuk anak yang masih dalam masa pengenalan makanan padat.",
    micronutrients: [
      { name: "Vitamin A", amountMg: 0.41, rdaPercent: 91 },
      { name: "Zinc", amountMg: 2.4, rdaPercent: 48 },
      { name: "Vitamin E", amountMg: 3.2, rdaPercent: 53 },
      { name: "Kalsium", amountMg: 180, rdaPercent: 18 },
    ],
    basePairing: ["Singkong", "Ubi", "Bubur"],
    pricePerSachet: 3_300,
    gramsPerSachet: 8,
    shelfLifeMonths: 12,
    packaging: "kompos_pati_jagung",
  },
  {
    id: "tempe-bawang",
    name: "Tabur Tempe Bawang",
    tagline: "Vitamin B12 dari fermentasi",
    description:
      "Tempe kering yang disangrai bersama bawang putih dan sedikit cabai. Varian paling akrab di lidah orang dewasa, dipakai sebagai pintu masuk agar satu keluarga memakai produk yang sama.",
    micronutrients: [
      { name: "Vitamin B12", amountMg: 0.0018, rdaPercent: 90 },
      { name: "Protein", amountMg: 2_400, rdaPercent: 18 },
      { name: "Zinc", amountMg: 2.6, rdaPercent: 52 },
      { name: "Folat", amountMg: 0.08, rdaPercent: 40 },
    ],
    basePairing: ["Nasi", "Kentang", "Jagung"],
    pricePerSachet: 3_450,
    gramsPerSachet: 8,
    shelfLifeMonths: 12,
    packaging: "kertas_kraft_berlapis_lilin_lebah",
  },
];

/**
 * Unit per varian diturunkan dari total nasional supaya penjumlahannya
 * selalu cocok. Sisa pembulatan dibebankan ke varian terakhir.
 */
const allocated = SHARES.slice(0, -1).map((s) =>
  Math.round(TOTAL_UNITS_YTD * s),
);
const remainder = TOTAL_UNITS_YTD - allocated.reduce((a, b) => a + b, 0);
const UNITS = [...allocated, remainder];

export const products: Product[] = SEEDS.map((s, i) => ({
  ...s,
  unitsSoldYtd: UNITS[i],
}));

export const productById = new Map(products.map((p) => [p.id, p]));

/** Semua pangan pokok yang tercakup oleh setidaknya satu varian. */
export const stapleFoods = Array.from(
  new Set(products.flatMap((p) => p.basePairing)),
).sort();
