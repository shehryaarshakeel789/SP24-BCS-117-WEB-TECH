const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Product = require("../models/products");
const Order = require("../models/Order");
const { verifyToken } = require("../middleware/verifyToken");

// ─────────────────────────────────────────────
//  AUTH
// ─────────────────────────────────────────────

// POST /api/v1/auth/login
// Public — verify credentials and return a JWT
router.post("/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        // Compare password using the method defined on the User model
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        // Build the token payload — only store what we need
        const payload = {
            user_id: user._id,
            role: user.role,
        };

        // Sign the token with the secret from .env; set it to expire in 1 hour
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({
            message: `Welcome, ${user.name}!`,
            token,                  // client stores this and sends it with future requests
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong." });
    }
});

router.get("/products", async (req, res) => {
    try {
        const page  = parseInt(req.query.page)  || 1;
        const limit = parseInt(req.query.limit) || 8;
        const skip  = (page - 1) * limit;

        // Build the same filter object used in the EJS routes
        const filter = {};

        if (req.query.search) {
            filter.name = { $regex: req.query.search, $options: "i" };
        }

        if (req.query.category) {
            filter.category = req.query.category;
        }

        if (req.query.minPrice || req.query.maxPrice) {
            filter.price = {};
            if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
            if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
        }

        const totalProducts = await Product.countDocuments(filter);
        const totalPages    = Math.ceil(totalProducts / limit);
        const products      = await Product.find(filter).skip(skip).limit(limit);

        res.json({
            page,
            totalPages,
            totalProducts,
            products,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching products." });
    }
});

// GET /api/v1/products/:id
// Returns details for a single product
router.get("/products/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Product not found." });
        }
        res.json({ product });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching product." });
    }
});

// ─────────────────────────────────────────────
//  PROTECTED ENDPOINTS  (verifyToken required)
// ─────────────────────────────────────────────

// GET /api/v1/user/profile
// Returns the authenticated user's data (no password)
router.get("/user/profile", verifyToken, async (req, res) => {
    try {
        // req.user was set by verifyToken — it contains user_id and role
        const user = await User.findById(req.user.user_id).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        res.json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching profile." });
    }
});

// POST /api/v1/orders
// Allows a logged-in user to place an order
// Expected body: { items: [ { product: "<id>", quantity: 2 }, ... ] }
router.post("/orders", verifyToken, async (req, res) => {
    try {
        const { items } = req.body;

        // Basic validation
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "Order must include at least one item." });
        }

        // Calculate total price by looking up each product
        let totalPrice = 0;
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ error: `Product ${item.product} not found.` });
            }
            totalPrice += product.price * (item.quantity || 1);
        }

        // Create and save the order
        const order = new Order({
            user: req.user.user_id,   // comes from the decoded JWT
            items,
            totalPrice,
        });
        await order.save();

        res.status(201).json({
            message: "Order placed successfully.",
            order,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error placing order." });
    }
});

module.exports = router;
