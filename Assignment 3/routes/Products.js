const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/products");

mongoose.connect("mongodb://localhost:27017/ecommerce", {
}).then(() => {
    console.log("MongoDB connected");
}).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});

router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 8;
        const skip = (page - 1) * limit;

        const filter = {};

        if (req.query.search) {
            filter.name = { $regex: req.query.search, $options: "i" };
        }

        if (req.query.category) {
            filter.category = req.query.category;
        }

        if (req.query.minPrice || req.query.maxPrice) {
            filter.price = {};
            if (req.query.minPrice) {
                filter.price.$gte = parseFloat(req.query.minPrice);
            }
            if (req.query.maxPrice) {
                filter.price.$lte = parseFloat(req.query.maxPrice);
            }
        }

        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limit);

        const products = await Product.find(filter)
            .limit(limit)
            .skip(skip);

        const categories = await Product.distinct("category");

        const minPrice = 0;
        const maxPrice = 1000;

        res.render("products", {
            products,
            categories,
            page,
            totalPages,
            search: req.query.search || "",
            category: req.query.category || "",
            minPrice: req.query.minPrice || "",
            maxPrice: req.query.maxPrice || "",
            filterMinPrice: minPrice,
            filterMaxPrice: maxPrice,
            totalProducts
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error");
    }
});

module.exports = router;