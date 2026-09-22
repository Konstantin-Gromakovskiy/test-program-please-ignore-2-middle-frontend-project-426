import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "../contract/tsp-output/schema/openapi.json",
  output: "./types/handlers",
  plugins: ["fastify"],
});
