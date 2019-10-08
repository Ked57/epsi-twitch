import { FastifyRequest, FastifyReply } from "fastify";
import { ServerResponse } from "http";
import { write } from "./db";

export const handleGame = async (
  request: FastifyRequest,
  reply: FastifyReply<ServerResponse>
) => {
  try {
    const {game, viewerCount} = request.body;
    console.log("game",game);
    console.log("viewerCount", viewerCount);
    if(typeof viewerCount !== "number" || typeof game !== "string"){
      throw new Error("Received invalid payload")
    }
    await write(game, viewerCount);
    reply.status(200).send();
  } catch (err) {
    console.error(err);
    reply.status(500).send(err);
  }
};
