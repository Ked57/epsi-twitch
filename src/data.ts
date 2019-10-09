import { FastifyRequest, FastifyReply } from "fastify";
import { ServerResponse } from "http";
import { badRequest } from "./reply";
import { read } from "./db";

export type Scale = "ms" | "s" | "h" | "d" | "w" | "m" | "y";

export const getDataWithScale = async (
  request: FastifyRequest,
  reply: FastifyReply<ServerResponse>
) => {
  try {
    const date = new Date(request.query.date);
    const scale = request.query.scale;
    const gamesListString = request.query.games;
    let games: string[] = [];
    if (!isDate(date)) {
      badRequest(
        "Error: no date param specified or incorrect parameter",
        reply
      );
      return;
    }
    if (!isScale(scale)) {
      badRequest(
        "Error: no scale param specified or incorrect parameter",
        reply
      );
      return;
    }
    if(typeof gamesListString === "string"){
      games = gamesListString.split(",");
    }
    return await matchRead(date, scale, games);
  } catch (err) {
    console.error(err);
    reply.status(500).send(err);
  }
};

const matchRead = (date: Date, scale: Scale, games?: string[]) =>
  read(date, scale, games);

const isDate = (date: any): date is Date =>
  date && typeof Date.parse(date) === "number";
const isScale = (scale: unknown): scale is Scale =>
  typeof scale === "string" &&
  (scale === "ms" ||
    scale === "s" ||
    scale === "h" ||
    scale === "d" ||
    scale === "w" ||
    scale === "m" ||
    scale === "y");
