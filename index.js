import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import 'dotenv/config'

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());

// mongodb

const client = new MongoClient(
  `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ac-yxqvwfs-shard-00-00.wwsee86.mongodb.net:27017,ac-yxqvwfs-shard-00-01.wwsee86.mongodb.net:27017,ac-yxqvwfs-shard-00-02.wwsee86.mongodb.net:27017/?ssl=true&replicaSet=atlas-11iv20-shard-0&authSource=admin`,
);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

const connectedClient = await connectToMongoDB()
app.get("/", (req, res) => {
  res.send("Hireloop is running");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
