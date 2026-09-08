import type { FastifyPluginAsync } from "fastify";
import { errorCheck } from "./error-check.js";
import { healthCheck } from "./health-check.js";

const routes: FastifyPluginAsync = async (fastify) => {
  if (process.env["NODE_ENV"] === "development") {
    fastify.register(errorCheck);
  }
  fastify.register(healthCheck);
};

export default routes;
