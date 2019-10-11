import test from "ava";
import { scaleList } from "./mock/data.mock";
import { isScale } from "../src/types";

test("ScaleList values are of type Scale", t =>
  t.assert(scaleList.every(scale => isScale(scale))));

test("n is not a scale value", t => t.assert(!isScale("n")));

test("the sentence 'i love this api' is not a scale value", t =>
  t.assert(!isScale("i love this api")));
