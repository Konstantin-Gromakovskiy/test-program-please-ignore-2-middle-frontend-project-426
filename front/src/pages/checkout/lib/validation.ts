import type { CheckoutFormValues } from "../model/types";
import { normalizePhone } from "./createOrderBody";

export const deliveryMethodOptions = [
  { value: "delivery", label: "Доставка" },
  { value: "pickup", label: "Самовывоз" },
];

export const checkoutFormValidation = {
  recipientName: (value: string) =>
    value.trim() ? null : "Введите имя получателя",
  phone: (value: string) =>
    normalizePhone(value) ? null : "Введите телефон в формате +7 900 000-00-00",
  address: (value: string, values: CheckoutFormValues) =>
    values.deliveryMethod === "delivery" && !value.trim()
      ? "Введите адрес доставки"
      : null,
};
