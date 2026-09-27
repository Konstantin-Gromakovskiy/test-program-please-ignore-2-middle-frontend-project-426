export default {
  input: "../contract/tsp-output/schema/openapi.json",
  output: "src/shared/api/generated",
  plugins: ["@hey-api/client-fetch"],
};
