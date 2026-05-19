const express = require("express");
const router  = express.Router();
const Order   = require("../models/Order");

// ─────────────────────────────────────────────────────────────
//  Helper: build the sales-stats object used by both routes
// ─────────────────────────────────────────────────────────────
async function getSalesStats() {
    // 1. Total orders & total revenue in a single aggregation pass
    const summary = await Order.aggregate([
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$totalPrice" },
                totalOrders:  { $sum: 1 },
            },
        },
    ]);

    const totalRevenue = summary[0]?.totalRevenue ?? 0;
    const totalOrders  = summary[0]?.totalOrders  ?? 0;

    // 2. Revenue by status (for the status-breakdown card)
    const revenueByStatus = await Order.aggregate([
        {
            $group: {
                _id:     "$status",
                revenue: { $sum: "$totalPrice" },
                count:   { $sum: 1 },
            },
        },
        { $sort: { revenue: -1 } },
    ]);

    // 3. Top-selling products (unwind items array, sum quantities per product)
    const topProducts = await Order.aggregate([
        { $unwind: "$items" },
        {
            $group: {
                _id:           "$items.product",
                totalQuantity: { $sum: "$items.quantity" },
                totalRevenue:  { $sum: { $multiply: ["$items.quantity", 1] } }, // price not stored on item
            },
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: 5 },
        {
            $lookup: {
                from:         "products",   // MongoDB collection name
                localField:   "_id",
                foreignField: "_id",
                as:           "productInfo",
            },
        },
        { $unwind: { path: "$productInfo", preserveNullAndEmpty: true } },
        {
            $project: {
                name:          { $ifNull: ["$productInfo.name",  "Unknown Product"] },
                price:         { $ifNull: ["$productInfo.price",  0] },
                totalQuantity: 1,
            },
        },
    ]);

    // 4. Monthly revenue trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyTrend = await Order.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        {
            $group: {
                _id: {
                    year:  { $year:  "$createdAt" },
                    month: { $month: "$createdAt" },
                },
                revenue: { $sum: "$totalPrice" },
                orders:  { $sum: 1 },
            },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // 5. Recent transactions (last 8 orders, newest first)
    const recentOrders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(8)
        .populate("user", "name email")
        .populate("items.product", "name price");

    return {
        totalRevenue,
        totalOrders,
        revenueByStatus,
        topProducts,
        monthlyTrend,
        recentOrders,
    };
}

// ─────────────────────────────────────────────────────────────
//  GET /sales  →  renders the EJS Sales Dashboard
// ─────────────────────────────────────────────────────────────
router.get("/", async (req, res) => {
    try {
        const stats = await getSalesStats();
        res.render("sales", { stats });
    } catch (err) {
        console.error("Sales dashboard error:", err);
        res.status(500).send("Error loading sales dashboard.");
    }
});

// ─────────────────────────────────────────────────────────────
//  GET /api/v1/sales-data  →  returns JSON (for real-time poll)
//  This is mounted in server.js under /api/v1 so the full path
//  is  GET /api/v1/sales-data
// ─────────────────────────────────────────────────────────────
router.get("/sales-data", async (req, res) => {
    try {
        const stats = await getSalesStats();
        res.json({ success: true, data: stats });
    } catch (err) {
        console.error("Sales data API error:", err);
        res.status(500).json({ error: "Error fetching sales data." });
    }
});

module.exports = router;
