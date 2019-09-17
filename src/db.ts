import fetch from "node-fetch";

const db_url = process.env.DB_URL;
const db_name = process.env.DB_NAME;

export const insertRow = async ({
  name,
  count
}: {
  name: string;
  count: number;
}) => {
  const response = await fetch(`${db_url}/write?db=${db_name}`, {
    method: "POST",
    body: `${name},value=${count}`
  });
  console.log(response);
};
