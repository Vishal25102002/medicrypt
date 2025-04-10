const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new user
app.post("/users", async (req, res) => {
  try {
    const { walletAddress, role } = req.body;
    const user = await prisma.user.create({
      data: {
        walletAddress,
        role,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Example of other CRUD operations can be added similarly

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
