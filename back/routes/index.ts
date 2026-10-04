import { errorCheck } from "./error-check.js";
import { healthCheck } from "./health-check.js";
import { createAuthHandlers } from "./auth.js";
import { createCategoryHandlers } from "./categories.js";
import { createProductHandlers } from "./products.js";
import type { RouteHandlers } from "../types/handlers/fastify.gen.ts";
import type {
  AuthService,
  CategoryService,
  ProductService,
} from "#service/index.js";

export function createRouteHandlers({
  authService,
  categoryService,
  productService,
}: {
  authService: AuthService;
  categoryService: CategoryService;
  productService: ProductService;
}) {
  const handlers: RouteHandlers = {
    ...createAuthHandlers(authService),
    ...createCategoryHandlers(categoryService),
    ...createProductHandlers(productService),
    healthCheck,
    errorCheck,
  };

  return handlers;
}
