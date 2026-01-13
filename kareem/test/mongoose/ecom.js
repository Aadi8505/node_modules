 import express from "express";
import mongoose from "mongoose";

const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/ecommerce")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const orderSchema = new mongoose.Schema({
  orderId: String,
  userId: String,
  city: String,
  category: String,
  product: String,
  quantity: Number,
  price: Number,
  discount: Number,
  status: String,
  orderDate: Date
});

const Order = mongoose.model("Order", orderSchema);

const revenueExpr = {
  $subtract: [
    { $multiply: ["$price", "$quantity"] },
    {
      $multiply: [
        { $multiply: ["$price", "$quantity"] },
        { $divide: ["$discount", 100] }
      ]
    }
  ]
};

app.get("/task1", async (req, res) => {
  const data = await Order.aggregate([
    { $match: { status: { $ne: "cancelled" } } },
    {
      $group: {
        _id: "$city",
        totalRevenue: { $sum: revenueExpr },
        avgOrderValue: { $avg: revenueExpr }
      }
    },
    { $sort: { totalRevenue: -1 } },
    { $limit: 3 },
    {
      $project: {
        _id: 0,
        city: "$_id",
        totalRevenue: 1,
        avgOrderValue: 1
      }
    }
  ]);
  res.json(data);
});

app.get("/task2", async (req, res) => {
  const data = await Order.aggregate([
    { $match: { status: "delivered" } },
    {
      $group: {
        _id: "$category",
        totalOrders: { $sum: 1 },
        totalQuantity: { $sum: "$quantity" },
        avgOrderValue: { $avg: revenueExpr },
        maxOrderValue: { $max: revenueExpr }
      }
    }
  ]);
  res.json(data);
});

app.get("/task3", async (req, res) => {
  const data = await Order.aggregate([
    {
      $group: {
        _id: "$userId",
        totalSpent: { $sum: revenueExpr },
        avgOrderValue: { $avg: revenueExpr }
      }
    },
    { $match: { totalSpent: { $gt: 20000 } } },
    { $sort: { totalSpent: -1 } },
    {
      $project: {
        _id: 0,
        userId: "$_id",
        totalSpent: 1,
        avgOrderValue: 1
      }
    }
  ]);
  res.json(data);
});

app.get("/task4", async (req, res) => {
  const year = new Date().getFullYear();
  const data = await Order.aggregate([
    {
      $match: {
        orderDate: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: "$orderDate" },
        totalRevenue: { $sum: revenueExpr },
        avgOrderValue: { $avg: revenueExpr },
        totalOrders: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
  res.json(data);
});

app.get("/task5", async (req, res) => {
  const data = await Order.aggregate([
    { $addFields: { orderAmount: revenueExpr } },
    {
      $group: {
        _id: null,
        avgAmount: { $avg: "$orderAmount" },
        orders: { $push: "$$ROOT" }
      }
    },
    { $unwind: "$orders" },
    {
      $match: {
        $expr: { $gt: ["$orders.orderAmount", "$avgAmount"] }
      }
    },
    { $sort: { "orders.orderAmount": -1 } },
    { $limit: 5 },
    { $replaceRoot: { newRoot: "$orders" } }
  ]);
  res.json(data);
});

app.get("/task6", async (req, res) => {
  const data = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$orderDate" } },
        totalOrders: { $sum: 1 },
        totalQuantity: { $sum: "$quantity" },
        totalRevenue: { $sum: revenueExpr },
        minOrderValue: { $min: revenueExpr },
        maxOrderValue: { $max: revenueExpr }
      }
    },
    { $sort: { _id: 1 } }
  ]);
  res.json(data);
});

app.get("/task7", async (req, res) => {
  const data = await Order.aggregate([
    {
      $group: {
        _id: "$city",
        totalOrders: { $sum: 1 }
      }
    },
    { $match: { totalOrders: { $gt: 10 } } }
  ]);
  res.json(data);
});

app.get("/task8", async (req, res) => {
  const data = await Order.aggregate([
    {
      $group: {
        _id: "$category",
        totalQuantity: { $sum: "$quantity" },
        avgPrice: { $avg: "$price" }
      }
    },
    {
      $addFields: {
        popularityScore: { $multiply: ["$totalQuantity", "$avgPrice"] }
      }
    },
    { $sort: { popularityScore: -1 } },
    { $limit: 5 }
  ]);
  res.json(data);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});