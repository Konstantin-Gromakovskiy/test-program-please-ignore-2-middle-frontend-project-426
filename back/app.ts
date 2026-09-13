import * as Sentry from "@sentry/node";
import Fastify from "fastify";
import routes from "#routes/index";
import { fastifyStatic } from "@fastify/static";
import path from "path";

const SENTRY_DSN = process.env["SENTRY_DSN"];
const NODE_ENV = process.env["NODE_ENV"];
const PORT = process.env["PORT"];

if (!NODE_ENV) throw new Error("NODE_ENV is not set");
if (!PORT) throw new Error("PORT is not set");

type ErrorWithStatusCode = Error & { statusCode: number };

function isErrorWithStatusCode(error: unknown): error is ErrorWithStatusCode {
  return error instanceof Error && "statusCode" in error && typeof error.statusCode === "number";
}

if (SENTRY_DSN) Sentry.init({ dsn: SENTRY_DSN, environment: NODE_ENV });

const fastify = Fastify({ logger: true });
const contractRoot = path.resolve(process.cwd(), "../contract");

// Backend routes
fastify.register(routes, { prefix: "/api" });
fastify.get("/api/openapi.json", (_, reply) => {
  return reply.type("application/json").sendFile("openapi.json", path.join(contractRoot, "tsp-output/schema"));
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

fastify.setErrorHandler((error, _, reply) => {
  const statusCode = isErrorWithStatusCode(error) ? error.statusCode : 500;

  if (statusCode >= 500) Sentry.captureException(error);

  const errorMessage =
    statusCode >= 500
      ? "Internal Server Error"
      : error instanceof Error
        ? error.message
        : "Request failed";

  reply.code(statusCode).send({ error: errorMessage });
});

fastify.listen({ host: "0.0.0.0", port: Number(PORT) }, (err, address) => {
  if (err) {
    console.error(err);
    Sentry.captureException(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
