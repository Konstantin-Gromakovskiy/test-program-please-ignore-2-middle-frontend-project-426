import { db } from "#db/index.js";
import { cryptoUtils } from "#lib/cryptoUtils.js";
import { UnauthorizedError } from "#lib/errors.js";
import { SessionRepository, UserRepository } from "#repository/index.js";
import { AuthService } from "#service/index.js";
import { createRouteHandlers } from "./routes/index.js";
import type { FastifyRequest } from "fastify";

const userRepository = new UserRepository(db);
const sessionRepository = new SessionRepository(db);
const authService = new AuthService(
  userRepository,
  sessionRepository,
  cryptoUtils,
);

export const serviceHandlers = createRouteHandlers({ authService });

export const securityHandlers = {
  SessionAuth: async (request: FastifyRequest) => {
    const token = request.cookies["session"];
    if (!token) throw new UnauthorizedError("Session is required");

    await authService.validateSession(token);
  },
};
