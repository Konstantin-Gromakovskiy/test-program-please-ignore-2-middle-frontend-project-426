import type { FastifyPluginAsync } from "fastify";

type ErrorCheckParams = {
  statusCode: string;
};

export const errorCheck: FastifyPluginAsync = async (fastify) => {
  fastify.get<{ Params: ErrorCheckParams }>(
    "/error-check/:statusCode",
    async (request) => {
      const statusCode = Number(request.params.statusCode);
      const error = new Error(`Error check: ${statusCode}`) as Error & {
        statusCode: number;
      };

      error.statusCode = statusCode;
      throw error;
    },
  );
};
