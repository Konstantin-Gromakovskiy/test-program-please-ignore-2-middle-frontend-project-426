import { and, asc, count, desc, eq, inArray } from 'drizzle-orm'
import type { DbOrTx } from '#db/index.js'
import type { NewOrder, Order, OrderItem, OrdersFilter } from '#domain/order/order.js'
import { orders, orderItems } from '#db/index.js'

type OrderRow = typeof orders.$inferSelect

const toOrder = (row: OrderRow, items: OrderItem[]): Order => {
  const { createdAt: _createdAt, updatedAt: _updatedAt, shippingAddress, deliveryMethod, ...orderInfo } = row

  if (deliveryMethod === 'delivery') {
    if (!shippingAddress) {
      throw new Error('Address is required for delivery')
    }
    return { items, ...orderInfo, shippingAddress, deliveryMethod }
  }

  if (deliveryMethod === 'pickup') return { items, ...orderInfo, deliveryMethod }

  throw new Error('Invalid delivery method')
}

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

      return toOrder(order, createdOrderItems)
    })

    return createdOrder
  }

  async getOrderById(id: string, userId: string): Promise<Order | undefined> {
    const [row] = await this.db
      .select()
      .from(orders)
      .where(and(eq(orders.id, id), eq(orders.userId, userId)))
      .limit(1)
    if (!row) return undefined

    const items = await this.db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, row.id))
      .orderBy(asc(orderItems.createdAt), asc(orderItems.id))

    return toOrder(row, items)
  }

  async getOrdersByUserId(
    userId: string,
    { limit, offset }: OrdersFilter,
  ): Promise<{ items: Order[], totalItems: number }> {
    const [rows, [totalRow]] = await Promise.all([
      this.db
        .select()
        .from(orders)
        .where(eq(orders.userId, userId))
        .orderBy(desc(orders.createdAt), desc(orders.id))
        .limit(limit)
        .offset(offset),
      this.db
        .select({ total: count() })
        .from(orders)
        .where(eq(orders.userId, userId)),
    ])

    const totalItems = totalRow?.total ?? 0
    if (rows.length === 0) return { items: [], totalItems }

    const itemRows = await this.db
      .select()
      .from(orderItems)
      .where(inArray(orderItems.orderId, rows.map(({ id }) => id)))
      .orderBy(asc(orderItems.createdAt), asc(orderItems.id))

    const itemsByOrderId = Map.groupBy(itemRows, ({ orderId }) => orderId)

    return {
      items: rows.map(row => toOrder(row, itemsByOrderId.get(row.id) ?? [])),
      totalItems,
    }
  }
}

export default OrderRepository
