import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
const app = express();
const sercretKey = "JaiJaatJaiKissanJaiBalwan";

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const users = [
  {
    username: "user@.com",
    password: "123",
    role: "user",
    id: "101",
  },
  {
    username: "admin@.com",
    password: "123",
    role: "admin",
    id: "102",
  },
];

let activeToken = {};

app.get("/login", (req, res) => {
  let msg = null;
  if (req.query.expired) {
    msg = "Session expired. Please login again.";
  }
  res.render("login", { error: msg });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.render("login", { error: "Invalid username or password" });
  }

  //* token creation
  const token = jwt.sign(
    {
      username: user.username,
      role: user.role,
      logintime: Date.now(),
      userId: user.id,
    },
    sercretKey,
    { expiresIn: "40s" }
  );
  //* set token in cookie
  res.cookie("token", token, { httpOnly: true });

  activeToken[token] = {
    username: user.username,
    role: user.role,
    issuedAt: Date.now(),
    expiresIn: Date.now() + 40_000,
  };

  //* now role base redirection
  if (user.role === "admin") {
    res.redirect("/admin");
  } else {
    res.redirect("/user");
  }
});

app.get("/admin", isAuth, (req, res) => {
  if (req.user.role !== "admin") {
    return res.send("<h1>Access Denied</h1>");
  }
  const diff = Math.floor((Date.now() - req.user.logintime) / 60000);
  res.render("admin", {
    name: req.user.username,
    token: req.cookies.token,
    logintime: diff,
    sessions: Object.values(activeToken),
  });
});

app.get("/user", isAuth, (req, res) => {
  if (req.user.role !== "user") {
    return res.send("<h1>Access Denied</h1>");
  }
  const diff = Math.floor((Date.now() - req.user.logintime) / 60000);

  res.render("user", {
    name: req.user.username,
    token: req.cookies.token,
    logintime: diff,
  });
});

function isAuth(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.redirect("/login");
  try {
    const decoded = jwt.verify(token, sercretKey);
    req.user = decoded;
    next();
  } catch (err) {
    //  token expired
    if (err.name === "TokenExpiredError") {
      res.clearCookie("token");
      return res.redirect("/login?expired=true");
    }

    //  invalid token
    res.clearCookie("token");
    return res.redirect("/login");
  }
}

app.get("/logout", (req, res) => {
  delete activeToken[req.cookies.token];
  res.clearCookie("token");
  res.redirect("/login");
});

app.listen(3000, () =>
  console.log("Server is runnning on port ..--.==== 3000 ====.--..")
);
