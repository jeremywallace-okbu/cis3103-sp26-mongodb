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

app.get("/users/:id", async (req, res) => {
    try {
        const user = await helpers.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    }
    catch (err) {
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
