import { FastifyRequest, FastifyReply, FastifyError } from "fastify";
import { ServerResponse } from "http";

const token = process.env.TOKEN || "";

export const authMiddleware = (
  req: FastifyRequest,
  res: FastifyReply<ServerResponse>,
  done: (err?: FastifyError) => void
) => {
  if (req.req.method !== "PUT") {
    done();
    return;
  }
  const authHeader = req.headers.authorization;
  if (!isAuthHeader(authHeader) || !authorize(authHeader)) {
    done({ name: "AuthError", statusCode: 403, message: "Unauthorized" });
  }
  done();
};

const authorize = (authHeader: string) => authHeader.split(" ")[1] === token;

const isAuthHeader = (authHeader: unknown) =>
  typeof authHeader === "string" && authHeader.match(/Bearer[ ].*/g);
