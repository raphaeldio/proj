import { NavLink } from "react-router";
import {
  Boxes,
  Globe,
  LayoutDashboard,
  Leaf,
  Map as MapIcon,
  Sprout,
  type LucideIcon,
} from "lucide-react";

import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";
import { useEsgSummary, useSalesSummary } from "@/hooks/use-data";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

const NAV: NavItem[] = [
  { to: "/dashboard", label: "Ikhtisar", icon: LayoutDashboard, end: true },
  { to: "/dashboard/distribusi", label: "Distribusi", icon: MapIcon },
  { to: "/dashboard/esg", label: "Laporan ESG", icon: Leaf },
  { to: "/dashboard/rantai-pasok", label: "Rantai Pasok", icon: Boxes },
];

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const { data: esg } = useEsgSummary();
  const { data: sales } = useSalesSummary();

  return (
    <div className="bg-sidebar text-sidebar-foreground flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <span className="bg-sidebar-primary text-sidebar-primary-foreground grid size-9 shrink-0 place-items-center rounded-xl">
          <Sprout className="size-5" strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <p className="font-display truncate text-base leading-tight font-semibold">
            {BRAND.name}
          </p>
          <p className="truncate text-[11px] opacity-70">Dashboard Operasi</p>
        </div>
      </div>

      <nav className="flex-1 px-3">
        <p className="px-2 pt-2 pb-2 text-[10px] font-semibold tracking-widest uppercase opacity-50">
          Navigasi
        </p>
        <ul className="space-y-1">
          {NAV.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "opacity-75 hover:bg-sidebar-accent/60 hover:opacity-100",
                  )
                }
              >
                <item.icon className="size-4 shrink-0" strokeWidth={1.75} />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <p className="px-2 pt-6 pb-2 text-[10px] font-semibold tracking-widest uppercase opacity-50">
          Status Portofolio
        </p>
        <dl className="space-y-2.5 px-3 pb-4">
          <MiniStat
            label="Skor ESG"
            value={esg ? `${esg.compositeScore} / 100` : "—"}
          />
          <MiniStat
            label="Provinsi aktif"
            value={sales ? String(sales.activeRegions) : "—"}
          />
          <MiniStat
            label="Titik layan"
            value={sales ? formatNumber(sales.outletCount) : "—"}
          />
        </dl>
      </nav>

      <div className="border-sidebar-border border-t p-3">
        <NavLink
          to="/"
          onClick={onNavigate}
          className="hover:bg-sidebar-accent/60 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium opacity-75 transition hover:opacity-100"
        >
          <Globe className="size-4 shrink-0" strokeWidth={1.75} />
          Halaman publik
        </NavLink>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <dt className="text-xs opacity-70">{label}</dt>
      <dd className="tnum text-sm font-semibold">{value}</dd>
    </div>
  );
}
