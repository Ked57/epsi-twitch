import test from "ava";
import { arePoints, isPoint } from "../src/types";
import { mockPoints } from "./mock/game.mock";

test("mockPoints[0] is of type Point", t => t.assert(isPoint(mockPoints[0])));

test("mockPoints are of type Point[]", t => t.assert(arePoints(mockPoints)));
