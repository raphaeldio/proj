import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";
import { validateSeedData } from "@/services/api";
import "./index.css";

// Konsistensi data benih diperiksa sekali saat pengembangan. Angka yang
// saling bertentangan antar halaman jauh lebih sulit ditemukan belakangan
// daripada gagal keras di konsol sekarang.
if (import.meta.env.DEV) {
  void validateSeedData().then((problems) => {
    if (problems.length > 0) {
      console.error(
        `[NusaTabur] ${problems.length} masalah konsistensi data:\n` +
          problems.map((p) => `  - ${p}`).join("\n"),
      );
    }
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
