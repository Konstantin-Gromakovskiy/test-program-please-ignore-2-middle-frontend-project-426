import { formatPrice } from "@/entities/product";
import type { CartEntry, CartRow } from "../model/types";

/** В заказ нельзя взять больше, чем есть на складе. */
const getEffectiveQuantity = ({ product, quantity }: CartEntry) =>
  Math.min(quantity, product.stock);

export const toCartRow = (entry: CartEntry): CartRow => {
  const { product } = entry;
  const quantity = getEffectiveQuantity(entry);

  return {
    id: product.id,
    name: product.name,
    imageUrl: product.imageUrl,
    unitPrice: formatPrice(product.price),
    quantity,
    maxQuantity: product.stock,
    lineTotal: formatPrice(product.price * quantity),
    available: product.stock > 0,
  };
};

/** Товары не в наличии в сумму не входят. */
export const getCartTotal = (entries: CartEntry[]) =>
  formatPrice(
    entries.reduce(
      (sum, entry) => sum + entry.product.price * getEffectiveQuantity(entry),
      0,
    ),
  );

/** 404 приходит как тело ответа с полем status. */
export const isNotFoundError = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "status" in error &&
  error.status === 404;
