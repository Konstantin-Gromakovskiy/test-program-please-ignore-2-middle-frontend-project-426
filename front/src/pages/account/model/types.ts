/** Параметры страницы личного кабинета в URL. */
export type AccountSearch = {
  page: number;
};

/** Заказ в списке, готовый к показу. */
export type OrderCardData = {
  id: string;
  /** Короткий номер для заголовка. */
  number: string;
  methodLabel: string;
  /** Названия товаров через запятую. */
  summary: string;
  total: string;
};

export type OrderCardProps = OrderCardData;

export type OrdersListProps = {
  orders: OrderCardData[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};
