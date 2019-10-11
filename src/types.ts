export type Point = {
  game: string;
  viewerCount: number;
  timestamp: number;
};

export type PointToWrite = {
  measurement: "twitch";
  tags: { game: string };
  fields: { viewerCount: number };
  timestamp: number;
};

export type Scale = "h" | "d" | "w";

export const arePoints = (points: unknown): points is Point[] =>
  points && Array.isArray(points) && points.every(point => isPoint(point));
export const isPoint = (point: any): point is Point =>
  point &&
  typeof point.game === "string" &&
  typeof point.viewerCount === "number" &&
  typeof point.timestamp === "number";

export const isScale = (scale: unknown): scale is Scale =>
  typeof scale === "string" &&
  (scale === "ms" ||
    scale === "s" ||
    scale === "m" ||
    scale === "h" ||
    scale === "d" ||
    scale === "w");

export const isPointToWrite = (point: any): point is PointToWrite =>
  point &&
  point.measurement === "twitch" &&
  point.tags &&
  typeof point.tags.game === "string" &&
  point.fields &&
  typeof point.fields.viewerCount === "number" &&
  Math.round(point.fields.viewerCount) ===  point.fields.viewerCount &&
  typeof point.timestamp === "number"&&
  Math.round(point.timestamp) ===  point.timestamp;
