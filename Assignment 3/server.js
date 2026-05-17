const express = require("express");
const app = express();
const productsRouter = require("./routes/Products");

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use("/products", productsRouter);

app.get("/", (req, res) => {
    res.render("index");
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});