/**
 * Identitas brand terpusat. Ganti di sini saja untuk merename produk.
 */
export const BRAND = {
  name: "NusaTabur",
  tagline: "Taburan gizi untuk pangan pokok Indonesia",
  legalName: "PT Nusa Tabur Pangan",
  descriptionShort:
    "Toping fortifikasi mikronutrien yang ditaburkan langsung ke nasi, kentang, singkong, dan jagung — dikemas tanpa plastik sekali pakai.",
  year: 2026,
  contactEmail: "halo@nusatabur.id",
} as const;

/**
 * Penanda wajib di setiap halaman dashboard.
 * Seluruh angka pada aplikasi ini adalah proyeksi business plan, bukan
 * realisasi. Modul ESG khususnya tidak boleh terbaca sebagai laporan resmi.
 */
export const DATA_DISCLAIMER =
  "Data simulasi — proyeksi business plan, bukan realisasi terverifikasi.";
