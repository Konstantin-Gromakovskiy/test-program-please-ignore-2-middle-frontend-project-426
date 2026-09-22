import { errorCheck } from "./error-check.js";
import { healthCheck } from "./health-check.js";
import { auth } from "./auth.js";
import type { RouteHandlers } from "../types/handlers/fastify.gen.ts";

const routes: RouteHandlers = {
  ...auth,
  healthCheck,
  errorCheck,
};

export default routes;
