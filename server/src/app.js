require("dotenv").config();
require("./db/connection");
const express = require("express");
const cors = require("cors");
const { json, urlencoded } = express;
const authRouter = require("./routes/auth.route");
const productRouter = require("./routes/product.route");
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

// routes
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
