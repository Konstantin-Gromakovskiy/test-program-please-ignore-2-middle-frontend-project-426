/** Параметры страницы успеха в URL. */
export type OrderSuccessSearch = {
  orderId: string;
};

/** Получатель и способ получения, готовые к показу. */
export type OrderDelivery = {
  methodLabel: string;
  recipientName: string;
  recipientPhone: string;
  /** Только у доставки. */
  address?: string;
};

export type OrderDeliveryInfoProps = {
  delivery: OrderDelivery;
};
