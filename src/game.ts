import { write } from "./db/db";
import { arePoints } from "./types";

export const handleGame = async (msg: string) => {
  const query = await JSON.parse(msg);
  const points = query.points;
  if (!arePoints(points)) {
    throw new Error("Received invalid payload");
  }
  await write(points);
};
