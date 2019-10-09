import fastify from "fastify";
import { handleGame } from "./game";
import { getDataWithScale } from "./data";
import { authMiddleware } from "./auth";
import { getGamesList } from "./db";
import ampqlib from "amqplib";

const AMQP_USER = process.env.AMQP_USER || "";
const AMQP_PASS = process.env.AMQP_PASS || "";
const AMQP_HOST = process.env.AMQP_HOST || "";
const AMQP_QUEUE = process.env.AMQP_QUEUE || "";

const open = ampqlib.connect(`amqp://${AMQP_USER}:${AMQP_PASS}@${AMQP_HOST}`);

const main = async () => {
  const app = fastify({});

  app.addHook("preHandler", authMiddleware);

  //app.put("/game", (req, reply) => handleGame(req, reply));

  app.get("/", (req, reply) => getDataWithScale(req, reply));

  open
    .then(conn => {
      return conn.createChannel();
    })
    .then(ch => {
      return ch.assertQueue(AMQP_QUEUE, { durable: false }).then(ok => {
        return ch.consume(AMQP_QUEUE, async msg => {
          if (msg) {
            try {
              await handleGame(msg.content.toString());
              ch.ack(msg);
            } catch (err) {
              console.error(err);
              ch.nack(err);
            }
          }
        });
      });
    })
    .catch(console.warn);

  app.get("/list", (req, reply) => getGamesList());

  const address = await app.listen(
    Number(process.env.PORT || "3000"),
    process.env.HOST || "0.0.0.0"
  );

  return { app, address };
};

main()
  .then(fastify => console.log(`Server started: ${fastify.address}`))
  .catch(err => console.error(err));
