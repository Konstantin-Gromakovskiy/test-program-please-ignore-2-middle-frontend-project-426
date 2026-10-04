import type { Category } from "#domain/category/types.js";

export type Availability = "all" | "inStock" | "outOfStock";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: Category;
};

export type ProductsFilter = {
  categorySlug?: string | undefined;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  availability?: Availability | undefined;
  limit: number;
  offset: number;
};

export type ProductsPage = {
  items: Product[];
  meta: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
};
