const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");

// 🔍 Complaint Analytics Summary
router.get("/analytics/summary", async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: "Pending" });
    const inProgress = await Complaint.countDocuments({ status: "In Progress" });
    const resolved = await Complaint.countDocuments({ status: "Resolved" });

    // Optional: calculate average resolution days
    const avg = await Complaint.aggregate([
      { $match: { resolvedAt: { $exists: true } } },
      { $project: { days: { $divide: [{ $subtract: ["$resolvedAt", "$createdAt"] }, 86400000] } } },
      { $group: { _id: null, avgResolutionDays: { $avg: "$days" } } }
    ]);

    res.json({
      total,
      pending,
      inProgress,
      resolved,
      avgResolutionDays: avg[0]?.avgResolutionDays || 0
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Analytics failed" });
  }
});

module.exports = router;
