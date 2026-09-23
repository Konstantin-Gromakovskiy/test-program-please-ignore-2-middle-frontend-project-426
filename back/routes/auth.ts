import { defineHandlers } from "../lib/utils.js";
import { AuthService } from "#service/index.js";

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
      const user = await AuthService.register({ email, password });
      reply.code(201).send(user);
    },
    logout: async (_, reply) => {
      reply.code(204).send();
    },
    me: async (_, reply) => {
      reply.code(200).send({
        id: "50c20776-1509-4a95-8bdb-80bf76fc6ad7",
        email: "test@test.com",
      });
    },
  });
