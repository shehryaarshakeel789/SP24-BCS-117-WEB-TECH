const express = require("express");
const path = require("path");
const app = express();
const productsRouter = require("./routes/Products");
const adminRouter = require("./routes/admin");

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "Public")));
// serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'Public', 'uploads')));

app.use("/products", productsRouter);
app.use("/admin", adminRouter);

app.get("/", (req, res) => {
    res.render("index");
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});