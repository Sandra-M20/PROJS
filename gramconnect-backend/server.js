const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const buildingPermitRoutes = require("./routes/buildingPermitRoutes");
const adminRoutes = require("./routes/adminRoutes");
const wasteRoutes = require("./routes/wasteRoutes"); //  Added

const complaintRoutes = require("./routes/complaintRoutes")

const app = express();
app.use(express.json());
app.use(cors());

//  MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB connected"))
  .catch((err) => console.error(" MongoDB connection failed:", err));

//  API routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/building-permits", buildingPermitRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/waste", wasteRoutes); //  Added route

//  Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
