import { errorCheck } from "./error-check.js";
import { healthCheck } from "./health-check.js";
import { createAuthHandlers } from "./auth.js";
import type { RouteHandlers } from "../types/handlers/fastify.gen.ts";
import type { AuthService } from "#service/index.js";

export function createRouteHandlers({
  authService,
}: {
  authService: AuthService;
}) {
  const handlers: RouteHandlers = {
    ...createAuthHandlers(authService),
    healthCheck,
    errorCheck,
  };

  return handlers;
}
