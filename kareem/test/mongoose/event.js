import express from "express";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/events")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  date: {
    type: Date,
    required: true,
    validate: {
      validator: v => v > new Date()
    }
  },
  venue: {
    type: String,
    required: true
  },
  participants: {
    type: [String],
    validate: {
      validator: v => v.length > 0
    }
  },
  ticketPrice: {
    type: Number,
    required: true,
    min: 1,
    max: 9999
  }
});

eventSchema.pre("save", function (next) {
  this.name = this.name
    .split(" ")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
  next();
});

eventSchema.post("save", function () {
  console.log("Event added successfully.");
});

const Event = mongoose.model("Event", eventSchema);

app.post("/events", async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/events", async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

app.get("/events/:id", async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ msg: "Event not found" });
  res.json(event);
});

app.patch("/events/:id", async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!event) return res.status(404).json({ msg: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/events/:id", async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) return res.status(404).json({ msg: "Event not found" });
  res.json({ msg: "Event deleted" });
});

app.get("/events/venue/:venue", async (req, res) => {
  const events = await Event.find({ venue: req.params.venue });
  res.json(events);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});