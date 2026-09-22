import type { RouteHandlers } from "../types/handlers/fastify.gen.ts";

export const healthCheck: RouteHandlers["healthCheck"] = async (_, reply) => {
  return reply.code(200).send({ status: "ok" });
};
