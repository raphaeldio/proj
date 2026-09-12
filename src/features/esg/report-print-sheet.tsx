import type { EsgSummary, Region, ReportTemplate } from "@/data/types";
import { BRAND, DATA_DISCLAIMER } from "@/lib/brand";
import { ESG_PILLAR_LABEL } from "@/lib/palette";
import {
  formatCompact,
  formatDate,
  formatNumber,
  formatPercent,
} from "@/lib/format";

interface ReportPrintSheetProps {
  template: ReportTemplate;
  esg: EsgSummary;
  regions: Region[];
  reportId: string;
}

/**
 * Lembar cetak. Tersembunyi di layar (.print-sheet), muncul hanya saat
 * dicetak, lalu bisa disimpan sebagai PDF lewat dialog cetak peramban.
 *
 * Sengaja tidak memakai pustaka PDF: satu berkas HTML dengan stylesheet
 * cetak memberi hasil yang sama untuk kebutuhan ini, tanpa menambah
 * ratusan kilobyte ke bundel.
 */
export function ReportPrintSheet({
  template,
  esg,
  regions,
  reportId,
}: ReportPrintSheetProps) {
  const served = regions.filter((r) => r.unitsSoldYtd > 0);
  const totalUnits = regions.reduce((a, r) => a + r.unitsSoldYtd, 0);

  return (
    <div className="print-sheet font-sans text-[11pt] text-black">
      <header className="mb-6 border-b-2 border-black pb-4">
        <p className="text-[8pt] tracking-[0.2em] uppercase">
          Laporan Pengungkapan ESG
        </p>
        <h1 className="mt-1 font-serif text-[22pt] leading-tight font-bold">
          {template.name}
        </h1>
        <p className="mt-1 text-[10pt]">
          {BRAND.legalName} — Periode Januari–September 2026
        </p>
        <div className="mt-3 flex justify-between text-[8pt]">
          <span>Nomor dokumen: {reportId}</span>
          <span>{template.framework}</span>
          <span>Terbit: {formatDate("2026-09-12")}</span>
        </div>
      </header>

      <section className="mb-6 border-2 border-black p-3">
        <p className="text-[9pt] font-bold uppercase">
          Pernyataan Penting
        </p>
        <p className="mt-1 text-[9pt] leading-relaxed">
          {DATA_DISCLAIMER} Dokumen ini dihasilkan dari data simulasi rencana
          bisnis dan belum diverifikasi pihak ketiga mana pun. Dokumen ini tidak
          boleh digunakan sebagai pengungkapan resmi kepada regulator, investor,
          atau publik.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 font-serif text-[13pt] font-bold">
          1. Ikhtisar Kinerja
        </h2>
        <table className="w-full border-collapse text-[10pt]">
          <tbody>
            <Row label="Skor ESG komposit" value={`${esg.compositeScore} / 100 (${esg.compositeGrade})`} />
            <Row label="Sachet terdistribusi" value={`${formatNumber(totalUnits)} sachet`} />
            <Row label="Penerima manfaat" value={`${formatNumber(esg.beneficiaries)} orang`} />
            <Row label="Provinsi terlayani" value={`${served.length} dari 32 provinsi`} />
            <Row label="Plastik laminasi dihindari" value={`${formatNumber(esg.plasticAvoidedKg)} kg`} />
            <Row label="Emisi terhindarkan" value={`${formatNumber(esg.carbonAvoidedTco2e)} tCO2e`} />
            <Row label="Petani dan nelayan mitra" value={`${formatNumber(esg.farmerPartners)} orang`} />
            <Row label="Ketertelusuran batch" value={formatPercent(esg.traceabilityRate, 1)} />
          </tbody>
        </table>
      </section>

      {esg.pillars.map((p, idx) => (
        <section key={p.pillar} className="mb-6">
          <h2 className="mb-2 font-serif text-[13pt] font-bold">
            {idx + 2}. Kinerja {ESG_PILLAR_LABEL[p.pillar]} — skor {p.score} / 100
          </h2>
          <p className="mb-2 text-[10pt] leading-relaxed">{p.summary}</p>
          <table className="w-full border-collapse text-[9.5pt]">
            <thead>
              <tr className="border-b border-black">
                <th className="py-1 text-left">Kode</th>
                <th className="py-1 text-left">Indikator</th>
                <th className="py-1 text-right">Nilai</th>
                <th className="py-1 text-right">Target</th>
                <th className="py-1 text-left">Status</th>
                <th className="py-1 text-left">Kerangka</th>
              </tr>
            </thead>
            <tbody>
              {p.indicators.map((i) => (
                <tr key={i.code} className="border-b border-neutral-300">
                  <td className="py-1">{i.code}</td>
                  <td className="py-1">{i.name}</td>
                  <td className="py-1 text-right">
                    {formatNumber(i.value)} {i.unit}
                  </td>
                  <td className="py-1 text-right">
                    {i.higherIsBetter ? "≥" : "≤"} {formatNumber(i.target)}
                  </td>
                  <td className="py-1 capitalize">{i.status}</td>
                  <td className="py-1">{i.framework}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}

      <section className="print-break mb-6">
        <h2 className="mb-2 font-serif text-[13pt] font-bold">
          5. Cakupan per Provinsi
        </h2>
        <table className="w-full border-collapse text-[9.5pt]">
          <thead>
            <tr className="border-b border-black">
              <th className="py-1 text-left">Provinsi</th>
              <th className="py-1 text-left">Status</th>
              <th className="py-1 text-right">Indeks kebutuhan</th>
              <th className="py-1 text-right">Sachet</th>
              <th className="py-1 text-right">Titik layan</th>
              <th className="py-1 text-right">Cakupan</th>
            </tr>
          </thead>
          <tbody>
            {[...regions]
              .sort((a, b) => b.nutritionGapIndex - a.nutritionGapIndex)
              .map((r) => (
                <tr key={r.id} className="border-b border-neutral-300">
                  <td className="py-1">{r.name}</td>
                  <td className="py-1 capitalize">{r.status}</td>
                  <td className="py-1 text-right">{r.nutritionGapIndex}</td>
                  <td className="py-1 text-right">
                    {formatCompact(r.unitsSoldYtd)}
                  </td>
                  <td className="py-1 text-right">{r.outlets}</td>
                  <td className="py-1 text-right">
                    {formatPercent(r.coverage, 1)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 font-serif text-[13pt] font-bold">
          6. Daftar Isi Dokumen Lengkap
        </h2>
        <ol className="text-[10pt]">
          {template.sections.map((s) => (
            <li key={s.order} className="border-b border-neutral-300 py-1">
              {s.order}. {s.title}
              <span className="float-right">
                {s.status === "siap" ? "Siap" : "Dalam proses"}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <footer className="mt-8 border-t border-black pt-3 text-[8pt]">
        <p>
          {BRAND.legalName} · {BRAND.contactEmail} · Dokumen {reportId} ·
          Ditujukan untuk {template.audience}
        </p>
      </footer>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-b border-neutral-300">
      <td className="py-1">{label}</td>
      <td className="py-1 text-right font-semibold">{value}</td>
    </tr>
  );
}
