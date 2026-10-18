import { errorCheck } from './error-check.js'
import { healthCheck } from './health-check.js'
import { createAuthHandlers } from './auth.js'
import { createCategoryHandlers } from './categories.js'
import { createProductHandlers } from './products.js'
import { createOrderHandlers } from './orders.js'
import { createPromoHandlers } from './promos.js'
import type { RouteHandlers } from '../types/handlers/fastify.gen.ts'
import type {
  AuthService,
  CategoryService,
  ProductService,
  OrderService,
  PromoService,
} from '#service/index.js'

export function createRouteHandlers({
  authService,
  categoryService,
  productService,
  orderService,
  promoService,
}: {
  authService: AuthService;
  categoryService: CategoryService;
  productService: ProductService;
  orderService: OrderService;
  promoService: PromoService;
}) {
  const handlers: RouteHandlers = {
    ...createAuthHandlers(authService),
    ...createCategoryHandlers(categoryService),
    ...createProductHandlers(productService),
    ...createOrderHandlers(orderService, authService),
    ...createPromoHandlers(promoService),
    healthCheck,
    errorCheck,
  }

  return handlers
}
