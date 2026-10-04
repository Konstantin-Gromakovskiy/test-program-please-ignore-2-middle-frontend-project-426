export type ProductCardProps = {
  name: string;
  description: string;
  categoryName: string;
  /** Цена, уже отформатированная для показа. */
  price: string;
  inStock: boolean;
};
