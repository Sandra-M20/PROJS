const Permit = require("../models/Permit");
const path = require("path");
const multer = require("multer");

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/permits");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

exports.uploadPermit = [
  upload.single("planFile"),
  async (req, res) => {
    try {
      const { owner, plotLocation } = req.body;
      const planFile = req.file ? req.file.filename : null;

      const newPermit = new Permit({ owner, plotLocation, planFile });
      await newPermit.save();

      res.json({ message: "✅ Permit application submitted successfully!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "❌ Server error, try again later." });
    }
  },
];
