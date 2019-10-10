import { Scale } from "./data";
import * as Influx from "influx";
import { Point } from "./game";

const intervalResolver = {
  h: "1m",
  d: "1h",
  w: "1d" 
}

const db_url = process.env.DB_URL;
const db_name = process.env.DB_NAME;
const influx = new Influx.InfluxDB({
  host: db_url,
  database: db_name,
  schema: [
    {
      measurement: "twitch",
      fields: {
        viewerCount: Influx.FieldType.INTEGER
      },
      tags: ["game"]
    }
  ]
});

export const write = async (points: Point[]) => {
  const dateInMs = Date.now();
  const date = new Date(dateInMs);
  await influx.writePoints(
    points.map(point => ({
      measurement: "twitch",
      tags: { game: point.game },
      fields: { viewerCount: point.viewerCount },
      timestamp: point.timestamp
    }))
  );
  console.log(`[${date.toISOString()}] => Points added`);
};

const buildTimeCondition = (date: Date, scale: Scale) =>`time > ${date.getTime() * 1000000} - 1${scale}`;
const determineInterval = (scale: Scale) => intervalResolver[scale];
const buildGamesCondition = (games: string[]) =>  games && games.length > 0
? `AND (${games.map(game => `"game"='${game}'`).join(" OR ")})`
: ""

const buildQuery = (timeCondition: string, gamesCondition: string, interval: string) => `SELECT mean("viewerCount") AS "viewerCount" FROM "twitch"."autogen"."twitch" WHERE ${timeCondition} ${gamesCondition} GROUP BY time(${interval}), game FILL(null)`

export const read = async (date: Date, scale: Scale, games: string[]) => {
  return await influx.query(
    buildQuery(buildTimeCondition(date,scale), buildGamesCondition(games), determineInterval(scale))
  );
};

export const getGamesList = async () =>
  await influx.query(
    `SHOW TAG VALUES ON "twitch" FROM "twitch" WITH KEY = "game"`
  );
