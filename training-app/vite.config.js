import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "../rehab-training",
    emptyOutDir: true,
    assetsDir: "assets",
    sourcemap: false,
  },
});
