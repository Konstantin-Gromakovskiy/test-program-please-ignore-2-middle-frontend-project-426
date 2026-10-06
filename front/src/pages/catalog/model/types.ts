import type { ProductCardProps } from "@/entities/product";

export type CatalogDashboardProps = {
  products: ProductCardProps[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export type CatalogSearch = {
  page: number;
};
