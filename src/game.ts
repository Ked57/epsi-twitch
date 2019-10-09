import { write } from "./db";

export type Point = {
  game: string;
  viewerCount: number;
  timestamp: number;
};

export const handleGame = async (msg: string) => {
  const query = await JSON.parse(msg);
  const points = query.points;
  if (!arePoints(points)) {
    throw new Error("Received invalid payload");
  }
  await write(points);
};

const arePoints = (points: unknown): points is Point[] =>
  points && Array.isArray(points) && points.every(point => isPoint(point));
const isPoint = (point: any): point is Point =>
  point &&
  typeof point.game === "string" &&
  typeof point.viewerCount === "number" &&
  typeof point.timestamp === "number";
