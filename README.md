# NusaTabur

Platform web untuk business plan produk **taburan fortifikasi gizi** — toping mikronutrien yang ditaburkan langsung ke pangan pokok (nasi, kentang, singkong, jagung), dikemas tanpa plastik sekali pakai, dan didistribusikan bertahap mulai dari wilayah yang paling membutuhkan.

Satu aplikasi, dua peran: **halaman publik** untuk menjelaskan produk dan tujuannya, serta **dashboard internal** dengan tiga modul operasi.

> **Seluruh angka pada aplikasi ini adalah proyeksi rencana bisnis, bukan realisasi terverifikasi.** Setiap halaman dashboard memuat penandanya, dan lembar cetak laporan ESG memuat pernyataan eksplisit di halaman pertama. Ini penting khusus untuk modul ESG: laporan keberlanjutan yang tampak resmi tetapi berisi angka simulasi bisa menyesatkan pembacanya.

## Menjalankan

```bash
npm install
```

```bash
npm run dev
```

Aplikasi terbuka di `http://localhost:5173`.

```bash
npm run build
```

## Rute

| Rute | Isi |
|---|---|
| `/` | Halaman publik — masalah gizi, lima varian produk, tujuan, kemasan, peta persebaran |
| `/dashboard` | Ikhtisar penjualan: KPI, tren aktual vs target, kanal, varian, wilayah teratas |
| `/dashboard/distribusi` | Peta choropleth dua mode, tabel prioritas wilayah, fase rollout |
| `/dashboard/esg` | Pusat laporan ESG: template, pratinjau, skor pilar, indikator, cetak PDF |
| `/dashboard/rantai-pasok` | Alur tujuh tahap, ketertelusuran batch, kartu skor pemasok, peringatan, stok |

## Stack

- **Vite + React 19 + TypeScript**
- **Tailwind CSS v4** — token desain ditulis langsung di `src/index.css` lewat `@theme`
- **shadcn/ui** (style `new-york`) — komponen berada di `src/components/ui/`
- **Recharts** untuk chart, dimuat hanya di rute dashboard
- **d3-geo** untuk peta. Choropleth digambar sendiri dengan `geoMercator` + `geoPath`, tanpa pustaka peta React — tugasnya hanya proyeksi dan path, dan pustaka peta justru menambah dependensi peer yang rapuh serta menghalangi saat perlu mengatur warna dan interaksi sendiri
- **TanStack Query** untuk lapisan data, **motion** untuk animasi, **lucide-react** untuk ikon

Tidak ada emoji di seluruh basis kode — seluruh ikon berasal dari lucide.

## Sistem Desain

Netral hangat sebagai dasar, hijau tua sebagai anchor brand, dan pastel sebagai **warna kategori data**. Pastel yang diredam abu punya kontras rendah: bagus untuk isian chart, badge, dan peta, tetapi tidak untuk teks atau latar. Pemisahan ini dijaga lewat `src/lib/palette.ts` — komponen tidak pernah memilih warna sendiri, selalu mengambil dari pemetaan semantik di sana.

| Arti | Warna |
|---|---|
| Status wilayah | aktif → sage, rintisan → aqua, prioritas → peach, belum terjangkau → abu |
| Status rantai pasok | normal → sage, perlu perhatian → butter, kritis → rose |
| Pilar ESG | Lingkungan → sage, Sosial → sky, Tata Kelola → lilac |

Setiap pastel punya pasangan `-ink`: versi gelap dari hue yang sama, untuk teks dan garis di atas isian pastel. Mode gelap meredefinisi token yang sama dengan lightness lebih rendah dan chroma lebih tinggi; tidak ada warna yang hanya didefinisikan di dalam blok `.dark`.

Tipografi: **Inter Tight** untuk judul, **Inter** untuk teks UI, **JetBrains Mono** untuk kode batch dan nomor dokumen. Semua angka memakai `tabular-nums` agar kolom tidak bergoyang.

## Arsitektur Data

```
src/data/      data benih statis, bertipe
src/services/  api.ts — lapisan akses data
src/hooks/     pembungkus TanStack Query
```

Komponen **tidak pernah** mengimpor dari `src/data/` secara langsung, selalu lewat hook. Karena itu, pindah ke backend nyata cukup mengganti isi fungsi di `src/services/api.ts`:

```ts
export async function getRegions(): Promise<Region[]> {
  const res = await fetch("/api/regions");
  if (!res.ok) throw new Error("Gagal memuat data wilayah");
  return res.json();
}
```

Tidak ada komponen yang perlu disentuh.

### Angka yang saling konsisten

Data benih dirancang agar tidak bisa saling bertentangan:

- `revenueYtd` dan `coverage` tiap wilayah **diturunkan**, bukan ditulis manual
- Deret bulanan 2026 dinormalisasi agar penjumlahannya persis sama dengan total dari `regions.ts`
- Unit per varian produk dialokasikan dari total nasional, sisa pembulatan dibebankan ke varian terakhir
- Metrik lingkungan ESG dihitung dari volume penjualan nyata di aplikasi, memakai faktor konversi yang ditulis eksplisit di `src/data/esg.ts` agar asumsinya bisa diperiksa

`validateSeedData()` di `src/services/api.ts` memeriksa semua itu plus integritas referensi antar berkas, dan berjalan otomatis saat `npm run dev`. Kalau ada yang tidak cocok, pesannya muncul di konsol peramban.

## Peta

`src/data/geo/indonesia-provinces.geo.json` berisi **32 provinsi** yang propertinya sudah dinormalisasi ke `{ code, name, island }` dengan kode BPS, dan koordinatnya dibulatkan ke tiga desimal (~110 m) sehingga berkasnya 139 KB. Berkas ini diimpor secara dinamis, jadi tidak ikut terunduh sebelum ada yang merender peta.

Basemap sumbernya adalah dataset lama, sehingga **Kepulauan Riau, Sulawesi Barat, Kalimantan Utara, dan pemekaran Papua terbaru belum ada**. Untuk mengganti basemap, ganti berkas tersebut dan pastikan `properties.code` tiap fitur cocok dengan `Region.id` di `src/data/regions.ts` — `validateSeedData()` akan melaporkan setiap kode yang tidak berpasangan.

## Cetak Laporan ESG

Tombol **Cetak / Simpan PDF** memanggil dialog cetak peramban. `ReportPrintSheet` disembunyikan di layar dan hanya muncul saat dicetak, memakai teknik visibility di `src/index.css`. Tidak ada pustaka PDF yang dipakai: untuk kebutuhan ini satu berkas HTML dengan stylesheet cetak memberi hasil yang sama tanpa menambah ratusan kilobyte ke bundel.

## Mengganti Nama Brand

Seluruh nama produk berasal dari `src/lib/brand.ts`. Ubah di sana saja.
