const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/ping", (req, res) => {
  res.json({ message: "Server is alive!" });
});

const pool = require("./db");

app.get("/ping-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ dbTime: result.rows[0].now });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Database connection failed");
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
