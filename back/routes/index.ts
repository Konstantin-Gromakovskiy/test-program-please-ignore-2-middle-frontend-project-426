import type { FastifyPluginAsync } from "fastify";
import { healthCheck } from "./health-check.js";

const routes: FastifyPluginAsync = async (fastify) => {
  fastify.register(healthCheck);
};

export default routes;
