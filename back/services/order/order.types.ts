import type { ProductRepository } from '#repository/product/product.repository.js'
import OrderRepository from '#repository/order/order.repository.js'

export type { OrderRepository }

export type GetOrdersParams = {
  userId: string;
  page: number;
  pageSize: number;
}

export interface UnitOfWork {
  run<T>(fn: (repos: {
    productRepository: ProductRepository,
    orderRepository: OrderRepository
  }) => Promise<T>): Promise<T>
}
