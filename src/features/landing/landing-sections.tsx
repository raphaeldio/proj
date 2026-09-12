import { Link } from "react-router";
import {
  ArrowRight,
  Leaf,
  PackageOpen,
  Recycle,
  Sprout,
  Target,
  TrendingDown,
  Users,
  Wheat,
} from "lucide-react";
import { motion } from "motion/react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/status-badge";
import { ProgressMeter } from "@/components/common/progress-meter";
import { IndonesiaMap } from "@/components/map/indonesia-map";
import { Skeleton } from "@/components/ui/skeleton";
import { MapLegend } from "@/components/map/map-legend";
import {
  useProducts,
  useProvinceGeo,
  useRegions,
  useRolloutPhases,
} from "@/hooks/use-data";
import { PACKAGING_DETAIL, PACKAGING_LABEL } from "@/data/products";
import { BRAND } from "@/lib/brand";
import { PASTEL_CLASS, SERIES_ORDER } from "@/lib/palette";
import { formatCompact, formatNumber, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <motion.div {...fadeUp} className={cn("max-w-2xl", className)}>
      <p className="text-primary text-xs font-semibold tracking-[0.18em] uppercase">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl leading-tight font-semibold sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground mt-4 leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
}

/* ---------------- Masalah gizi ---------------- */

export function MasalahGizi() {
  const { data: regions } = useRegions();

  const worst = [...(regions ?? [])]
    .sort((a, b) => b.nutritionGapIndex - a.nutritionGapIndex)
    .slice(0, 5);

  const untouched = (regions ?? []).filter((r) => r.status === "belum");
  const untouchedPop = untouched.reduce((a, r) => a + r.targetPopulation, 0);
  const avgStunting =
    worst.length > 0
      ? worst.reduce((a, r) => a + r.stuntingRate, 0) / worst.length
      : 0;

  return (
    <section id="masalah" className="border-t py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Masalah"
          title="Kalorinya cukup. Gizinya yang tidak."
          description="Di banyak wilayah pedalaman Indonesia, piring sudah penuh — nasi, singkong, jagung, atau sagu. Yang hilang bukan energi, melainkan zat besi, zinc, vitamin A, dan protein. Mengganti pangan pokok bukan jawaban yang realistis, karena itu melawan kebiasaan makan dan ekonomi rumah tangga sekaligus."
        />

        <motion.div
          {...fadeUp}
          className="mt-12 grid gap-4 sm:grid-cols-3"
        >
          <BigStat
            icon={TrendingDown}
            value={formatPercent(avgStunting, 1)}
            label="Rata-rata prevalensi stunting"
            caption="Di lima provinsi dengan indeks kebutuhan tertinggi"
          />
          <BigStat
            icon={Users}
            value={formatCompact(untouchedPop)}
            label="Populasi sasaran belum terjangkau"
            caption={`Tersebar di ${untouched.length} provinsi yang belum kami masuki`}
          />
          <BigStat
            icon={Wheat}
            value="4 pangan pokok"
            label="Dapat langsung ditaburi"
            caption="Nasi, kentang, singkong, jagung — tanpa mengubah cara masak"
          />
        </motion.div>

        <motion.div {...fadeUp} className="mt-8">
          <Card className="gap-0 p-6">
            <h3 className="text-lg font-semibold">
              Lima wilayah dengan kebutuhan tertinggi
            </h3>
            <p className="text-muted-foreground mt-1 text-sm">
              Indeks kebutuhan menggabungkan prevalensi stunting, keterbatasan
              akses pangan bergizi, dan daya beli rumah tangga.
            </p>
            <ul className="mt-6 space-y-4">
              {worst.map((r, i) => (
                <li key={r.id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="flex items-baseline gap-2.5 font-medium">
                      <span className="text-muted-foreground tnum text-xs">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {r.name}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      stunting {formatPercent(r.stuntingRate, 1)} · sasaran{" "}
                      {formatNumber(r.targetPopulation)} jiwa
                    </span>
                  </div>
                  <ProgressMeter
                    className="mt-2"
                    value={r.nutritionGapIndex}
                    color="peach"
                    size="sm"
                    showValue={false}
                  />
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

function BigStat({
  icon: Icon,
  value,
  label,
  caption,
}: {
  icon: typeof Users;
  value: string;
  label: string;
  caption: string;
}) {
  return (
    <Card className="gap-0 p-6">
      <span className="bg-accent text-accent-foreground grid size-9 place-items-center rounded-xl">
        <Icon className="size-4.5" strokeWidth={1.75} />
      </span>
      <p className="font-display tnum mt-4 text-3xl leading-none font-semibold">
        {value}
      </p>
      <p className="mt-2 text-sm font-medium">{label}</p>
      <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">
        {caption}
      </p>
    </Card>
  );
}

/* ---------------- Produk ---------------- */

export function ProdukSection() {
  const { data: products } = useProducts();

  return (
    <section id="produk" className="bg-muted/40 border-t py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Produk"
          title="Lima varian taburan, satu cara pakai"
          description="Bubuk kering yang ditaburkan ke makanan yang sudah matang. Tidak perlu lemari pendingin, tidak perlu resep baru, dan tidak mengubah rasa masakan secara drastis. Setiap sachet 8 gram dirancang untuk satu porsi anak."
        />

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(products ?? []).map((p, i) => {
            const color = SERIES_ORDER[i % SERIES_ORDER.length];
            const c = PASTEL_CLASS[color];

            return (
              <motion.div key={p.id} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.06 }}>
                <Card className="h-full gap-0 p-6">
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={cn(
                        "grid size-10 shrink-0 place-items-center rounded-xl border",
                        c.soft,
                        c.ink,
                        c.border,
                      )}
                    >
                      <Sprout className="size-5" strokeWidth={1.75} />
                    </span>
                    <span className="tnum text-muted-foreground text-xs">
                      {p.gramsPerSachet} g · Rp {formatNumber(p.pricePerSachet)}
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg leading-tight font-semibold">
                    {p.name}
                  </h3>
                  <p className="text-primary mt-1 text-sm font-medium">
                    {p.tagline}
                  </p>
                  <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                    {p.description}
                  </p>

                  <div className="mt-5 border-t pt-4">
                    <p className="text-muted-foreground mb-2 text-xs font-medium">
                      Cocok ditaburkan ke
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {p.basePairing.map((b) => (
                        <StatusBadge key={b} color={color} dot={false}>
                          {b}
                        </StatusBadge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 border-t pt-4">
                    <p className="text-muted-foreground mb-2 text-xs font-medium">
                      Kandungan per sachet
                    </p>
                    <ul className="space-y-1.5">
                      {p.micronutrients.map((m) => (
                        <li key={m.name}>
                          <div className="flex items-baseline justify-between gap-2 text-xs">
                            <span>{m.name}</span>
                            <span className="tnum text-muted-foreground">
                              {m.rdaPercent}% AKG
                            </span>
                          </div>
                          <ProgressMeter
                            className="mt-1"
                            value={m.rdaPercent}
                            color={color}
                            size="sm"
                            showValue={false}
                          />
                        </li>
                      ))}
                    </ul>
                    <p className="text-muted-foreground mt-3 text-[11px]">
                      Acuan AKG anak usia 4–6 tahun. Kemasan:{" "}
                      {PACKAGING_LABEL[p.packaging].toLowerCase()}.
                    </p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Tujuan & dampak ---------------- */

const GOALS = [
  {
    icon: Target,
    title: "Menutup celah mikronutrien, bukan mengganti menu",
    body: "Produk ini menempel pada kebiasaan makan yang sudah ada. Tidak ada keluarga yang diminta mengganti bahan pokoknya, karena intervensi gizi yang melawan kebiasaan hampir selalu berhenti begitu programnya selesai.",
  },
  {
    icon: Users,
    title: "Mendahulukan yang paling membutuhkan",
    body: "Urutan masuk ditentukan indeks kebutuhan, bukan kemudahan berjualan. Provinsi dengan logistik tersulit justru berada di fase pertama, dan wilayah padat penduduk yang menguntungkan berada di fase terakhir.",
  },
  {
    icon: Recycle,
    title: "Tidak menukar masalah gizi dengan masalah sampah",
    body: "Program gizi berbasis sachet punya catatan buruk soal limbah plastik di daerah tanpa pengelolaan sampah. Seluruh kemasan kami dapat terurai atau terkompos, dan sebagiannya dianyam perajin di wilayah sasaran itu sendiri.",
  },
  {
    icon: Sprout,
    title: "Membeli bahan baku dari wilayah yang dilayani",
    body: "Kelor, jagung, rumput laut, dan ikan dibeli dari koperasi setempat dengan premi di atas harga pasar. Uang program berputar di daerah yang sama, bukan hanya mengalir masuk lalu keluar.",
  },
];

export function TujuanDampak() {
  return (
    <section id="tujuan" className="border-t py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Tujuan"
          title="Empat prinsip yang menentukan setiap keputusan"
        />
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {GOALS.map((g, i) => (
            <motion.div key={g.title} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.06 }}>
              <Card className="h-full gap-0 p-6">
                <span className="bg-primary text-primary-foreground grid size-9 place-items-center rounded-xl">
                  <g.icon className="size-4.5" strokeWidth={1.75} />
                </span>
                <h3 className="mt-4 text-lg leading-snug font-semibold">
                  {g.title}
                </h3>
                <p className="text-muted-foreground mt-3 leading-relaxed">
                  {g.body}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Kemasan ---------------- */

export function KemasanSection() {
  const { data: products } = useProducts();

  const types = Array.from(
    new Set((products ?? []).map((p) => p.packaging)),
  );

  return (
    <section id="kemasan" className="bg-muted/40 border-t py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Kemasan"
          title="Tanpa plastik sekali pakai, sejak sachet pertama"
          description="Sachet laminasi aluminium-plastik adalah pilihan termudah dan paling murah untuk produk seperti ini. Kami tidak memakainya, karena di wilayah yang kami layani sampah itu tidak punya ke mana pergi selain sungai dan halaman rumah."
        />

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {types.map((t, i) => {
            const detail = PACKAGING_DETAIL[t];
            const color = SERIES_ORDER[i % SERIES_ORDER.length];
            const c = PASTEL_CLASS[color];

            return (
              <motion.div key={t} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.06 }}>
                <Card className="h-full gap-0 p-6">
                  <span
                    className={cn(
                      "grid size-10 place-items-center rounded-xl border",
                      c.soft,
                      c.ink,
                      c.border,
                    )}
                  >
                    <PackageOpen className="size-5" strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-4 text-base leading-snug font-semibold">
                    {PACKAGING_LABEL[t]}
                  </h3>
                  <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                    {detail.note}
                  </p>
                  <p className="tnum mt-4 border-t pt-4 text-sm">
                    Terurai dalam{" "}
                    <span className="font-semibold">
                      {detail.decomposeMonths} bulan
                    </span>
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Peta persebaran ---------------- */

export function PetaPersebaran() {
  const { data: regions } = useRegions();
  const { data: geo } = useProvinceGeo();
  const { data: phases } = useRolloutPhases();

  const counts = { aktif: 0, perintis: 0, prioritas: 0, belum: 0 };
  for (const r of regions ?? []) counts[r.status] += 1;

  return (
    <section id="persebaran" className="border-t py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Persebaran"
          title="Menyebar bertahap, dimulai dari yang paling membutuhkan"
          description="Kami tidak membuka seluruh Indonesia sekaligus. Urutannya ditentukan indeks kebutuhan gizi, sehingga provinsi tersulit secara logistik justru dilayani lebih dulu."
        />

        <motion.div {...fadeUp} className="mt-12">
          <Card className="gap-0 p-6">
            {geo && regions ? (
              <>
                <IndonesiaMap geo={geo} regions={regions} interactive={false} />
                <div className="mt-4 border-t pt-4">
                  <MapLegend
                    mode="status"
                    counts={counts}
                    activeStatuses={new Set()}
                    onToggle={() => {}}
                  />
                </div>
              </>
            ) : (
              <Skeleton className="h-64 w-full" />
            )}
          </Card>
        </motion.div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {(phases ?? []).map((p, i) => (
            <motion.div key={p.phase} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.06 }}>
              <Card className="h-full gap-0 p-6">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-display text-2xl font-semibold">
                    0{p.phase}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {p.period}
                  </span>
                </div>
                <h3 className="mt-3 text-base leading-snug font-semibold">
                  {p.name.replace(/^Fase \d — /, "")}
                </h3>
                <p className="text-muted-foreground mt-2.5 text-sm leading-relaxed">
                  {p.objective}
                </p>
                <p className="text-muted-foreground mt-4 border-t pt-4 text-xs">
                  {p.regionIds.length} provinsi · target{" "}
                  {formatNumber(p.targetOutlets)} titik layan
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Penutup ---------------- */

export function ClosingCta() {
  return (
    <section className="border-t py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div {...fadeUp}>
          <Card className="bg-primary text-primary-foreground gap-0 overflow-hidden p-8 sm:p-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl leading-tight font-semibold sm:text-4xl">
                Lihat angkanya sendiri
              </h2>
              <p className="mt-4 leading-relaxed opacity-85">
                Dashboard operasi menampilkan penjualan per provinsi, laporan
                ESG yang dibentuk dari data distribusi, dan posisi setiap batch
                di sepanjang rantai pasok.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" variant="secondary">
                  <Link to="/dashboard">
                    Buka dashboard
                    <ArrowRight className="size-4" strokeWidth={2} />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/30 bg-transparent hover:bg-primary-foreground/10 hover:text-primary-foreground"
                >
                  <Link to="/dashboard/esg">Lihat laporan ESG</Link>
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t py-10">
      <div className="text-muted-foreground mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 text-sm">
        <div className="flex items-center gap-2.5">
          <span className="bg-primary text-primary-foreground grid size-8 place-items-center rounded-lg">
            <Leaf className="size-4" strokeWidth={1.75} />
          </span>
          <span>
            {BRAND.legalName} · {BRAND.contactEmail}
          </span>
        </div>
        <p className="text-xs">
          Seluruh angka pada situs ini adalah proyeksi rencana bisnis, bukan
          realisasi terverifikasi.
        </p>
      </div>
    </footer>
  );
}
