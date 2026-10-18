export type DeliveryMethod = "delivery" | "pickup";

export type CheckoutFormValues = {
  deliveryMethod: DeliveryMethod;
  recipientName: string;
  phone: string;
  address: string;
};

/** Позиция заказа: что и в каком количестве уходит на сервер. */
export type OrderLine = {
  productId: string;
  quantity: number;
};

export type CheckoutFormProps = {
  lines: OrderLine[];
};
