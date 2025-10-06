// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { auth, only } = require("../middleware/auth");
const Complaint = require("../models/Complaint");
const BuildingPermit = require("../models/BuildingPermit");
const Job = require("../models/Job");
const User = require("../models/User");

//  Admin dashboard summary route
router.get("/stats", auth, only(["admin"]), async (req, res) => {
  try {
    const [totalComplaints, totalPermits, totalJobs, totalUsers] = await Promise.all([
      Complaint.countDocuments(),
      BuildingPermit.countDocuments(),
      Job.countDocuments(),
      User.countDocuments(),
    ]);

    res.json({
      totalComplaints,
      totalPermits,
      totalJobs,
      totalUsers,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to load stats" });
  }
});

//  Admin: View all users
router.get("/users", auth, only(["admin"]), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (e) {
    res.status(500).json({ message: "Failed to load users" });
  }
});

//  Admin: Update a user's role
router.patch("/user/:id", auth, only(["admin"]), async (req, res) => {
  try {
    const { role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Role updated", user: updatedUser });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to update user role" });
  }
});

//  Officer Data (for officer dashboard)
router.get("/officer-data", auth, only(["officer", "admin"]), async (req, res) => {
  try {
    const permits = await BuildingPermit.find({ status: "Pending" });
    res.json(permits);
  } catch (e) {
    res.status(500).json({ message: "Failed to load officer data" });
  }
});

module.exports = router;
