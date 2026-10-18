import type { CartRow } from "@/widgets/order-items";

export type CartItemRowProps = CartRow & {
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
};
