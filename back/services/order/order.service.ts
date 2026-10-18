import type { GetOrdersParams, OrderRepository, UnitOfWork } from './order.types.js'
import type { CreateOrderInput, NewOrder, NewOrderItem, Order, OrdersPage } from '#domain/order/order.js'
import { BadRequestError, NotFoundError, OutOfStockError } from '#lib/errors.js'
import type { StockProblem } from '#lib/errors.js'

export default class OrderService {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly orderRepository: OrderRepository,
  ) {}

  async getOrder(id: string, userId: string): Promise<Order> {
    const order = await this.orderRepository.getOrderById(id, userId)
    if (!order) throw new NotFoundError('Order not found')

    return order
  }

  async getOrders({ userId, page, pageSize }: GetOrdersParams): Promise<OrdersPage> {
    const { items, totalItems } = await this.orderRepository.getOrdersByUserId(userId, {
      limit: pageSize,
      offset: (page - 1) * pageSize,
    })

    return {
      items,
      meta: {
        page,
        pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
      },
    }
  }

  async createOrder(data: CreateOrderInput) {
    const { products } = data

    if (products.length === 0) throw new BadRequestError('Order must contain at least one product')

    const requestedIds = products.map(({ productId }) => productId)
    if (new Set(requestedIds).size !== requestedIds.length) throw new BadRequestError('Duplicate product ids')

    products.forEach(({ productId, quantity }) => {
      if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new BadRequestError(`Invalid quantity for product id: ${productId}`)
      }
    })

    return await this.unitOfWork.run(async ({ orderRepository, productRepository }) => {
      const productsInfo = await productRepository.getProductsByIds(requestedIds)
      const productById = new Map(productsInfo.map((product) => [product.id, product]))

      const orderItems: NewOrderItem[] = products.map(({ productId, quantity }) => {
        const product = productById.get(productId)
        if (!product) throw new NotFoundError(`Product id: ${productId} not found`)

        return {
          productId,
          quantity,
          name: product.name,
          description: product.description,
          price: product.price,
          imageUrl: product.imageUrl,
        }
      })

      const problems: StockProblem[] = products.flatMap(({ productId, quantity }) => {
        const product = productById.get(productId)
        return product && product.stock < quantity
          ? [{ productId, name: product.name, requested: quantity, available: product.stock }]
          : []
      })
      if (problems.length > 0) throw new OutOfStockError(problems)

      for (const { productId, quantity } of products) {
        await productRepository.decreaseStock(productId, quantity)
      }

      const deliveryInfo = data.deliveryMethod === 'pickup' ? { deliveryMethod: data.deliveryMethod }
        : { deliveryMethod: data.deliveryMethod, shippingAddress: data.shippingAddress }

      const total = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

      const newOrder: NewOrder = {
        status: 'paid',
        ...deliveryInfo,
        recipientName: data.recipientName,
        recipientPhone: data.recipientPhone,
        userId: data.userId,
        total,
        items: orderItems,
      }
      return orderRepository.createOrder(newOrder)
    })
  }
}

