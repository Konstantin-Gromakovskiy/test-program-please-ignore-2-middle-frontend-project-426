import Fastify from "fastify";
import routes from "#routes/index";
import { fastifyStatic } from "@fastify/static";
import path from "path";

const fastify = Fastify();

// Backend routes
fastify.register(routes, { prefix: "/api" });
// Frontend routes
fastify.register(fastifyStatic, { root: path.resolve(process.cwd(), "../front/dist"), prefix: "/" });

fastify.setNotFoundHandler((request, reply) => {
  if (request.url.startsWith("/api")) return reply.code(404).send();

  return reply.sendFile("index.html");
});

fastify.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
