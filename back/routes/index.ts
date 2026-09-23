import { errorCheck } from "./error-check.js";
import { healthCheck } from "./health-check.js";
import { createAuthHandlers } from "./auth.js";
import type { RouteHandlers } from "../types/handlers/fastify.gen.ts";
import { AuthService } from "#service/index.js";
import { UserRepository } from "#repository/index.js";
import { db } from "#db/index.js";

const userRepository = new UserRepository(db);
const authService = new AuthService(userRepository);

const routes: RouteHandlers = {
  ...createAuthHandlers(authService),
  healthCheck,
  errorCheck,
};

export default routes;
