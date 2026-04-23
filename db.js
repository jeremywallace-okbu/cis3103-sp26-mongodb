const { MongoClient } = require('mongodb');

let db = null;

async function connect() {
  if (db) return db; // return cached instance if already connected

  const client = new MongoClient(process.env.MONGO_DB_URI);
  await client.connect();

  db = client.db(process.env.DB_NAME);
  console.log(`Connected to ${process.env.DB_NAME}`);
  return db;
}

module.exports = connect;
