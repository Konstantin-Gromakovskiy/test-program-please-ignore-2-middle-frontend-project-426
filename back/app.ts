import Fastify from "fastify";
import routes from "@/routes/index.js";

const fastify = Fastify();

fastify.register(routes);

fastify.get("/ping", async () => {
  return "pong\n";
});

//коммент
fastify.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
