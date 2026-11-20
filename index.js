import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";
import "dotenv/config";

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

const connectedClient = await connectToMongoDB();
const database = connectedClient.db("hireloopdb");
const users = database.collection("user");
const jobs = database.collection("jobs");

app.get("/", (req, res) => {
  res.send("Hireloop is running");
});

// Users Api
// Jobs Api (Filtering + Searching)
app.get("/jobs", async (req, res) => {
  try {
    const query = {};

    // Job Type Filter
    if (req.query.type) {
      query.type = req.query.type;
    }

    // Remote Filter
    if (req.query.isRemote !== undefined) {
      query.isRemote = req.query.isRemote === "true";
    }
    
     // 2. Category Filter
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Search Filter (title, description, qualifications)
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { company: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
        { qualifications: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const cursor = jobs.find(query);
    const result = await cursor.toArray();

    res.send(result);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).send({ message: "Failed to fetch jobs" });
  }
});

// jobs releted apis
app.post("/jobs", async (req, res) => {
  const job = req.body;
  const result = await jobs.insertOne(job);
  res.send(result);
});

app.get("/jobs", async (req, res) => {
  const cursor = jobs.find();
  const result = await cursor.toArray();
  res.send(result);
});

app.delete("/jobs/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await jobs.deleteOne(query);
  res.send(result);
});

app.get("/jobs/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await jobs.findOne(query);
  res.send(result);
});

app.patch("/jobs/:id", async (req, res) => {
  const id = req.params.id;
  const updatedJob = req.body;
  const query = { _id: new ObjectId(id) };
  const update = {
    $set: updatedJob,
  };
  const result = await jobs.updateOne(query, update);
  res.send(result);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
