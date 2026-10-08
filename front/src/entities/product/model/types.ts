export type ProductCardProps = {
  id: string;
  name: string;
  description: string;
  categoryName: string;
  /** Цена, уже отформатированная для показа. */
  price: string;
  inStock: boolean;
  /** Ссылка на изображение; null, если у товара его нет. */
  imageUrl: string | null;
};
