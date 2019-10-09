import { Scale } from "./data";
import * as Influx from "influx";

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

export const write = async (name: string, count: number) => {
  const dateInMs = Date.now();
  const date = new Date(dateInMs);
  await influx.writePoints([
    {
      measurement: "twitch",
      tags: { game: name },
      fields: { viewerCount: count }
    }
  ]);
  console.log(`[${date.toISOString()}] => name: ${name}, count: ${count}`);
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
