import { FastifyRequest, FastifyReply } from "fastify";
import { ServerResponse } from "http";
import { write } from "./db";

export const handleGame = async (
  request: FastifyRequest,
  reply: FastifyReply<ServerResponse>
) => {
  try {
    const body = request.body;
    await write(body);
    reply.status(200).send();
  } catch (err) {
    console.error(err);
    reply.status(500).send(err);
  }
};
