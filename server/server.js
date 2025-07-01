const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const pool = require("./db");
const { hash } = require("bcrypt");

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Connection error:", err.stack);
  } else {
    console.log("Database connected:", res.rows[0]);
  }
});

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification error:", err.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

app.get("/debug-db", async (req, res) => {
  const result = await pool.query("SELECT * FROM users");
  res.json(result.rows);
});

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Incoming registration:", req.body);

    if (!email || email.trim() === "" || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const existingUserQuery = "SELECT * FROM suers WHERE email = $1";
    const existingUser = await pool.query(existingUserQuery, [email]);

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const insertQuery =
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email";
    const result = await pool.query(insertQuery, [
      email.trim(),
      hashedPassword,
    ]);

    res.status(201).json({
      id: result.rows[0].id,
      message: "User registered successfully",
      user: { email: result.rows[0].email },
    });
  } catch (err) {
    console.error("Register error:", {
      message: err.message,
      stack: err.stack,
      requestBody: req.body,
    });
    res.status(500).json({ error: `Internal server error: ${err.message}` });
  }
});

app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const userQuery = "SELECT id, email, password FROM users WHERE email = $1";
    const result = await pool.query(userQuery, [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const payload = { userId: user.id, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    console.error("Signin error:", {
      message: err.message,
      stack: err.stack,
      requestBody: req.body,
    });
    res.status(500).json({ error: `Server error: ${err.message}` });
  }
});

app.post("/transactions", authenticateToken, async (req, res) => {
  try {
    const { amount, type, date, category_id, description } = req.body;

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return res
        .status(400)
        .json({ error: "Amount must be a positive number" });
    }

    if (!["income", "expense"].includes(type)) {
      return res
        .status(400)
        .json({ error: "Type must be 'income' or 'expense'" });
    }

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date) || isNaN(Date.parse(date))) {
      return res
        .status(400)
        .json({ error: "Date must be in YYYY-MM-DD format" });
    }

    if (!category_id || category_id.trim() === "") {
      return res.status(400).json({ error: "Category is required" });
    }

    const finalDescription = description ? description.trim() : null;

    const insertQuery =
      "INSERT INTO transactions (user_id, amount, type, date, category_id, description) Values ($1, $2, $3, $4, $5, $6) RETURNING *";

    const result = await pool.query(insertQuery, [
      req.user.userId,
      amount,
      type,
      date,
      category_id,
      finalDescription,
    ]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Database error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/transactions", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const userQuery = "SELECT * FROM transactions WHERE user_id = $1";
    const result = await pool.query(userQuery, [userId]);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Database error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/transactions/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const transactionId = parseInt(req.params.id, 10);
    if (isNaN(transactionId) || transactionId <= 0) {
      return res.status(400).json({ error: "Invalid transaction ID" });
    }

    const deleteQuery =
      "DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING *";
    const result = await pool.query(deleteQuery, [transactionId, userId]);

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Transaction not found or not owned by user" });
    }

    res.status(200).json({
      message: "Transaction deleted",
      deletedTransaction: result.rows[0],
    });
  } catch (err) {
    // 6. Error handling
    console.error("Database error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
