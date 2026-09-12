import { Link } from "react-router";
import { ArrowRight, Moon, Sprout, Sun } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ClosingCta,
  KemasanSection,
  MasalahGizi,
  PetaPersebaran,
  ProdukSection,
  SiteFooter,
  TujuanDampak,
} from "./landing-sections";
import { useEsgSummary, useRegions, useSalesSummary } from "@/hooks/use-data";
import { useTheme } from "@/hooks/use-theme";
import { BRAND } from "@/lib/brand";
import { formatCompact, formatNumber } from "@/lib/format";

const NAV = [
  { href: "#masalah", label: "Masalah" },
  { href: "#produk", label: "Produk" },
  { href: "#tujuan", label: "Tujuan" },
  { href: "#kemasan", label: "Kemasan" },
  { href: "#persebaran", label: "Persebaran" },
];

export function LandingPage() {
  const { theme, toggle } = useTheme();

  return (
    <div className="bg-background min-h-screen">
      <header className="bg-background/80 sticky top-0 z-40 border-b backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:gap-6 sm:px-6">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <span className="bg-primary text-primary-foreground grid size-9 shrink-0 place-items-center rounded-xl">
              <Sprout className="size-5" strokeWidth={1.75} />
            </span>
            <span className="font-display truncate text-lg font-semibold">
              {BRAND.name}
            </span>
          </Link>

          <nav className="hidden flex-1 items-center gap-6 md:flex">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="text-muted-foreground hover:text-foreground text-sm font-medium transition"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex min-w-0 flex-1 shrink-0 items-center justify-end gap-1 sm:gap-2 md:flex-none">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              aria-label={theme === "dark" ? "Mode terang" : "Mode gelap"}
            >
              {theme === "dark" ? (
                <Sun className="size-4" strokeWidth={1.75} />
              ) : (
                <Moon className="size-4" strokeWidth={1.75} />
              )}
            </Button>
            <Button asChild size="sm">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <Hero />
      <MasalahGizi />
      <ProdukSection />
      <TujuanDampak />
      <KemasanSection />
      <PetaPersebaran />
      <ClosingCta />
      <SiteFooter />
    </div>
  );
}

function Hero() {
  const { data: sales } = useSalesSummary();
  const { data: esg } = useEsgSummary();
  const { data: regions } = useRegions();

  const served = (regions ?? []).filter((r) => r.unitsSoldYtd > 0).length;

  return (
    <section className="relative overflow-hidden">
      {/* Latar lembut dari pastel brand, tidak ikut menggeser kontras teks */}
      <div
        className="from-p-sage/25 via-p-lime/10 pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br to-transparent"
        aria-hidden
      />

      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-12 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="lg:col-span-7"
        >
          <span className="border-primary/25 bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
            <Sprout className="size-3.5" strokeWidth={2} />
            Gizi yang menempel pada kebiasaan makan
          </span>

          <h1 className="mt-6 text-4xl leading-[1.08] font-semibold sm:text-5xl lg:text-6xl">
            Taburkan gizinya.
            <br />
            Biarkan menunya tetap sama.
          </h1>

          <p className="text-muted-foreground mt-6 max-w-xl text-lg leading-relaxed">
            {BRAND.descriptionShort}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/dashboard">
                Buka dashboard
                <ArrowRight className="size-4" strokeWidth={2} />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#produk">Lihat produknya</a>
            </Button>
          </div>

          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t pt-8">
            <HeroStat
              value={sales ? formatCompact(sales.beneficiaries) : "—"}
              label="Penerima manfaat"
            />
            <HeroStat value={`${served} provinsi`} label="Sudah terlayani" />
            <HeroStat
              value={sales ? formatNumber(sales.outletCount) : "—"}
              label="Titik layan aktif"
            />
          </dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12, ease: "easeOut" }}
          className="lg:col-span-5"
        >
          <Card className="gap-0 p-6">
            <p className="text-muted-foreground text-[10px] font-semibold tracking-[0.18em] uppercase">
              Status Keberlanjutan
            </p>

            <dl className="mt-5 space-y-4">
              <PanelRow
                label="Skor ESG komposit"
                value={esg ? `${esg.compositeScore} / 100` : "—"}
              />
              <PanelRow
                label="Kemasan bebas plastik"
                value="100%"
              />
              <PanelRow
                label="Plastik laminasi dihindari"
                value={esg ? `${formatNumber(esg.plasticAvoidedKg)} kg` : "—"}
              />
              <PanelRow
                label="Petani dan nelayan mitra"
                value={esg ? formatNumber(esg.farmerPartners) : "—"}
              />
              <PanelRow
                label="Ketertelusuran ke petani"
                value={esg ? `${esg.traceabilityRate}%` : "—"}
              />
            </dl>

            <p className="text-muted-foreground mt-6 border-t pt-4 text-xs leading-relaxed">
              Angka di atas adalah proyeksi rencana bisnis dan belum
              diverifikasi pihak ketiga.
            </p>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd className="font-display tnum text-2xl leading-none font-semibold">
        {value}
      </dd>
      <p className="text-muted-foreground mt-1.5 text-xs">{label}</p>
    </div>
  );
}

function PanelRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="tnum font-semibold">{value}</dd>
    </div>
  );
}
