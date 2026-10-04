import type { ProductDto } from "@/shared/api";
import type { ProductCardProps } from "../model/types";
import { formatPrice } from "./formatPrice";

export const toProductCardProps = (product: ProductDto): ProductCardProps => ({
  name: product.name,
  description: product.description,
  categoryName: product.category.name,
  price: formatPrice(product.price),
  inStock: product.stock > 0,
});
