/** Промо главной в виде, готовом для показа. */
export type PromoCardData = {
  id: string;
  /** Товар, на страницу которого ведёт промо. */
  productId: string;
  title: string;
  description: string;
  productName: string;
  /** Цена, уже отформатированная. */
  price: string;
  imageUrl: string | null;
};

export type PromoCardProps = PromoCardData;

export type PromoSectionProps = {
  promos: PromoCardData[];
};
