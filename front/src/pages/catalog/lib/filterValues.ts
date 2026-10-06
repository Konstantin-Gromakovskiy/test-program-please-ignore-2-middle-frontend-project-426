import type { GetProductsData } from "@/shared/api";
import type { CatalogFilterValues, CatalogSearch } from "../model/types";

const toOptionalPrice = (value: number | string) => {
  if (value === "") return undefined;
  const price = Number(value);
  return Number.isFinite(price) && price >= 0 ? price : undefined;
};

const toKopecks = (rubles: number | undefined) =>
  rubles === undefined ? undefined : Math.round(rubles * 100);

export const emptyFilterValues: CatalogFilterValues = {
  search: "",
  categorySlug: null,
  minPrice: "",
  maxPrice: "",
  inStockOnly: false,
};

export const toFilterValues = (search: CatalogSearch): CatalogFilterValues => ({
  search: search.search ?? "",
  categorySlug: search.categorySlug ?? null,
  minPrice: search.minPrice ?? "",
  maxPrice: search.maxPrice ?? "",
  inStockOnly: search.inStockOnly ?? false,
});

/** Новые фильтры всегда возвращают на первую страницу. */
export const toSearch = (values: CatalogFilterValues): CatalogSearch => ({
  page: 1,
  search: values.search.trim() || undefined,
  categorySlug: values.categorySlug ?? undefined,
  minPrice: toOptionalPrice(values.minPrice),
  maxPrice: toOptionalPrice(values.maxPrice),
  inStockOnly: values.inStockOnly || undefined,
});

export const toProductsQuery = (
  search: CatalogSearch,
): NonNullable<GetProductsData["query"]> => ({
  page: search.page,
  search: search.search,
  categorySlug: search.categorySlug,
  minPrice: toKopecks(search.minPrice),
  maxPrice: toKopecks(search.maxPrice),
  availability: search.inStockOnly ? "inStock" : undefined,
});
