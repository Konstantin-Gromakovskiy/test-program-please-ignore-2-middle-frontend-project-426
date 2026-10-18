/** Параметры страницы личного кабинета в URL. */
export type AccountSearch = {
  page: number;
};

/** Позиция заказа с ценой на момент покупки, готовая к показу. */
export type OrderLineData = {
  id: string;
  name: string;
  quantity: number;
  /** Цена за штуку на момент покупки. */
  unitPrice: string;
};

/** Заказ в списке, готовый к показу. */
export type OrderCardData = {
  id: string;
  /** Короткий номер для заголовка. */
  number: string;
  /** Значение статуса заказа, например paid. */
  status: string;
  statusLabel: string;
  createdAt: string;
  methodLabel: string;
  lines: OrderLineData[];
  total: string;
};

export type OrderCardProps = OrderCardData;

export type OrdersListProps = {
  orders: OrderCardData[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};
