import { defineHandlers } from '#lib/utils.js'
import type { OrderService, AuthService } from '#service/index.js'
import { BadRequestError, UnauthorizedError } from '#lib/errors.js'
import type { Order } from '#domain/order/order.js'
import type { OrderDto } from '../types/handlers/types.gen.ts'
import type { FastifyRequest } from 'fastify'

const toOrderDto = (order: Order): OrderDto => ({
  id: order.id,
  status: order.status,
  total: order.total,
  deliveryMethod: order.deliveryMethod,
  recipientName: order.recipientName,
  recipientPhone: order.recipientPhone,
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
      const { deliveryMethod, shippingAddress } = body

      if (deliveryMethod === 'delivery' && !shippingAddress) {
        throw new BadRequestError('Shipping address is required for delivery')
      }
      if (deliveryMethod === 'pickup' && shippingAddress) {
        throw new BadRequestError('Shipping address is not allowed for pickup')
      }

      const order = await orderService.createOrder({
        userId: user.id,
        products: body.items,
        recipientName: body.recipientName,
        recipientPhone: body.recipientPhone,
        ...(deliveryMethod === 'delivery' && shippingAddress
          ? { deliveryMethod, shippingAddress }
          : { deliveryMethod: 'pickup' }),
      })
      return reply.code(201).send(toOrderDto(order))
    },
  })
}
