import { defineHandlers } from '#lib/utils.js'
import type { OrderService, AuthService } from '#service/index.js'
import { UnauthorizedError } from '#lib/errors.js'
import type { Order } from '#domain/order/order.js'
import type { OrderDto, OrdersPage } from '../types/handlers/types.gen.ts'

const toOrderDto = (order: Order): OrderDto => ({
  id: order.id,
  status: order.status,
  total: order.total,
  items: order.items.map(item => ({
    id: item.id,
    productId: item.productId,
    productName: item.name,
    imageUrl: item.imageUrl,
    unitPrice: item.price,
    quantity: item.quantity,
  })),
  ...(order.deliveryMethod === 'delivery' && { shippingAddress: order.shippingAddress }),
})

export const createOrderHandlers = (orderService: OrderService, authService: AuthService) =>
  defineHandlers({
    getOrder: async (_, reply) => {
      return reply.code(200).send({} as OrderDto)
    },
    getOrders: async (_, reply) => {
      return reply.code(200).send({} as OrdersPage)
    },
    createOrder: async (request, reply) => {
      const { body, cookies } = request
      const token = cookies['session']
      if (!token) throw new UnauthorizedError('No session cookie')

      const user = await authService.getCurrentUser(token)
      const { shippingAddress } = body
      const order = await orderService.createOrder({
        userId: user.id,
        products: body.items,
        ...(shippingAddress
          ? { deliveryMethod: 'delivery', shippingAddress }
          : { deliveryMethod: 'pickup' }),
      })
      return reply.code(201).send(toOrderDto(order))
    },
  })
