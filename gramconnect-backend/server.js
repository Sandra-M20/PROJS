// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// existing routes you already have
const complaintRoutes = require("./routes/complaintRoutes");
const buildingPermitRoutes = require("./routes/buildingPermitRoutes");
const wasteRoutes = require("./routes/wasteRoutes");
const weatherRoutes = require("./routes/weatherRoutes");

// NEW routes
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

// Static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/complaints", complaintRoutes);
app.use("/api/permits", buildingPermitRoutes);
app.use("/api/waste", wasteRoutes);
app.use("/api/weather", weatherRoutes);

// NEW
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB Connected Successfully"))
  .catch((err) => console.error(" MongoDB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
