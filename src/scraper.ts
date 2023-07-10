import "dotenv/config";
import { Server } from "ws";
import express from "express";
import EventEmitter from "events";

import { ScraperEvent } from "./types";
import { withEmitEvents } from "./hofs";
import { followLinks, Link } from "./links";

const app = express();
app.use(express.static("public"));

const wss = new Server({ noServer: true });

const followLinksEmitter = new EventEmitter();

const testUrl = new URL(process.env.TEST_URL || "https://wikipedia.com");
const testDepth = Number(process.env.TEST_DEPTH) || 3;

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    console.log(`Received: ${message}`);
  });

  const emitAndFollowLinks = withEmitEvents(
    followLinks,
    followLinksEmitter,
    ScraperEvent.NewLink,
    ScraperEvent.Done
  );

  (async (url) => {
    try {
      const initialLink = url.href;
      await emitAndFollowLinks(initialLink, testDepth);
    } catch (error) {
      console.error(`Failed to get links of page with error: ${error}`);
    }
  })(testUrl);

  followLinksEmitter.on(ScraperEvent.NewLink, (link) => {
    ws.send(`Yielding link: ${link.url} at depth ${link.depth}`);
  });
  followLinksEmitter.on(ScraperEvent.Done, () => {
    ws.send(`finished yielding`);
  });
});

const server = app.listen(8080, () => {
  console.log("Server started on port 8080");
});

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});
