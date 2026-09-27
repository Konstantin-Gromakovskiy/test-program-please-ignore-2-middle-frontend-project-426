import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { fileURLToPath } from "node:url";
import { heyApiPlugin } from "@hey-api/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    heyApiPlugin(),
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react(),
  ],
  envDir: "../.",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
