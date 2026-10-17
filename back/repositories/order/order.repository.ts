import type { DbOrTx } from '#db/index.js'
import type { NewOrder, Order } from '#domain/order/order.js'
import { orders, orderItems } from '#db/index.js'

class OrderRepository {
  constructor(private readonly db: DbOrTx) {}

  async createOrder(data: NewOrder) {

    const { items, ...orderData } = data

    const createdOrder: Order = await this.db.transaction(async (tx) => {
      const [order] = await tx.insert(orders).values(orderData).returning()
      if (!order) {
        throw new Error('Failed to create order')
      }
      const createdOrderItems = await tx.insert(orderItems).values(items.map(item => ({
        ...item,
        orderId: order.id,
      }))).returning()

      const { createdAt: _createdAt, updatedAt: _updatedAt, shippingAddress, deliveryMethod, ...orderInfo } = order

      if (deliveryMethod === 'delivery') {
        if (!shippingAddress) {
          throw new Error('Address is required for delivery')
        }
        return {
          items: createdOrderItems, ...orderInfo,
          shippingAddress,
          deliveryMethod,
        }
      }

      if (deliveryMethod === 'pickup') return {
        items: createdOrderItems, ...orderInfo, deliveryMethod,
      }

      throw new Error('Invalid delivery method')

    })

    return createdOrder
  }
}

export default OrderRepository

