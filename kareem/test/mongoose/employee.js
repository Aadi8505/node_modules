import express from "express";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/payroll")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  empId: {
    type: String,
    required: true,
    unique: true
  },
  departments: {
    type: [String],
    default: []
  },
  salary: {
    type: Number,
    required: true,
    min: 10001,
    validate: {
      validator: v => v % 1000 === 0
    }
  },
  joiningDate: {
    type: Date,
    required: true
  }
});

employeeSchema.pre("save", function (next) {
  this.name = this.name
    .split(" ")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
  next();
});

const Employee = mongoose.model("Employee", employeeSchema);

app.post("/employees", async (req, res) => {
  try {
    const emp = await Employee.create(req.body);
    res.json(emp);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/employees", async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
});

app.get("/employees/:id", async (req, res) => {
  const emp = await Employee.findOne({ empId: req.params.id });
  if (!emp) return res.status(404).json({ msg: "Employee not found" });
  res.json(emp);
});

app.patch("/employees/:id", async (req, res) => {
  const emp = await Employee.findOneAndUpdate(
    { empId: req.params.id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!emp) return res.status(404).json({ msg: "Employee not found" });
  res.json(emp);
});

app.delete("/employees/:id", async (req, res) => {
  const emp = await Employee.findOneAndDelete({ empId: req.params.id });
  if (!emp) return res.status(404).json({ msg: "Employee not found" });
  res.json({ msg: "Employee deleted" });
});

app.get("/avg-salary/:dept", async (req, res) => {
  const data = await Employee.aggregate([
    { $unwind: "$departments" },
    { $match: { departments: req.params.dept } },
    {
      $group: {
        _id: "$departments",
        avgSalary: { $avg: "$salary" }
      }
    }
  ]);

  res.json(data.length ? data[0] : { msg: "No data found" });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});