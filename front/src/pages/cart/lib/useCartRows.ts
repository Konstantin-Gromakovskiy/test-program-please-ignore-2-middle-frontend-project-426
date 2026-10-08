import { useEffect } from "react";
import { useQueries } from "@tanstack/react-query";
import { useCartStore } from "@/entities/cart";
import { getProductOptions } from "@/shared/api";
import type { CartEntry } from "../model/types";
import { getCartTotal, isNotFoundError, toCartRow } from "./cartRows";

/** Собирает корзину из localStorage и актуальных данных товаров с сервера. */
export const useCartRows = () => {
  const items = useCartStore((state) => state.items);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const results = useQueries({
    queries: items.map(({ productId }) =>
      getProductOptions({ path: { id: productId } }),
    ),
  });

  // Приводим сохранённую корзину в соответствие с сервером:
  // удалённые товары убираем, количество сверх остатка уменьшаем
  useEffect(() => {
    results.forEach((result, index) => {
      const item = items[index];
      if (!item) return;

      if (result.isError && isNotFoundError(result.error)) {
        removeItem(item.productId);
      } else if (
        result.data &&
        result.data.stock > 0 &&
        item.quantity > result.data.stock
      ) {
        setQuantity(item.productId, result.data.stock);
      }
    });
  });

  const entries = results.flatMap((result, index): CartEntry[] => {
    const item = items[index];
    return result.data && item
      ? [{ product: result.data, quantity: item.quantity }]
      : [];
  });

  return {
    isEmpty: items.length === 0,
    isPending: results.some((result) => result.isPending),
    hasLoadError: results.some(
      (result) => result.isError && !isNotFoundError(result.error),
    ),
    rows: entries.map(toCartRow),
    total: getCartTotal(entries),
    setQuantity,
    removeItem,
  };
};
