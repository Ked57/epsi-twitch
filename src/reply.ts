import { FastifyReply } from "fastify";
import { ServerResponse } from "http";

export const badRequest = (
  err: string,
  reply: FastifyReply<ServerResponse>
) => {
  if (!err) {
    throw new Error(
      "Error while handling a bad request: no error message specified"
    );
  }
  reply
    .status(400)
    .send({ name: "Bad Request", statusCode: 403, message: err });
};
