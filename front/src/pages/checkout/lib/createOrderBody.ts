import type { CreateOrderRequest } from "@/shared/api";
import type { CheckoutFormValues, OrderLine } from "../model/types";

const PHONE_DIGITS_COUNT = 11;

/** Приводит телефон к формату контракта +7XXXXXXXXXX; null, если номер некорректный. */
export const normalizePhone = (value: string) => {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== PHONE_DIGITS_COUNT) return null;
  if (!digits.startsWith("7") && !digits.startsWith("8")) return null;

  return `+7${digits.slice(1)}`;
};

export const toCreateOrderBody = (
  { deliveryMethod, recipientName, phone, address }: CheckoutFormValues,
  lines: OrderLine[],
): CreateOrderRequest => ({
  items: lines,
  deliveryMethod,
  recipientName: recipientName.trim(),
  recipientPhone: normalizePhone(phone) ?? phone,
  ...(deliveryMethod === "delivery" && { shippingAddress: address.trim() }),
});
