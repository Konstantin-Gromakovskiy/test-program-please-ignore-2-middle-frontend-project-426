export default {
  input: "../contract/tsp-output/schema/openapi.json",
  output: "src/shared/api/generated",
  plugins: [
    {
      name: "@tanstack/react-query",
      includeInEntry: true,
      useMutation: true,
      useQuery: true,
    },
  ],
};
