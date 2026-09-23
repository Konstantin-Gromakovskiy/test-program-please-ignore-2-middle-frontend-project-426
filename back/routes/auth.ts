import { defineHandlers } from "../lib/utils.js";
import { AuthService } from "#service/index.js";

export const createAuthHandlers = (AuthService: AuthService) =>
  defineHandlers({
    login: async (_, reply) => {
      reply.code(200).send({
        id: "50c20776-1509-4a95-8bdb-80bf76fc6ad7",
        email: "test@test.com",
      });
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
