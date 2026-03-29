const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("../config/db");
const regionRoutes = require("../routes/regionRoutes");
const infoRoutes = require("../routes/infoRoutes");
const contactRoutes = require("../routes/contactRoutes");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "../public")));
app.use("/media", express.static(path.join(__dirname, "../media_files")));

// API routes
app.use("/api", regionRoutes);
app.use("/api", infoRoutes);
app.use("/api", contactRoutes);

// Serve index.html for root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = app;
