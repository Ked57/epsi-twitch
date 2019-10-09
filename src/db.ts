import { Scale } from "./data";
import * as Influx from "influx";
import { Point } from "./game";

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

export const read = async (date: Date, scale: Scale, games?: string[]) => {
  const timeCondition = `time > ${date.getTime() * 1000000} - 1${scale}`;
  const gamesCondition = games
    ? games.map(game => `"game"='${game}'`).join(" OR ")
    : "";
  return await influx.query(
    `SELECT mean("viewerCount") AS "viewerCount" FROM "twitch"."autogen"."twitch" WHERE ${timeCondition} AND ${gamesCondition} GROUP BY time(1m), game FILL(null)`
  );
};

export const getGamesList = async () =>
  await influx.query(
    `SHOW TAG VALUES ON "twitch" FROM "twitch" WITH KEY = "game"`
  );
