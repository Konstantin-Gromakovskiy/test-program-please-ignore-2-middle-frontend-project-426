import type {
  Availability,
  Product,
  ProductsFilter,
} from "#domain/product/types.js";

export interface ProductRepository {
  getProducts(
    filter: ProductsFilter,
  ): Promise<{ items: Product[]; totalItems: number }>;
  getProductById(id: string): Promise<Product | undefined>;
}

export type GetProductsParams = {
  page: number;
  pageSize: number;
  categorySlug?: string | undefined;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  availability?: Availability | undefined;
  search?: string | undefined;
};
