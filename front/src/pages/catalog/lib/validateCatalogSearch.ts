import type { CatalogSearch } from "../model/types";

const toNonEmptyString = (value: unknown) =>
  typeof value === "string" && value.trim() !== "" ? value : undefined;

const toPrice = (value: unknown) => {
  const price = Number(value);
  return value !== undefined &&
    value !== "" &&
    Number.isFinite(price) &&
    price >= 0
    ? price
    : undefined;
};

export const validateCatalogSearch = (
  search: Record<string, unknown>,
): CatalogSearch => {
  const page = Number(search["page"]);
  return {
    page: Number.isInteger(page) && page > 0 ? page : 1,
    search: toNonEmptyString(search["search"]),
    categorySlug: toNonEmptyString(search["categorySlug"]),
    minPrice: toPrice(search["minPrice"]),
    maxPrice: toPrice(search["maxPrice"]),
    inStockOnly: search["inStockOnly"] === true ? true : undefined,
  };
};
