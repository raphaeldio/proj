import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  value: number;
  /** Pemformat hasil akhir, misal formatIDRCompact. */
  format: (n: number) => string;
  durationMs?: number;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Angka yang menghitung naik saat pertama muncul.
 * Kalau pengguna meminta gerak dikurangi, nilai langsung ditampilkan penuh.
 */
export function CountUp({ value, format, durationMs = 900 }: CountUpProps) {
  const [display, setDisplay] = useState(() =>
    prefersReducedMotion() ? value : 0,
  );
  const frame = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDisplay(value);
      return;
    }

    const start = performance.now();
    const from = 0;

    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1);
      // easeOutCubic — cepat di awal, melambat di ujung
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (value - from) * eased);
      if (t < 1) frame.current = requestAnimationFrame(tick);
    };

    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [value, durationMs]);

  return <span className="tnum">{format(display)}</span>;
}
