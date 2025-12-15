const express = require("express");
const connectDB = require("./src/config/db");
const app = express();
const port = 3000;
const productRoutes = require("./src/routes/productRoutes");
const userRoutes = require("./src/routes/userRoutes");
require("dotenv").config();

connectDB();
app.use(express.json());

app.use("/products", productRoutes);
app.use("/auth", userRoutes);

app.listen(port, () => {
  console.log(`App2 listening at http://localhost:${port}`);
});

module.exports = app;