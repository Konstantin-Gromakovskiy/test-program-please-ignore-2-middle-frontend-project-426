import { createFileRoute } from "@tanstack/react-router";
import { CatalogPage } from "@/pages/catalog";

export const Route = createFileRoute("/_authenticated/catalog")({
  component: CatalogPage,
});
