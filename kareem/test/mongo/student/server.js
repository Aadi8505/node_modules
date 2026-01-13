const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const url = "mongodb://localhost:27017";
const dbName = "testingProject";
let db;

MongoClient.connect(url)
  .then(client => {
    db = client.db(dbName);
    console.log("database connected...");
  })
  .catch(() => {
    console.log("database crashed...");
  });

app.get("/", async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = 5;
    let skip = (page - 1) * limit;

    const data = await db
      .collection("students")
      .find({})
      .skip(skip)
      .limit(limit)
      .toArray();

    res.render("form", { data, page });
  } catch (err) {
    res.send(err);
  }
});

app.post("/addStudent", async (req, res) => {
  try {
    const { name, section, marks } = req.body;

    await db.collection("students").insertOne({
      Name: name,
      Section: section,
      Marks: Number(marks),
    });

    res.redirect("/");
  } catch (err) {
    res.send(err);
  }
});

app.get("/delete/:id", async (req, res) => {
  try {
    await db.collection("students").deleteOne({
      _id: new ObjectId(req.params.id),
    });
    res.redirect("/");
  } catch (err) {
    res.send(err);
  }
});

app.get("/edit/:id", async (req, res) => {
  try {
    const data = await db.collection("students").findOne({
      _id: new ObjectId(req.params.id),
    });
    res.render("update", { data });
  } catch (err) {
    res.send(err);
  }
});

app.post("/editStudent/:id", async (req, res) => {
  try {
    const { name, section, marks } = req.body;

    await db.collection("students").updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $set: {
          Name: name,
          Section: section,
          Marks: Number(marks),
        },
      }
    );

    res.redirect("/");
  } catch (err) {
    res.send(err);
  }
});

app.post("/filter", async (req, res) => {
  try {
    let { filter, marks } = req.body;
    marks = Number(marks);

    let query;
    if (filter === "gt") query = { Marks: { $gt: marks } };
    else if (filter === "lt") query = { Marks: { $lt: marks } };
    else query = { Marks: marks };

    const data = await db.collection("students").find(query).toArray();
    res.render("form", { data, page: 1 });
  } catch (err) {
    res.send(err);
  }
});

app.listen(5000, () => {
  console.log("Server Started...");
});