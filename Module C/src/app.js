const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("../config/db");
const authRoutes = require("../routes/authRoutes");
const authMiddleware = require("../middleware/authMiddleware");

const albumRoutes = require("../routes/albumRoutes");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", albumRoutes);

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

module.exports = app;
