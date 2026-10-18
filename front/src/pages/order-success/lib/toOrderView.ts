import { formatPrice } from "@/entities/product";
import type { OrderDto } from "@/shared/api";
import type { OrderItemRow } from "@/widgets/order-items";
import type { OrderDelivery } from "../model/types";

const DELIVERY_LABELS: Record<OrderDto["deliveryMethod"], string> = {
  delivery: "Доставка",
  pickup: "Самовывоз",
};

export const toOrderRows = ({ items }: OrderDto): OrderItemRow[] =>
  items.map((item) => ({
    id: item.id,
    name: item.productName,
    imageUrl: item.imageUrl,
    unitPrice: formatPrice(item.unitPrice),
    quantity: item.quantity,
    lineTotal: formatPrice(item.unitPrice * item.quantity),
  }));

export const toOrderDelivery = (order: OrderDto): OrderDelivery => ({
  methodLabel: DELIVERY_LABELS[order.deliveryMethod],
  recipientName: order.recipientName,
  recipientPhone: order.recipientPhone,
  address: order.shippingAddress,
});
