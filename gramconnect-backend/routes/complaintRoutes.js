// routes/complaintRoutes.js
const express = require("express");
const router = express.Router();
const { upload, createComplaint } = require("../controllers/complaintController");

// POST /api/complaints
router.post("/", upload.array("photos", 5), createComplaint);

module.exports = router;
