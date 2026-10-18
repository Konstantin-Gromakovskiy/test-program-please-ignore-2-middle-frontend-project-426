import { formatPrice } from "@/entities/product";
import type { PromoDto } from "@/shared/api";
import type { PromoCardData } from "../model/types";

export const toPromoCard = ({
  id,
  title,
  description,
  product,
}: PromoDto): PromoCardData => ({
  id,
  productId: product.id,
  title,
  description,
  productName: product.name,
  price: formatPrice(product.price),
  imageUrl: product.imageUrl,
});
