const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const connection = require("./db");

const SALT_ROUNDS = 10;

async function connect() {
  await connection();
  await seed();
}

async function seed() {
  const users = await getUsers();
  if (users.length === 0) {
    await seedInitialUser();
  }
}

async function getUsers() {
  const db = await connection();
  const users = await db.collection("users").find().toArray();
  return users;
}

async function createUser(user) {
  const db = await connection();
  const result = await db.collection("users").insertOne(user);
  return result.insertedId;
}

async function getUserById(id) {
  console.log("Getting user by ID:", id);
  const db = await connection();
  const user = await db.collection("users").findOne({ _id: new ObjectId(id) });
  console.log("User found:", user);
  return user;
}

async function seedInitialUser() {
  console.log("Seeding initial user...");
  const hashedPassword = await bcrypt.hash("password", SALT_ROUNDS);

  const user = {
    name: "Jeremy Wallace",
    email: "jeremy@yopmail.com",
    password: hashedPassword,
  };

  const insertedId = await createUser(user);
  console.log("Initial user created.");
  console.log({
    _id: insertedId,
    ...user,
    password: "password",
    hashedPassword,
  });
}

module.exports = {
  connect,
  getUsers,
  getUserById,
};
