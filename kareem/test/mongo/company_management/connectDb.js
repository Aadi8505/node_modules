const { MongoClient } = require("mongodb");
const URL = "mongodb://127.0.0.1:27017";
const DB_NAME = "testingproject";

const client = new MongoClient(URL);
let db;

export async function connectDB() {
  if (db) return db;

  await client.connect();
  db = client.db(DB_NAME);
  console.log("MongoDB Connected");
  return db;
}
