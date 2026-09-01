import Fastify from "fastify";
import routes from "@/routes/index.js";
import { fastifyStatic } from "@fastify/static";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const fastify = Fastify();

// Backend routes
fastify.register(routes, { prefix: "/api" });
// Frontend routes
fastify.register(fastifyStatic, { root: path.join(__dirname, "../front/dist"), prefix: "/" });

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
