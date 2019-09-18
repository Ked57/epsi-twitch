import fastify from "fastify";
import { handleGame } from "./game";
import { write } from "./db";

const main = async () => {
  const app = fastify({});

  app.put("/game", (req, reply) => handleGame(req, reply));

  const address = await app.listen(Number(process.env.PORT || "3000"));
  try {
    setInterval(() => {
      console.log("writing");
      const date = Date.now();
      write({
        name: "World of warcraft",
        count: 80000 + Math.round(Math.random() * 100000),
        date,
      });
      write({
        name: "Fortnite",
        count: 150000 + Math.round(Math.random() * 300000),
        date
      });
      write({
        name: "CSGO",
        count: 150000 + Math.round(Math.random() * 100000),
        date
      });
      write({
        name: "Overwatch",
        count: 50000 + Math.round(Math.random() * 100000),
        date
      });
    }, 1000 * 5);
  } catch (err) {
    console.error(err);
  }

  return { app, address };
};

main()
  .then(fastify => console.log(`Server started: ${fastify.address}`))
  .catch(err => console.error(err));
