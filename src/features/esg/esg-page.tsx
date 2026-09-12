import { useMemo, useState } from "react";
import {
  CheckCircle2,
  FileText,
  Loader2,
  Printer,
  ShieldCheck,
  Sprout,
  Users,
} from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { SectionCard } from "@/components/common/section-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/common/status-badge";
import { RadarScore } from "@/components/charts/radar-score";
import { PillarScoreCards } from "./pillar-score-cards";
import { IndicatorTable } from "./indicator-table";
import { ReportPrintSheet } from "./report-print-sheet";
import { useEsgSummary, useRegions, useReportTemplates } from "@/hooks/use-data";
import { BRAND } from "@/lib/brand";
import { ESG_PILLAR_LABEL } from "@/lib/palette";
import { formatCompact, formatDate, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

export function EsgPage() {
  const { data: esg, isLoading } = useEsgSummary();
  const { data: templates } = useReportTemplates();
  const { data: regions } = useRegions();
  const [selectedId, setSelectedId] = useState<string>("keberlanjutan-tahunan");

  const template =
    templates?.find((t) => t.id === selectedId) ?? templates?.[0] ?? null;

  const reportId = useMemo(
    () => `NT-2026-${(template?.id ?? "").slice(0, 3).toUpperCase()}-0287`,
    [template],
  );

  const radar =
    esg?.pillars.map((p) => ({
      pillar: ESG_PILLAR_LABEL[p.pillar],
      skor: p.score,
      target: p.targetScore,
    })) ?? [];

  if (isLoading || !esg || !templates || !regions || !template) {
    return (
      <>
        <PageHeader
          title="Pusat Laporan ESG"
          description="Menyusun laporan keberlanjutan dari data portofolio"
        />
        <div className="grid gap-4 lg:grid-cols-5">
          <Skeleton className="h-96 w-full rounded-xl lg:col-span-2" />
          <Skeleton className="h-96 w-full rounded-xl lg:col-span-3" />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Pusat Laporan ESG"
        description="Menyusun laporan keberlanjutan langsung dari data distribusi dan rantai pasok"
        action={
          <div className="text-right">
            <p className="font-display text-3xl leading-none font-semibold">
              {esg.compositeScore}
              <span className="text-muted-foreground text-base"> / 100</span>
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              Grade {esg.compositeGrade} · diperbarui{" "}
              {formatDate(esg.lastVerified)}
            </p>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ImpactStat
          icon={Sprout}
          label="Plastik dihindari"
          value={`${formatNumber(esg.plasticAvoidedKg)} kg`}
          caption="Laminasi sekali pakai yang tidak jadi dipakai"
        />
        <ImpactStat
          icon={ShieldCheck}
          label="Emisi terhindarkan"
          value={`${formatNumber(esg.carbonAvoidedTco2e)} tCO2e`}
          caption="Kemasan dan pemendekan rantai angkut"
        />
        <ImpactStat
          icon={Users}
          label="Penerima manfaat"
          value={formatCompact(esg.beneficiaries)}
          caption="Anak balita dan ibu hamil"
        />
        <ImpactStat
          icon={CheckCircle2}
          label="Ketertelusuran"
          value={`${esg.traceabilityRate}%`}
          caption="Batch tertelusuri sampai petani"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-5">
        <SectionCard
          className="min-w-0 lg:col-span-2"
          title="Template Laporan"
          description="Pilih format yang sesuai dengan pembacanya"
          bodyClassName="p-3"
        >
          <ul className="space-y-2">
            {templates.map((t) => {
              const active = t.id === template.id;
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(t.id)}
                    aria-pressed={active}
                    className={cn(
                      "w-full rounded-xl border p-3.5 text-left transition",
                      active
                        ? "border-primary bg-accent/60"
                        : "hover:bg-muted/60",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-2.5">
                        <FileText
                          className="text-muted-foreground mt-0.5 size-4 shrink-0"
                          strokeWidth={1.75}
                        />
                        <div className="min-w-0">
                          <p className="text-sm leading-tight font-semibold">
                            {t.name}
                          </p>
                          <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                            {t.description}
                          </p>
                        </div>
                      </div>
                      <StatusBadge color="aqua" dot={false} className="shrink-0">
                        {t.framework}
                      </StatusBadge>
                    </div>
                    <div className="text-muted-foreground mt-2.5 flex flex-wrap gap-x-4 gap-y-1 pl-6.5 text-[11px]">
                      <span>{t.pages}</span>
                      <span>{t.formats.join(" · ")}</span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </SectionCard>

        <SectionCard
          className="min-w-0 lg:col-span-3"
          title="Pratinjau Laporan"
          description="Dibentuk otomatis dari data portofolio saat ini"
          action={
            <Button size="sm" onClick={() => window.print()}>
              <Printer className="size-4" strokeWidth={1.75} />
              Cetak / Simpan PDF
            </Button>
          }
        >
          <div className="rounded-xl border p-5">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b pb-4">
              <div>
                <p className="text-muted-foreground text-[10px] tracking-[0.18em] uppercase">
                  Laporan Pengungkapan ESG
                </p>
                <h3 className="mt-1 text-xl font-semibold">{template.name}</h3>
                <p className="text-muted-foreground mt-0.5 text-sm">
                  {BRAND.legalName} — Januari hingga September 2026
                </p>
              </div>
              <div className="text-right">
                <StatusBadge color="sage">Siap dicetak</StatusBadge>
                <p className="text-muted-foreground mt-1.5 font-mono text-[11px]">
                  {reportId}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 border-b py-4">
              <PreviewStat
                label="Emisi terhindarkan"
                value={`${formatNumber(esg.carbonAvoidedTco2e)} tCO2e`}
              />
              <PreviewStat
                label="Penerima manfaat"
                value={formatCompact(esg.beneficiaries)}
              />
              <PreviewStat
                label="Skor ESG"
                value={`${esg.compositeScore} / 100`}
              />
            </div>

            <ul className="mt-4 space-y-1.5">
              {template.sections.map((s) => (
                <li
                  key={s.order}
                  className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-sm odd:bg-muted/40"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="text-muted-foreground font-mono text-xs">
                      {s.order}
                    </span>
                    <span className="truncate">{s.title}</span>
                  </span>
                  {s.status === "siap" ? (
                    <span className="text-p-sage-ink flex shrink-0 items-center gap-1 text-xs font-medium">
                      <CheckCircle2 className="size-3.5" strokeWidth={2} />
                      Siap
                    </span>
                  ) : (
                    <span className="text-p-butter-ink flex shrink-0 items-center gap-1 text-xs font-medium">
                      <Loader2 className="size-3.5" strokeWidth={2} />
                      Proses
                    </span>
                  )}
                </li>
              ))}
            </ul>

            <p className="text-muted-foreground mt-4 border-t pt-4 text-xs leading-relaxed">
              Ditujukan untuk {template.audience}. Berkas yang dihasilkan memuat
              pernyataan bahwa seluruh angka masih merupakan simulasi rencana
              bisnis dan belum diverifikasi pihak ketiga.
            </p>
          </div>
        </SectionCard>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Skor per Pilar</h2>
        <PillarScoreCards pillars={esg.pillars} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <SectionCard
          title="Skor terhadap Target"
          description="Perbandingan capaian tiap pilar dengan targetnya"
        >
          <RadarScore data={radar} />
        </SectionCard>
        <div className="min-w-0 xl:col-span-2">
          <IndicatorTable pillars={esg.pillars} />
        </div>
      </div>

      <ReportPrintSheet
        template={template}
        esg={esg}
        regions={regions}
        reportId={reportId}
      />
    </>
  );
}

function ImpactStat({
  icon: Icon,
  label,
  value,
  caption,
}: {
  icon: typeof Sprout;
  label: string;
  value: string;
  caption: string;
}) {
  return (
    <Card className="gap-0 p-5">
      <div className="flex items-center gap-2">
        <span className="bg-accent text-accent-foreground grid size-8 place-items-center rounded-lg">
          <Icon className="size-4" strokeWidth={1.75} />
        </span>
        <span className="text-muted-foreground text-sm font-medium">{label}</span>
      </div>
      <p className="font-display tnum mt-3 text-2xl leading-none font-semibold">
        {value}
      </p>
      <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
        {caption}
      </p>
    </Card>
  );
}

function PreviewStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="tnum mt-1 font-semibold">{value}</p>
    </div>
  );
}
