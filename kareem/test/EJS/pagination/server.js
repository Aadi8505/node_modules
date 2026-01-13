// server.js
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;

  const rawData = fs.readFileSync(
    path.join(__dirname, "data.json"),
    "utf-8"
  );
  const products = JSON.parse(rawData);

  const totalPages = Math.ceil(products.length / limit);
  const start = (page - 1) * limit;
  const end = start + limit;

  const paginatedProducts = products.slice(start, end);

  res.render("index", {
    products: paginatedProducts,
    currentPage: page,
    totalPages,
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
