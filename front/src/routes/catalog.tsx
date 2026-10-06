import { createFileRoute } from "@tanstack/react-router";
import { CatalogPage, validateCatalogSearch } from "@/pages/catalog";

export const Route = createFileRoute("/catalog")({
  validateSearch: validateCatalogSearch,
  component: CatalogPage,
});
