const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const connection = require("./db");
const { json } = require("express");

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
  user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
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

async function getUserByEmail(email) {
  console.log("Getting user by email:", email);
  const db = await connection();
  const user = await db.collection("users").findOne({ email: email });
  console.log("User found:", user);
  return user;
}

async function searchForUser(search) {
    console.log("Searching for user with:", search);

    const db = await connection();
    const query = {};

    if (search.name) {
        query.name = { $regex: `(^|\\s)${search.name}`, $options: "i" };
    }
    if (search.email) {
        query.email = { $regex: `^${search.email}`, $options: "i" };
    }
    if (search.id) {
        query._id = new ObjectId(search.id);
    }

    console.log("Constructed query:", query);
    const results = await db.collection("users").find(query).toArray();
    console.log("Search results:", results);
    return results;

}

async function updateUser(id, updates) {
    console.log("Updating user with ID:", id, "and updates:", updates);
    const db = await connection();
    const updateDoc = { $set: {} };

    if (updates.name) {
        updateDoc.$set.name = updates.name;
    }
    if (updates.email) {
        updateDoc.$set.email = updates.email;
    }
    if (updates.password) {
        updateDoc.$set.password = await bcrypt.hash(updates.password, SALT_ROUNDS);
    }

    console.log("Constructed update document:", updateDoc);
    const result = await db.collection("users").findOneAndUpdate(
        { _id: new ObjectId(id) },
        updateDoc,
        { returnDocument: "after" }
    );
    
    console.log("Update result:", result);
    return result;
}

async function deleteUser(id) {
    console.log("Deleting user with ID:", id);
    const db = await connection();
    const result = await db.collection("users").findOneAndDelete({ _id: new ObjectId(id) });
    console.log("Delete result:", result);
    return result;
}

async function seedInitialUser() {
  console.log("Seeding initial user...");

  const user = {
    name: "Jeremy Wallace",
    email: "jeremy@yopmail.com",
    password: "password",
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
  createUser,
  getUsers,
  getUserById,
  getUserByEmail,
  searchForUser,
  updateUser,
  deleteUser,
};
