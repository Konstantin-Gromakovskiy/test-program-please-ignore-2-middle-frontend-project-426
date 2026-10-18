import { formatPrice } from "@/entities/product";
import type { OrderDto } from "@/shared/api";
import type { OrderCardData } from "../model/types";

const SHORT_NUMBER_LENGTH = 8;

const DELIVERY_LABELS: Record<OrderDto["deliveryMethod"], string> = {
  delivery: "Доставка",
  pickup: "Самовывоз",
};

export const toOrderCard = (order: OrderDto): OrderCardData => ({
  id: order.id,
  number: order.id.slice(0, SHORT_NUMBER_LENGTH),
  methodLabel: DELIVERY_LABELS[order.deliveryMethod],
  summary: order.items
    .map((item) => `${item.productName} × ${item.quantity}`)
    .join(", "),
  total: formatPrice(order.total),
});
