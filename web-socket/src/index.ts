import express from "express";
import { createClient } from "redis";
import { WebSocketServer } from "ws";
const client = createClient();
const app = express();
const httpServer = app.listen(8080);

const wss = new WebSocketServer({ server: httpServer });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

async function main() {
  await client.connect();
  console.log("Socker  is running");
  wss.on("connection", async function connection(ws) {
    ws.on("error", console.error);
    ws.send("Connected to web socker server !!");

    await client.subscribe("problem_done", (message, channel) => {
      ws.send(channel + message + " response message from web socket server");
      console.log(channel, message, " from worker published to pub/sub");
    });
  });
}
main();
