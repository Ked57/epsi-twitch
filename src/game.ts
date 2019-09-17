import { FastifyRequest, FastifyReply } from "fastify";
import { ServerResponse } from "http";

export const handleGame = (
  request: FastifyRequest,
  reply: FastifyReply<ServerResponse>
) => {
  const body = request.body
  console.log(body);
};
