import test from "ava";
import {
  pointToWrite,
  floatViewerCountPointToWrite,
  floatTimestampPointToWrite,
  pointToBeComputd
} from "./mock/db.mock";
import { isPointToWrite } from "../src/types";
import {
  computePointToWrite,
  buildTimeCondition,
  determineInterval,
  buildGamesCondition,
  buildQuery
} from "../src/db/db-utils";

test("pointToWrite is of type PointToWrite", t =>
  t.assert(isPointToWrite(pointToWrite)));

test("pointToWrite can't have a floatting value as viewerCount", t =>
  t.assert(!isPointToWrite(floatViewerCountPointToWrite)));

test("pointToWrite can't have a floatting value as timestamp", t =>
  t.assert(!isPointToWrite(floatTimestampPointToWrite)));

test("computePointToWrite produces an object of PoinToWrite type", t =>
  t.assert(isPointToWrite(computePointToWrite(pointToBeComputd))));

test("buildTimeCondition builds the time condition correctly", t =>
  t.deepEqual(
    buildTimeCondition(new Date("2019-10-10T17:31:52Z"), "h"),
    "time > 1570728712000000000 - 1h"
  ));

test("determineInterval determines the correct interval for an hour scale", t =>
  t.deepEqual(determineInterval("h"), "1m"));

test("determineInterval determines the correct interval for a day scale", t =>
  t.deepEqual(determineInterval("d"), "1h"));

test("determineInterval determines the correct interval for a week scale", t =>
  t.deepEqual(determineInterval("w"), "1d"));

test("buildGamesCondition builds the game condition correctly", t =>
  t.deepEqual(
    buildGamesCondition(["first game", "second game"]),
    `AND ("game"='first game' OR "game"='second game')`
  ));

test("buildQuery builds a query correctly", t =>
  t.deepEqual(
    buildQuery(
      "time > 1570728712000000000 - 1h",
      `AND ("game"='first game' OR "game"='second game')`,
      "1m"
    ),
    `SELECT mean("viewerCount") AS "viewerCount" FROM "twitch"."autogen"."twitch" WHERE time > 1570728712000000000 - 1h AND ("game"='first game' OR "game"='second game') GROUP BY time(1m), game FILL(null)`
  ));
