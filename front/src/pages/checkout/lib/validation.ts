import type { CheckoutFormValues } from "../model/types";

const PHONE_DIGITS_COUNT = 11;

export const deliveryMethodOptions = [
  { value: "delivery", label: "Доставка" },
  { value: "pickup", label: "Самовывоз" },
];

export const checkoutFormValidation = {
  recipientName: (value: string) =>
    value.trim() ? null : "Введите имя получателя",
  phone: (value: string) =>
    value.replace(/\D/g, "").length === PHONE_DIGITS_COUNT
      ? null
      : "Введите телефон в формате +7 900 000-00-00",
  address: (value: string, values: CheckoutFormValues) =>
    values.deliveryMethod === "delivery" && !value.trim()
      ? "Введите адрес доставки"
      : null,
};
