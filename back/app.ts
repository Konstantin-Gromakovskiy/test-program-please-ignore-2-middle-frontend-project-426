import * as Sentry from "@sentry/node";
import Fastify from "fastify";
import { securityHandlers, serviceHandlers } from "./composition.js";
import { fastifyStatic } from "@fastify/static";
import path from "path";
import glue from "fastify-openapi-glue";
import cookie from "@fastify/cookie";
import { BaseError } from "./lib/errors.js";

const SENTRY_DSN = process.env["SENTRY_DSN"];
const NODE_ENV = process.env["NODE_ENV"];
const PORT = process.env["PORT"];

if (!NODE_ENV) throw new Error("NODE_ENV is not set");
if (!PORT) throw new Error("PORT is not set");

type ErrorWithStatusCode = Error & { statusCode: number };

function isErrorWithStatusCode(error: unknown): error is ErrorWithStatusCode {
  return (
    error instanceof Error &&
    "statusCode" in error &&
    typeof error.statusCode === "number"
  );
}

if (SENTRY_DSN) Sentry.init({ dsn: SENTRY_DSN, environment: NODE_ENV });

const fastify = Fastify({ logger: true });
const contractRoot = path.resolve(process.cwd(), "../contract");
const OPENAPI_SPECIFICATION = path.join(
  contractRoot,
  "tsp-output/schema/openapi.json",
);

fastify.register(cookie).register(glue, {
  specification: OPENAPI_SPECIFICATION,
  serviceHandlers,
  securityHandlers,
});

// Backend routes
fastify.get("/api/openapi.json", (_, reply) => {
  return reply
    .type("application/json")
    .sendFile("openapi.json", path.join(contractRoot, "tsp-output/schema"));
});
fastify.get("/api/docs", (_, reply) => {
  return reply.type("text/html").sendFile("index.html", contractRoot);
});
// Frontend routes
fastify.register(fastifyStatic, {
  root: path.resolve(process.cwd(), "../front/dist"),
  prefix: "/",
});

fastify.setNotFoundHandler((request, reply) => {
  if (request.url.startsWith("/api")) return reply.code(404).send();

  return reply.sendFile("index.html");
});

fastify.setErrorHandler((error, request, reply) => {
  if (error instanceof BaseError) {
    return reply.status(error.status).type("application/problem+json").send({
      type: error.type,
      title: error.title,
      status: error.status,
      detail: error.detail,
      instance: request.url,
    });
  }

  if (isErrorWithStatusCode(error)) {
    return reply.status(error.statusCode).type("application/problem+json").send({
      type: "about:blank",
      title: error.name,
      status: error.statusCode,
      detail: error.message,
      instance: request.url,
    });
  }

  request.log.error(error);

  return reply.status(500).type("application/problem+json").send({
    type: "about:blank",
    title: "Internal Server Error",
    status: 500,
    instance: request.url,
  });
});

fastify.listen({ host: "0.0.0.0", port: Number(PORT) }, (err, address) => {
  if (err) {
    console.error(err);
    Sentry.captureException(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
