const { MongoClient } = require('mongodb');

async function run() {
  const uri = "mongodb+srv://kielianbartosz49_db_user:kWv55emHlXemOfO6@f1chat.olasrdu.mongodb.net/fichat";

  console.log("🔍 Trying to connect with URI:", uri);

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas");
    const dbs = await client.db().admin().listDatabases();
    console.log("📂 Databases:", dbs);
  } catch (err) {
    console.error("❌ Connection error:", err.message);
  } finally {
    await client.close();
    console.log("🔒 Connection closed");
  }
}

run();
