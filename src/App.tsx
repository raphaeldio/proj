import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { LandingPage } from "@/features/landing/landing-page";
import { ScrollToTop } from "@/components/layout/scroll-to-top";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Halaman dashboard dimuat terpisah. Recharts adalah dependensi terberat
 * di proyek ini dan hanya dipakai di dashboard — pengunjung halaman publik
 * tidak perlu ikut mengunduhnya.
 */
const OverviewPage = lazy(() =>
  import("@/features/penjualan/overview-page").then((m) => ({
    default: m.OverviewPage,
  })),
);
const DistribusiPage = lazy(() =>
  import("@/features/distribusi/distribusi-page").then((m) => ({
    default: m.DistribusiPage,
  })),
);
const EsgPage = lazy(() =>
  import("@/features/esg/esg-page").then((m) => ({ default: m.EsgPage })),
);
const SupplyPage = lazy(() =>
  import("@/features/rantai-pasok/supply-page").then((m) => ({
    default: m.SupplyPage,
  })),
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function PageFallback() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-20 w-full max-w-md rounded-xl" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-36 w-full rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-80 w-full rounded-xl" />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardShell />}>
            <Route
              index
              element={
                <Suspense fallback={<PageFallback />}>
                  <OverviewPage />
                </Suspense>
              }
            />
            <Route
              path="distribusi"
              element={
                <Suspense fallback={<PageFallback />}>
                  <DistribusiPage />
                </Suspense>
              }
            />
            <Route
              path="esg"
              element={
                <Suspense fallback={<PageFallback />}>
                  <EsgPage />
                </Suspense>
              }
            />
            <Route
              path="rantai-pasok"
              element={
                <Suspense fallback={<PageFallback />}>
                  <SupplyPage />
                </Suspense>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
