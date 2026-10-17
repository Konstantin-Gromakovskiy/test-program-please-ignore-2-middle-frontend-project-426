import type { UnitOfWork } from './order.types.js'
import type { CreateOrderInput, NewOrder, NewOrderItem } from '#domain/order/order.js'
import { BadRequestError, NotFoundError } from '#lib/errors.js'

export default class OrderService {
  constructor(private readonly unitOfWork: UnitOfWork) {}

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

      const deliveryInfo = data.deliveryMethod === 'pickup' ? { deliveryMethod: data.deliveryMethod }
        : { deliveryMethod: data.deliveryMethod, shippingAddress: data.shippingAddress }

      const total = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

      const newOrder: NewOrder = {
        status: 'paid',
        ...deliveryInfo,
        userId: data.userId,
        total,
        items: orderItems,
      }
      return orderRepository.createOrder(newOrder)
    })
  }
}

