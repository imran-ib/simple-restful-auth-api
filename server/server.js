const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();
const mongoose = require("mongoose");
// ─────────────────────────────────────────────────────────────────── ROUTES ─────
var UserRoutes = require("./routes/UserRoutes");

// ─── DOTENV ─────────────────────────────────────────────────────────────────────
require("dotenv").config();
// ─── DATABASE ───────────────────────────────────────────────────────────────────
mongoose.Promise = global.Promise;
mongoose.connect(
  process.env.DATABASE,
  { useNewUrlParser: true }
);

// ─── MIDDLEWARES ────────────────────────────────────────────────────────────────
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// ─────────────────────────────────────────────────────────────────── ROUTES ─────
app.use("/api/user", UserRoutes);

// ─────────────────────────────────────────────────────────────────── SERVER ─────
PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
