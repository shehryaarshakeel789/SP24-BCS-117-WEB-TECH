require("dotenv").config();                          // ← loads .env variables

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const app = express();

const productsRouter = require("./routes/Products");
const adminRouter    = require("./routes/admin");
const authRouter     = require("./routes/auth");
const apiRouter      = require("./routes/api");           // JWT API router
const salesRouter    = require("./routes/sales");         // ← NEW: Sales Dashboard
const { isLoggedIn, isAdmin } = require("./middleware/auth");

mongoose.connect("mongodb://localhost:27017/ecommerce").then(() => {
    console.log("MongoDB connected");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "Public")));
app.use("/uploads", express.static(path.join(__dirname, "Public", "uploads")));

app.use(session({
    secret: "nikeSecret123",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: "mongodb://localhost:27017/ecommerce" }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

app.use(flash());

// Make currentUser and flash messages available in every view automatically
app.use((req, res, next) => {
    res.locals.currentUser = req.session.userId
        ? { id: req.session.userId, name: req.session.userName, role: req.session.userRole }
        : null;
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg   = req.flash("error");
    next();
});

// ── Routes ────────────────────────────────────────────────────
app.use("/auth",     authRouter);
app.use("/products", productsRouter);
app.use("/admin",    isAdmin, adminRouter);
app.use("/api/v1",   apiRouter);                // JWT-protected JSON API
app.use("/api/v1",   salesRouter);              // ← NEW: mounts /api/v1/sales-data
app.use("/sales",    isAdmin, salesRouter);     // ← NEW: mounts GET /sales (admin only)

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/checkout", isLoggedIn, (req, res) => {
    res.send(`<h2>Checkout Page</h2><p>Welcome, ${req.session.userName}!</p>`);
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running at http://localhost:${process.env.PORT || 3000}`);
});
