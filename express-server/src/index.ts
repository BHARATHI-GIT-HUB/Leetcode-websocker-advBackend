import express from "express";
import { createClient } from "redis";

const app = express();
const client = createClient();
client.connect();

app.use(express.json());

app.post("/api/redis", async (req, res) => {
  const { question_id, user_id, solution, language } = req.body;
  try {
    await client.lPush(
      "submission",
      JSON.stringify({ question_id, user_id, solution, language })
    );
    res.send({ question_id, user_id, solution, language });
  } catch (err: any) {
    res.status(500).send({ error: err.message });
  }
});

app.listen(3001, () => console.log("Server is running on port 3001"));
