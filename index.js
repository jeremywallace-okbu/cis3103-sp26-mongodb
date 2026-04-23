require("dotenv").config();
const express = require("express");

const app = express();
const helpers = require("./helpers");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/users", async (req, res) => {
  try {
    const users = await helpers.getUsers();

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/users/:email", async (req, res) => {
  try {
    const user = await helpers.getUserByEmail(req.params.email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/users", async (req, res) => {
  console.log("Creating user with data:", req.body);
  try {
    const userId = await helpers.createUser(req.body);
    res.status(201).json({ _id: userId, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/search", async (req, res) => {
  console.log("Search request with body:", req.body);
  try {
    const results = await helpers.searchForUser(req.body);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.patch("/users/:id", async (req, res) => {
  console.log("Updating user with ID:", req.params.id, "and data:", req.body);
    try {
        const updatedUser = await helpers.updateUser(req.params.id, req.body);
        console.log("Updated user:", updatedUser);
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete("/users/:id", async (req, res) => {
    console.log("Deleting user with ID:", req.params.id);
    try {
        const deletedUser = await helpers.deleteUser(req.params.id);
        console.log("Deleted user:", deletedUser);
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(deletedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

async function start() {
  await helpers.connect();
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
}

start();
