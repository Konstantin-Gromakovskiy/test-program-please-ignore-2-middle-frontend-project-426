import type { ProductDto } from "@/shared/api";

/** Позиция корзины в виде, готовом для показа. */
export type CartRow = {
  id: string;
  name: string;
  imageUrl: string | null;
  /** Цена за единицу, уже отформатированная. */
  unitPrice: string;
  quantity: number;
  /** Сколько единиц можно заказать (остаток на складе). */
  maxQuantity: number;
  /** Стоимость позиции, уже отформатированная. */
  lineTotal: string;
  available: boolean;
};

export type CartItemRowProps = CartRow & {
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
};

/** Товар с сервера вместе с количеством из корзины. */
export type CartEntry = {
  product: ProductDto;
  quantity: number;
};
