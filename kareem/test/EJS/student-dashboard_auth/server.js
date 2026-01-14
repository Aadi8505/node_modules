import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
const app = express();
const sercretKey = "JaiJaatJaiKissanJaiBalwan";

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const studentsDetails = [
  {
    student: {
      name: "John Doe",
      email: "john@.com",
      password: "123",
      role: "admin",
    },
    courses: [
      { title: "Web Development", grade: "A" },
      { title: "Database Systems", grade: "B" },
      { title: "Operating Systems", grade: "D" },
    ],
    notice: "<b>Important Notice</b>",
  },
  {
    student: {
      name: "Karan",
      email: "karan@.com",
      password: "123",
      role: "user",
    },
    courses: [
      { title: "Web Development", grade: "A" },
      { title: "Operating Systems", grade: "D" },
    ],
    notice: "<b>Hello Notice</b>",
  },
];

app.get("/login", (req, res) => {
  let msg = null;
  if (req.query.expired) {
    msg = "Session expired. Please login again.";
  }
  res.render("login", { error: msg });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = studentsDetails.find(
    (u) => u.student.email === username && u.student.password === password
  );

  if (!user) {
    return res.render("login", { error: "Invalid username or password" });
  }

  //* token creation
  const token = jwt.sign(
    {
      name: user.student.name,
      email: user.student.email,
      role: user.student.role,
      logintime: Date.now(),
    },
    sercretKey,
    { expiresIn: "40s" }
  );

  //* set token in cookie
  res.cookie("token", token, { httpOnly: true });

  //* now role base redirection
  if (user.student.role === "admin") {
    res.redirect("/admin");
  } else {
    res.redirect("/user");
  }
});

app.get("/admin", isAuth, (req, res) => {
  if (req.user.role !== "admin") {
    return res.send("<h1>Access Denied</h1>");
  }

  const user = studentsDetails.find((u) => u.student.email === req.user.email);
  console.log(user);

  res.render("dash", user);
});

app.get("/user", isAuth, (req, res) => {
  if (req.user.role !== "user") {
    return res.send("<h1>Access Denied</h1>");
  }
  const user = studentsDetails.find((u) => u.student.email === req.user.email);
  res.render("dash", user);
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
  res.clearCookie("token");
  res.redirect("/login");
});

app.listen(3000, () =>
  console.log("Server is runnning on port ..--.==== 3000 ====.--..")
);
