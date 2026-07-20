import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "node:path";

// Standalone Vite SPA build for shared-hosting deployment (Apache/LiteSpeed).
// Outputs a fully static site to ./dist that can be uploaded to public_html.
// Independent from the TanStack Start (SSR) setup used by Lovable preview.
export default defineConfig({
  root: path.resolve(__dirname, "spa"),
  publicDir: path.resolve(__dirname, "public"),
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
    sourcemap: false,
  },
});