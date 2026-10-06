import type { ProductCardProps } from "@/entities/product";

export type CatalogDashboardProps = {
  products: ProductCardProps[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

/** Параметры каталога в URL. Цены — в рублях. */
export type CatalogSearch = {
  page: number;
  search?: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
};

/** Значения полей формы фильтров. */
export type CatalogFilterValues = {
  search: string;
  categorySlug: string | null;
  minPrice: number | string;
  maxPrice: number | string;
  inStockOnly: boolean;
};

export type CategoryOption = {
  value: string;
  label: string;
};

export type CatalogFilterProps = {
  values: CatalogFilterValues;
  categories: CategoryOption[];
  onChange: (values: CatalogFilterValues) => void;
};
