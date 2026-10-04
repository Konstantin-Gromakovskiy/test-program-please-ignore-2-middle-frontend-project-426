import { errorCheck } from "./error-check.js";
import { healthCheck } from "./health-check.js";
import { createAuthHandlers } from "./auth.js";
import { createProductHandlers } from "./products.js";
import type { RouteHandlers } from "../types/handlers/fastify.gen.ts";
import type { AuthService, ProductService } from "#service/index.js";

export function createRouteHandlers({
  authService,
  productService,
}: {
  authService: AuthService;
  productService: ProductService;
}) {
  const handlers: RouteHandlers = {
    ...createAuthHandlers(authService),
    ...createProductHandlers(productService),
    healthCheck,
    errorCheck,
  };

  return handlers;
}
