import type { FastifyPluginAsync } from "fastify";

export const healthCheck: FastifyPluginAsync = async (fastify) => {
  fastify.get("/health-check", async () => {
    return { status: "ok" };
  });
};
