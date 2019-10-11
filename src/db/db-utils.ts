import { Point, Scale } from "../types";

const intervalResolver = {
  h: "1m",
  d: "1h",
  w: "1d"
};

export const computePointToWrite = (point: Point) => ({
  measurement: "twitch",
  tags: { game: point.game },
  fields: { viewerCount: point.viewerCount },
  timestamp: point.timestamp
});

export const buildTimeCondition = (date: Date, scale: Scale) =>
  `time > ${date.getTime() * 1000000} - 1${scale}`;
export const determineInterval = (scale: Scale) => intervalResolver[scale];
export const buildGamesCondition = (games: string[]) =>
  games && games.length > 0
    ? `AND (${games.map(game => `"game"='${game}'`).join(" OR ")})`
    : "";

export const buildQuery = (
  timeCondition: string,
  gamesCondition: string,
  interval: string
) =>
  `SELECT mean("viewerCount") AS "viewerCount" FROM "twitch"."autogen"."twitch" WHERE ${timeCondition} ${gamesCondition} GROUP BY time(${interval}), game FILL(null)`;
