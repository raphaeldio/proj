import { useEffect } from "react";
import { useLocation } from "react-router";

/**
 * Kembalikan posisi gulir ke atas saat pindah halaman, kecuali saat
 * menuju anchor di dalam halaman yang sama (navigasi landing).
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
}
