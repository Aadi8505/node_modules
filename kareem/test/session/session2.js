const express = require("express");
const session = require("express-session");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------------------
// Session Setup
// --------------------
app.use(
  session({
    secret: "super-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 10 * 60 * 1000 } // 10 minutes
  })
);

// --------------------
// In-memory session store (demo purpose)
// --------------------
const activeSessions = new Map();

// --------------------
// Dummy users
// --------------------
const users = {
  admin: { username: "admin", password: "admin123", role: "admin" },
  user1: { username: "user1", password: "user123", role: "user" },
  user2: { username: "user2", password: "user123", role: "user" }
};

// --------------------
// Login Route
// --------------------
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users[username];

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  req.session.user = {
    username: user.username,
    role: user.role,
    loginTime: new Date()
  };

  activeSessions.set(req.sessionID, {
    username: user.username,
    role: user.role,
    loginTime: new Date(),
    expiresAt: new Date(Date.now() + req.session.cookie.maxAge)
  });

  res.json({ message: "Login successful", role: user.role });
});

// --------------------
// Auth Middleware
// --------------------
function isAuthenticated(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
}

// --------------------
// Role Middleware
// --------------------
function isAdmin(req, res, next) {
  if (req.session.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
}

// --------------------
// User Dashboard (Session Isolation)
// --------------------
app.get("/dashboard", isAuthenticated, (req, res) => {
  res.json({
    message: "Welcome to user dashboard",
    user: req.session.user
  });
});

// --------------------
// Admin Panel - View Active Sessions
// --------------------
app.get("/admin", isAuthenticated, isAdmin, (req, res) => {
  const sessions = [];

  activeSessions.forEach((value, key) => {
    sessions.push({
      sessionId: key,
      username: value.username,
      loginTime: value.loginTime,
      expiresAt: value.expiresAt
    });
  });

  res.json({
    totalActiveSessions: sessions.length,
    sessions
  });
});

// --------------------
// Logout
// --------------------
app.post("/logout", isAuthenticated, (req, res) => {
  activeSessions.delete(req.sessionID);
  req.session.destroy(() => {
    res.json({ message: "Logged out successfully" });
  });
});

// --------------------
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
