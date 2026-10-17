export enum OrderStatus {
  Paid = 'paid',
}

type DeliveryInfo =
  | { deliveryMethod: 'pickup' }
  | { deliveryMethod: 'delivery', shippingAddress: string };

type BaseOrderData = {
  id: string;
  status: 'paid';
  total: number;
  userId: string;
  items: OrderItem[];
}

export type Order = DeliveryInfo & BaseOrderData;

export type OrderItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
  productId: string;
}

export type NewOrderItem = Omit<OrderItem, 'id'>

export type NewOrder = DeliveryInfo & {
  userId: string;
  status: 'paid';
  total: number;
  items: NewOrderItem[];
};

export type OrdersFilter = {
  limit: number;
  offset: number;
}

export type OrdersPage = {
  items: Order[];
  meta: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export type CreateOrderInput = DeliveryInfo & {
  userId: string;
  products: {
    productId: string;
    quantity: number;
  }[]
}
