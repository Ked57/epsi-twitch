import fastify from "fastify";
import { handleGame } from "./game";
import { write } from "./db";

const main = async () => {
  const app = fastify({});

  app.put("/game", (req, reply) => handleGame(req, reply));

  const address = await app.listen(Number(process.env.PORT || "3000"));

  return { app, address };
};

main()
  .then(fastify => console.log(`Server started: ${fastify.address}`))
  .catch(err => console.error(err));
