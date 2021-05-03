const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const connectDB = require("./config/database");
const handleErrors = require("./middlewares/handleErrors");

const indexRouter = require("./routes/index");
const portfolioRouter = require("./routes/portfolio");
const tradeRouter = require("./routes/trade");
require("dotenv").config();

const app = express();
connectDB();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/api/trade", tradeRouter);
app.use("/api/portfolio", portfolioRouter);
app.use(handleErrors);

module.exports = app;
