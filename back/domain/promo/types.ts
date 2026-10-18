import type { Product } from "#domain/product/types.js";

export type Promo = {
  id: string;
  title: string;
  description: string;
  product: Product;
};
