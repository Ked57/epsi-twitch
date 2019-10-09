import { FastifyRequest, FastifyReply } from "fastify";
import { ServerResponse } from "http";
import { write } from "./db";

export type Point = {
  game: string;
  viewerCount: number;
  timestamp: number;
};

export const handleGame = async (
  request: FastifyRequest,
  reply: FastifyReply<ServerResponse>
) => {
  try {
    const points = request.body.points;
    if (!arePoints(points)) {
      throw new Error("Received invalid payload");
    }
    await write(points);
    reply.status(200).send();
  } catch (err) {
    console.error(err);
    reply.status(500).send(err);
  }
};

const arePoints = (points: unknown): points is Point[] =>
  points && Array.isArray(points) && points.every(point => isPoint(point));
const isPoint = (point: any): point is Point =>
  point &&
  typeof point.game === "string" &&
  typeof point.viewerCount === "number" &&
  typeof point.timestamp === "number";
