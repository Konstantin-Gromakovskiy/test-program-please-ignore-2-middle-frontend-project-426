import { defineHandlers } from "../lib/utils.js";
import { AuthService } from "#service/index.js";
import { ConflictError, UnauthorizedError } from "#lib/errors.js";
import { UniqueConstraintError } from "#domain/errors/index.js";

export const createAuthHandlers = (AuthService: AuthService) =>
  defineHandlers({
    login: async (request, reply) => {
      const { email, password } = request.body;
      const userData = await AuthService.login(email, password);
      if (!userData)
        return reply
          .code(401)
          .send({ title: "Incorrect email or password", status: 401 });

      const { tokenData, user } = userData;

      reply.setCookie("session", tokenData.token, {
        httpOnly: true,
        expires: tokenData.expiresAt,
        path: "/",
        secure: process.env?.["NODE_ENV"] === "production",
        sameSite: "lax",
      });
      reply.code(200).send(user);
    },

    register: async (request, reply) => {
      const { email, password } = request.body;
      let user;
      try {
        user = await AuthService.register({ email, password });
      } catch (error) {
        if (error instanceof UniqueConstraintError) {
          throw new ConflictError("Email is already registered");
        }
        throw error;
      }
      reply.code(201).send(user);
    },
    logout: async (request, reply) => {
      const token = request.cookies["session"];
      if (!token) throw new UnauthorizedError("No session cookie");
      const sessionData = await AuthService.logout(token);
      if (!sessionData) throw new UnauthorizedError("Invalid session token");
      return reply.clearCookie("session", { path: "/" }).code(204).send();
    },
    me: async (request, reply) => {
      const token = request.cookies["session"];
      if (!token) throw new UnauthorizedError("No session cookie");

      const user = await AuthService.getCurrentUser(token);
      return reply.code(200).send(user);
    },
  });
