import { defineHandlers } from '#lib/utils.js'
import type { OrderService, AuthService } from '#service/index.js'
import { UnauthorizedError } from '#lib/errors.js'
import type { Order } from '#domain/order/order.js'
import type { OrderDto } from '../types/handlers/types.gen.ts'
import type { FastifyRequest } from 'fastify'

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

export const createOrderHandlers = (orderService: OrderService, authService: AuthService) => {
  const getSessionUser = (request: FastifyRequest) => {
    const token = request.cookies['session']
    if (!token) throw new UnauthorizedError('No session cookie')

    return authService.getCurrentUser(token)
  }

  return defineHandlers({
    getOrder: async (request, reply) => {
      const user = await getSessionUser(request)
      const order = await orderService.getOrder(request.params.id, user.id)
      return reply.code(200).send(toOrderDto(order))
    },
    getOrders: async (request, reply) => {
      const user = await getSessionUser(request)
      const ordersPage = await orderService.getOrders({
        userId: user.id,
        page: request.query?.page ?? 1,
        pageSize: request.query?.pageSize ?? 10,
      })
      return reply.code(200).send({
        items: ordersPage.items.map(toOrderDto),
        meta: ordersPage.meta,
      })
    },
    createOrder: async (request, reply) => {
      const { body } = request
      const user = await getSessionUser(request)
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
}
