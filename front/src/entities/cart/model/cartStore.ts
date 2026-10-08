import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
};

/** Версия в ключе: при смене формата корзины старые данные просто игнорируются. */
const STORAGE_KEY = "cart:v1";

const isCartItem = (value: unknown): value is CartItem =>
  typeof value === "object" &&
  value !== null &&
  "productId" in value &&
  typeof value.productId === "string" &&
  "quantity" in value &&
  Number.isInteger(value.quantity) &&
  (value.quantity as number) > 0;

/** localStorage доверять нельзя: оставляем только корректные позиции. */
const parseItems = (persisted: unknown): CartItem[] => {
  if (
    typeof persisted !== "object" ||
    persisted === null ||
    !("items" in persisted) ||
    !Array.isArray(persisted.items)
  )
    return [];

  return persisted.items.filter(isCartItem);
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (productId) =>
        set(({ items }) => {
          const existing = items.find((item) => item.productId === productId);

          return {
            items: existing
              ? items.map((item) =>
                  item.productId === productId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item,
                )
              : [...items, { productId, quantity: 1 }],
          };
        }),
      setQuantity: (productId, quantity) =>
        set(({ items }) => ({
          items:
            quantity > 0
              ? items.map((item) =>
                  item.productId === productId ? { ...item, quantity } : item,
                )
              : items.filter((item) => item.productId !== productId),
        })),
      removeItem: (productId) =>
        set(({ items }) => ({
          items: items.filter((item) => item.productId !== productId),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ items }) => ({ items }),
      merge: (persisted, current) => ({
        ...current,
        items: parseItems(persisted),
      }),
    },
  ),
);

// Подтягиваем изменения корзины, сделанные в других вкладках
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY) void useCartStore.persist.rehydrate();
  });
}
