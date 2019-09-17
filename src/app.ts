import fastify from "fastify";
import { handleGame } from "./game";

export const main = async () => {
  const app = fastify({});

  app.put("/game", (req, reply) => handleGame(req, reply));

  const address = await app.listen(Number(process.env.PORT || "3000"));

  return { app, address };
};

main().catch(err => console.error(err));
