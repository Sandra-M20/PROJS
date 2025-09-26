// controllers/complaintController.js
const Complaint = require("../models/Complaint");
const multer = require("multer");
const path = require("path");

// Store uploaded files locally for now
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/complaints"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});

const upload = multer({ storage });

// @desc Create new complaint
const createComplaint = async (req, res) => {
  try {
    const { title, category, description, priority, location } = req.body;

    const locationData = location ? JSON.parse(location) : null;

    const photos = req.files ? req.files.map((file) => file.path) : [];

    const complaint = new Complaint({
      title,
      category,
      description,
      priority,
      photos,
      location: {
        lat: locationData?.lat,
        lng: locationData?.lng,
      },
    });

    await complaint.save();
    res.status(201).json({ message: "Complaint submitted successfully", complaint });
  } catch (error) {
    console.error("Error saving complaint:", error);
    res.status(500).json({ message: "Error saving complaint", error });
  }
};

module.exports = { upload, createComplaint };
