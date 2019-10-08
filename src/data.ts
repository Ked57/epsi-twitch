import { FastifyRequest, FastifyReply } from "fastify";
import { ServerResponse } from "http";
import { badRequest } from "./reply";
import { read, Scale } from "./db";

export type Delimiter = "day" | "month" | "year";

type DelimiterResolver = { [key: string]: Scale };

const delimiterResolver: DelimiterResolver = {
  day: "d",
  month: "m",
  year: "y"
};

export const getPaginatedData = async (
  request: FastifyRequest,
  reply: FastifyReply<ServerResponse>
) => {
  try {
    const date = new Date(request.query.date);
    const delimiter = request.query.delimiter;
    const game = request.query.game;
    if (!isDate(date)) {
      badRequest(
        "Error: no date param specified or incorrect parameter",
        reply
      );
      return;
    }
    if (!isDelimiter(delimiter)) {
      badRequest(
        "Error: no delimiter param specified or incorrect parameter",
        reply
      );
      return;
    }
    return await matchRead(date, delimiter, game);
  } catch (err) {
    console.error(err);
    reply.status(500).send(err);
  }
};

const matchRead = (date: Date, delimiter: Delimiter, game?: string) =>
  read(date, delimiterResolver[delimiter], game);

const isDate = (date: any): date is Date =>
  date && typeof Date.parse(date) === "number";
const isDelimiter = (delimiter: unknown): delimiter is Delimiter =>
  typeof delimiter === "string" &&
  (delimiter === "day" || delimiter === "month" || delimiter === "year");
