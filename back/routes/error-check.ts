import type { RouteHandlers } from "../types/handlers/fastify.gen.ts";

export const errorCheck: RouteHandlers["errorCheck"] = async (request) => {
  const statusCode = Number(request.params.statusCode);
  const error = new Error(`Error check: ${statusCode}`) as Error & {
    statusCode: number;
  };

  error.statusCode = statusCode;
  throw error;
};
