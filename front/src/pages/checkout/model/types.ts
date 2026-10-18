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

/** Ошибка оформления, готовая к показу. */
export type OrderErrorView = {
  message: string;
  /** Проблемные товары, по одной строке на товар. */
  problems: string[];
};

export type CheckoutFormProps = {
  lines: OrderLine[];
};
