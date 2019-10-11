import { Point, PointToWrite } from "../../src/types";

export const pointToWrite: PointToWrite = {
  measurement: "twitch",
  tags: { game: "a game" },
  fields: { viewerCount: 12341 },
  timestamp: 282310489248243
};

export const floatViewerCountPointToWrite: PointToWrite = {
  measurement: "twitch",
  tags: { game: "a game" },
  fields: { viewerCount: 12341.90 },
  timestamp: 282310489248243  
}

export const floatTimestampPointToWrite: PointToWrite = {
  measurement: "twitch",
  tags: { game: "a game" },
  fields: { viewerCount: 12341 },
  timestamp: 282310489248243.87 
}

export const pointToBeComputd: Point = {
  game: "a game",
  viewerCount: 12345,
  timestamp: 121242313143423
}