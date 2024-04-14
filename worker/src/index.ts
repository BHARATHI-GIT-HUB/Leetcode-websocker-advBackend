import express from "express";
import { createClient } from "redis";

const client = createClient();
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

async function main() {
  await client.connect();

  while (true) {
    try {
      console.log("waiting for submission");
      const submission = await client.blPop("submission", 0);

      console.log(submission, "from worker published to pub/sub");

      await client.publish(
        "problem_done",
        `${JSON.stringify({
          status: "done",
          timeComplexity: "O(n)",
          spaceComplexity: "O(1)",
          output: "true",
          error: "null",
        })}`
      );

      // send response as websocket to pub/sub
      // websocket server will send response to client
    } catch (err: any) {
      console.error(err.message);
    }
  }
}
main();

//  worker
// frontend ---> primary server
