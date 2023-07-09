import express from "express";
import { Server } from "ws";

import { followLinks } from "./links";

const app = express();
app.use(express.static("public"));

const wss = new Server({ noServer: true });

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    console.log(`Received: ${message}`);
  });

  const testUrl = new URL("https://example.com");
  const TEST_DEPTH = 4;

  (async (url) => {
    try {
      const initialLink = url.href;

      const scraper = followLinks(initialLink, TEST_DEPTH);
      for await (let link of scraper) {
        const now = new Date();
        const timeString = `${now.getHours().toString().padStart(2, "0")}:${now
          .getMinutes()
          .toString()
          .padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
        ws.send(
          `Yielding link: ${link.url} at depth ${link.depth} at ${timeString}`
        );
      }
    } catch (error) {
      console.error(`Failed to get links of page with error: ${error}`);
    }
  })(testUrl);
});

const server = app.listen(8080, () => {
  console.log("Server started on port 8080");
});

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});
