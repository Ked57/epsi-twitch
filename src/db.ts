const Influx = require("influxdb-nodejs");

const db_url = process.env.DB_URL;
const db_name = process.env.DB_NAME;
const client = new Influx(`${db_url}:8086/${db_name}`);

export const write = async ({
  name,
  count
}: {
  name: string;
  count: number;
}) => {
  const date = Date.now();
  await client
    .write(db_name)
    .tag({
      game: name
    })
    .field({
      use: date,
      viewers: count
    });
  console.log(`[${date}] => name: ${name}, count: ${count}`);
};
