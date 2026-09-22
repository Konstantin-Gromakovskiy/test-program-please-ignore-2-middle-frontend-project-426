import { defineHandlers } from "../lib/utils.js";
export const auth = defineHandlers({
  login: async (_, reply) => {
    reply.code(200).send({
      id: "50c20776-1509-4a95-8bdb-80bf76fc6ad7",
      email: "test@test.com",
    });
  },
  authLogout: async (_, reply) => {
    reply.code(204).send();
  },
  authMe: async (_, reply) => {
    reply.code(200).send({
      id: "50c20776-1509-4a95-8bdb-80bf76fc6ad7",
      email: "test@test.com",
    });
  },
  authRegister: async (_, reply) => {
    reply.code(201).send({
      id: "50c20776-1509-4a95-8bdb-80bf76fc6ad7",
      email: "test@test.com",
    });
  },
});
