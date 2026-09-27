import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { fileURLToPath } from "node:url";
import { heyApiPlugin } from "@hey-api/vite-plugin";

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, "../.", "");

  if (command === "serve" && !env.PORT) {
    throw new Error("PORT is required to configure the API proxy");
  }

  return {
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
    server: {
      proxy: {
        "/api": {
          target: `http://localhost:${env.PORT}`,
          changeOrigin: true,
        },
      },
    },
  };
});
