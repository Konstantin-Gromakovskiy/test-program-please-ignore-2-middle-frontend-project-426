import { db } from '#db/index.js'
import { cryptoUtils } from '#lib/cryptoUtils.js'
import { OutOfStockError, UnauthorizedError } from '#lib/errors.js'
import {
  CategoryRepository,
  ProductRepository,
  SessionRepository,
  UserRepository,
  OrderRepository,
  PromoRepository,
} from '#repository/index.js'
import {
  AuthService,
  CategoryService,
  ProductService,
  OrderService,
  PromoService,
} from '#service/index.js'
import { createRouteHandlers } from './routes/index.js'
import { BaseError } from './lib/errors.js'
import type { FastifyInstance, FastifyRequest } from 'fastify'
import type { UnitOfWork } from '#service/order/order.types.js'

type ErrorWithStatusCode = Error & { statusCode: number };

function isErrorWithStatusCode(error: unknown): error is ErrorWithStatusCode {
  return (
    error instanceof Error &&
    'statusCode' in error &&
    typeof error.statusCode === 'number'
  )
}

const userRepository = new UserRepository(db)
const sessionRepository = new SessionRepository(db)
const authService = new AuthService(
  userRepository,
  sessionRepository,
  cryptoUtils,
)

const categoryRepository = new CategoryRepository(db)
const categoryService = new CategoryService(categoryRepository)

const productRepository = new ProductRepository(db)
const productService = new ProductService(productRepository)

const orderUnitOfWork: UnitOfWork = {
  run: (fn) =>
    db.transaction((tx) =>
      fn({
        productRepository: new ProductRepository(tx),
        orderRepository: new OrderRepository(tx),
      }),
    ),
}

const orderRepository = new OrderRepository(db)
const orderService = new OrderService(orderUnitOfWork, orderRepository)

const promoRepository = new PromoRepository(db)
const promoService = new PromoService(promoRepository)

export const serviceHandlers = createRouteHandlers({
  authService,
  categoryService,
  productService,
  promoService,
  orderService,
})

export const securityHandlers = {
  SessionAuth: async (request: FastifyRequest) => {
    const token = request.cookies['session']
    if (!token) throw new UnauthorizedError('Session is required')

    await authService.validateSession(token)
  },
}

export function configureErrorHandler(fastify: FastifyInstance) {
  fastify.setErrorHandler((error, request, reply) => {
    if (error instanceof BaseError) {
      return reply.status(error.status).type('application/problem+json').send({
        type: error.type,
        title: error.title,
        status: error.status,
        detail: error.detail,
        instance: request.url,
        ...(error instanceof OutOfStockError && { problems: error.problems }),
      })
    }

    if (isErrorWithStatusCode(error)) {
      return reply
        .status(error.statusCode)
        .type('application/problem+json')
        .send({
          type: 'about:blank',
          title: error.name,
          status: error.statusCode,
          detail: error.message,
          instance: request.url,
        })
    }

    request.log.error(error)

    return reply.status(500).type('application/problem+json').send({
      type: 'about:blank',
      title: 'Internal Server Error',
      status: 500,
      instance: request.url,
    })
  })
}
