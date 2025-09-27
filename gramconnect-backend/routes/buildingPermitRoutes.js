// routes/buildingPermitRoutes.js
const express = require("express");
const router = express.Router();
const { auth, only } = require("../middleware/auth"); // ✅ correct import
const {
  applyPermit,
  getPermits,
  updateStatus,
} = require("../controllers/buildingPermitController");

// Citizen applies for a building permit
router.post("/apply", applyPermit);

// Officer can view all permit applications
router.get("/all", auth, only(["officer"]), getPermits);

// Officer can update application status
router.patch("/:id/status", auth, only(["officer"]), updateStatus);

module.exports = router;
