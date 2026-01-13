const express = require("express");
const app = express();

const { MongoClient } = require("mongodb");
const client = new MongoClient("mongodb://127.0.0.1:27017");

app.use(express.json());

let db;
async function connectDb() {
  try {
    await client.connect();
    db = client.db("companyDB");
    console.log("MongoDB connected to companyDB");

    await createCollection();
  } catch (error) {
    console.error("DB connection error:", error);
  }
}

async function createCollection() {
  try {
    await db
      .collection("employees")
      .createIndex({ empid: 1 }, { unique: true });

    await db
      .collection("departments")
      .createIndex({ deptid: 1 }, { unique: true });

    console.log("Collections & indexes created");
  } catch (error) {
    console.error("Error creating collections:", error);
  }
}

connectDb();

app.get("/seed-emp", async (req, res) => {
  try {
    const employees = [
      { empid: 1, name: "Amit", salary: 30000, deptid: 101 },
      { empid: 2, name: "Ravi", salary: 35000, deptid: 101 },
      { empid: 3, name: "Neha", salary: 40000, deptid: 102 },
      { empid: 4, name: "Pooja", salary: 28000, deptid: 103 },
      { empid: 5, name: "Rahul", salary: 50000, deptid: 102 },
      { empid: 6, name: "Karan", salary: 45000, deptid: 101 },
    ];

    await db.collection("employees").insertMany(employees);
    res.send("Employees Seeded Succesfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/view-emp", async (req, res) => {
  try {
    const data = await db.collection("employees").find().toArray();
    // console.log(data);
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/add-emp/:id/:name/:salary/:deptid", async (req, res) => {
  try {
    const { id, name, salary, deptid } = req.params;
    const emp = {
      empid: Number(id),
      name: name,
      salary: Number(salary),
      deptid: Number(deptid),
    };
    await db.collection("employees").insertOne(emp);
    res.send(`employee ${name} added to db`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/delete-emp/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("employees").deleteOne({ empid: Number(id) });
    res.send(`employee with id-> ${id} deleted from db`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/delete-emp-lt/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("employees").deleteMany({ empid: { $lt: Number(id) } });
    res.send(`employee with id less than ${id} deleted from db`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/update-salary/:id/:amount", async (req, res) => {
  try {
    const { id, amount } = req.params;
    await db
      .collection("employees")
      .updateOne({ empid: Number(id) }, { $set: { salary: Number(amount) } });
    res.send(`employee with id ${id} updated in db`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/update-salary-range/:id/:amount", async (req, res) => {
  try {
    const { id, amount } = req.params;
    await db
      .collection("employees")
      .updateMany(
        { empid: { $gte: Number(id) } },
        { $inc: { salary: Number(amount) } }
      );
    res.send(`employee with id greater then or equal to ${id} updated in db`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/search-emp/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const data = await db
      .collection("employees")
      .find({ name: name })
      .toArray();
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/seed-dept", async (req, res) => {
  try {
    const departments = [
      { deptid: 101, name: "HR" },
      { deptid: 102, name: "IT" },
      { deptid: 103, name: "Finance" },
    ];

    await db.collection("departments").insertMany(departments);
    res.send("Departments Seeded Succesfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/view-dept", async (req, res) => {
  try {
    const data = await db.collection("departments").find().toArray();
    // console.log(data);
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/add-dept/:id/:name", async (req, res) => {
  try {
    const { id, name } = req.params;
    const emp = {
      deptid: Number(id),
      name: name,
    };
    await db.collection("departments").insertOne(emp);
    res.send(`department ${name} added to db`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/delete-dept/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("departments").deleteOne({ deptid: Number(id) });
    res.send(`department with id-> ${id} deleted from db`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/update-dept/:id/:name", async (req, res) => {
  try {
    const { id, name } = req.params;
    await db
      .collection("departments")
      .updateOne({ deptid: Number(id) }, { $set: { name: name } });
    res.send(`employee with name ${name} updated in db`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
