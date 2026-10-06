import type { CatalogSearch } from "../model/types";

export const validateCatalogSearch = (
  search: Record<string, unknown>,
): CatalogSearch => {
  const page = Number(search["page"]);
  return { page: Number.isInteger(page) && page > 0 ? page : 1 };
};
