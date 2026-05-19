const express = require("express");
const router = express.Router();
const User = require("../models/User");

// GET /auth/register
router.get("/register", (req, res) => {
    res.render("register");
});

// POST /auth/register
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check password length
        if (password.length < 6) {
            req.flash("error", "Password must be at least 6 characters.");
            return res.redirect("/auth/register");
        }

        // Check if email is already taken
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash("error", "An account with that email already exists.");
            return res.redirect("/auth/register");
        }

        // Create user — password is hashed by the pre-save hook in User model
        const user = new User({ name, email, password });
        await user.save();

        // Log them in right away
        req.session.userId = user._id;
        req.session.userName = user.name;
        req.session.userRole = user.role;

        req.flash("success", `Welcome, ${user.name}! Your account has been created.`);
        res.redirect("/");
    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong. Please try again.");
        res.redirect("/auth/register");
    }
});

// GET /auth/login
router.get("/login", (req, res) => {
    res.render("login");
});

// POST /auth/login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            req.flash("error", "Invalid email or password.");
            return res.redirect("/auth/login");
        }

        // Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            req.flash("error", "Invalid email or password.");
            return res.redirect("/auth/login");
        }

        // Save to session
        req.session.userId = user._id;
        req.session.userName = user.name;
        req.session.userRole = user.role;

        req.flash("success", `Welcome back, ${user.name}!`);
        res.redirect("/");
    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong. Please try again.");
        res.redirect("/auth/login");
    }
});

// GET /auth/logout
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});

module.exports = router;
