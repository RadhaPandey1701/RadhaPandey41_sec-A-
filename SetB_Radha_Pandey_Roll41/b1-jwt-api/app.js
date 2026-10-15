/**
 * Practical B1: JWT Authentication API (Node.js + Express)
 * Name   : Radha Pandey
 * Course : B.Tech CSE
 * Roll No: 41
 */
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "radha-pandey-roll41-secret";

const app = express();
app.use(express.json());

// Invalid JSON body -> treat as invalid input instead of default HTML error
app.use((err, req, res, next) => {
  if (err && err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid input" });
  }
  next(err);
});

// In-memory user store: username -> { username, passwordHash }
const users = new Map();

// ---------- POST /register ----------
app.post("/register", (req, res) => {
  const { username, password } = req.body || {};

  const validUsername = typeof username === "string" && username.trim() !== "";
  const validPassword = typeof password === "string" && password.length >= 6;
  if (!validUsername || !validPassword) {
    return res.status(400).json({ error: "Invalid input" });
  }

  if (users.has(username)) {
    return res.status(409).json({ error: "Username already exists" });
  }

  users.set(username, {
    username,
    passwordHash: bcrypt.hashSync(password, 8),
  });
  return res.status(201).json({ message: "User registered" });
});

// ---------- POST /login ----------
app.post("/login", (req, res) => {
  const { username, password } = req.body || {};
  const user = typeof username === "string" ? users.get(username) : undefined;

  if (
    !user ||
    typeof password !== "string" ||
    !bcrypt.compareSync(password, user.passwordHash)
  ) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ username: user.username }, SECRET, {
    expiresIn: "1h",
  });
  return res.status(200).json({ token });
});

// ---------- Auth middleware ----------
function authenticate(req, res, next) {
  const header = req.headers["authorization"];
  if (!header || typeof header !== "string") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const parts = header.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer" || !parts[1]) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    req.user = jwt.verify(parts[1], SECRET); // checks signature + expiry
    next();
  } catch (e) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

// ---------- GET /profile ----------
app.get("/profile", authenticate, (req, res) => {
  return res.status(200).json({ username: req.user.username });
});

// ---------- GET / (home page, just to confirm the server is running) ----------
app.get("/", (req, res) => {
  res.send(
    "<h2>B1 JWT Authentication API is running</h2>" +
      "<p>Radha Pandey | B.Tech CSE | Roll No 41</p>" +
      "<p>Routes: POST /register, POST /login, GET /profile (Bearer token)</p>"
  );
});

module.exports = app;
