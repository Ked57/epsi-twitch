import { Scale, Point } from "../types";
import * as Influx from "influx";
import {
  computePointToWrite,
  buildTimeCondition,
  buildQuery,
  buildGamesCondition,
  determineInterval
} from "./db-utils";

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
  await influx.writePoints(points.map(computePointToWrite));
  console.log(`[${date.toISOString()}] => Points added`);
};

export const read = async (date: Date, scale: Scale, games: string[]) => {
  return await influx.query(
    buildQuery(
      buildTimeCondition(date, scale),
      buildGamesCondition(games),
      determineInterval(scale)
    )
  );
};

export const getGamesList = async () =>
  await influx.query(
    `SHOW TAG VALUES ON "twitch" FROM "twitch" WITH KEY = "game"`
  );
