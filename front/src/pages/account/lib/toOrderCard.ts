import { formatPrice } from "@/entities/product";
import type { OrderDto } from "@/shared/api";
import type { OrderCardData } from "../model/types";

const SHORT_NUMBER_LENGTH = 8;

const DELIVERY_LABELS: Record<OrderDto["deliveryMethod"], string> = {
  delivery: "Доставка",
  pickup: "Самовывоз",
};

const STATUS_LABELS: Record<OrderDto["status"], string> = {
  paid: "Оплачен",
};

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  dateStyle: "short",
  timeStyle: "short",
});

export const toOrderCard = (order: OrderDto): OrderCardData => ({
  id: order.id,
  number: order.id.slice(0, SHORT_NUMBER_LENGTH),
  status: order.status,
  statusLabel: STATUS_LABELS[order.status],
  createdAt: dateFormatter.format(new Date(order.createdAt)),
  methodLabel: DELIVERY_LABELS[order.deliveryMethod],
  lines: order.items.map((item) => ({
    id: item.id,
    name: item.productName,
    quantity: item.quantity,
    unitPrice: formatPrice(item.unitPrice),
  })),
  total: formatPrice(order.total),
});
