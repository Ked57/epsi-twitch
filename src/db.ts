// no type declaration file for this package so we do it the old way
const Influx = require("influxdb-nodejs");

const db_url = process.env.DB_URL;
const db_name = process.env.DB_NAME;
const client = new Influx(`${db_url}:8086/${db_name}`);

export type Scale = "d" | "m" | "y";

export const write = async (name: string, count: number) => {
  const dateInMs = Date.now();
  const date = new Date(dateInMs);
  await client
    .write(db_name)
    .tag({
      game: name
    })
    .field({
      use: dateInMs,
      viewers: count
    });
  console.log(`[${date.toISOString()}] => name: ${name}, count: ${count}`);
};

export const read = async (date: Date, scale: Scale, game?: string) => {
  return client.query("twitch").where(`time > ${date.getTime()} - 1${scale}`);
};
