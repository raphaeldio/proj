import { useQuery } from "@tanstack/react-query";
import * as api from "@/services/api";

/**
 * Satu hook per sumber data. Komponen memakai hook ini, bukan src/data,
 * sehingga perpindahan ke API nyata tidak menyentuh lapisan tampilan.
 *
 * staleTime panjang karena data benih tidak berubah; saat backend nyata
 * dipasang, nilainya perlu disesuaikan per endpoint.
 */
const STALE = 5 * 60 * 1000;

export function useRegions() {
  return useQuery({
    queryKey: ["regions"],
    queryFn: api.getRegions,
    staleTime: STALE,
  });
}

export function useRolloutPhases() {
  return useQuery({
    queryKey: ["rollout-phases"],
    queryFn: api.getRolloutPhases,
    staleTime: STALE,
  });
}

export function useProvinceGeo() {
  return useQuery({
    queryKey: ["province-geo"],
    queryFn: api.getProvinceGeo,
    staleTime: Infinity,
  });
}

export function useSalesSeries() {
  return useQuery({
    queryKey: ["sales-series"],
    queryFn: api.getSalesSeries,
    staleTime: STALE,
  });
}

export function useSalesSummary() {
  return useQuery({
    queryKey: ["sales-summary"],
    queryFn: api.getSalesSummary,
    staleTime: STALE,
  });
}

export function useChannelBreakdown() {
  return useQuery({
    queryKey: ["channel-breakdown"],
    queryFn: api.getChannelBreakdown,
    staleTime: STALE,
  });
}

export function useActivityFeed() {
  return useQuery({
    queryKey: ["activity-feed"],
    queryFn: api.getActivityFeed,
    staleTime: STALE,
  });
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: api.getProducts,
    staleTime: STALE,
  });
}

export function useEsgSummary() {
  return useQuery({
    queryKey: ["esg-summary"],
    queryFn: api.getEsgSummary,
    staleTime: STALE,
  });
}

export function useReportTemplates() {
  return useQuery({
    queryKey: ["report-templates"],
    queryFn: api.getReportTemplates,
    staleTime: STALE,
  });
}

export function useSupplyChain() {
  return useQuery({
    queryKey: ["supply-chain"],
    queryFn: api.getSupplyChain,
    staleTime: STALE,
  });
}
