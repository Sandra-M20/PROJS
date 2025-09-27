// routes/wasteRoutes.js
const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const dayjs = require("dayjs");
const WastePickup = require("../models/WastePickup");
const WasteBin = require("../models/WasteBin");

// --- Multer (Local uploads). Replace with Cloudinary later if needed ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "..", "uploads", "waste")),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `waste_${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// ---- Schedule Pickup ----
router.post("/pickups", upload.array("photos", 5), async (req, res) => {
  try {
    const {
      name, phone, address, ward, wasteType,
      preferredDate, timeSlot, notes, location
    } = req.body;

    if (!name || !phone || !address || !ward || !wasteType || !preferredDate || !timeSlot) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const pics = (req.files || []).map(f => `/uploads/waste/${path.basename(f.path)}`);
    const loc = location ? JSON.parse(location) : null;

    const doc = await WastePickup.create({
      name, phone, address, ward, wasteType,
      preferredDate: dayjs(preferredDate).toDate(),
      timeSlot, notes, photos: pics, location: loc
    });

    res.json({ message: "Pickup scheduled", data: doc });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

// ---- Get My Pickups by phone ----
router.get("/pickups", async (req, res) => {
  try {
    const { phone, ward } = req.query;
    const q = {};
    if (phone) q.phone = phone;
    if (ward) q.ward = ward;

    const items = await WastePickup.find(q).sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---- Update Status (Admin) ----
router.patch("/pickups/:id/status", async (req, res) => {
  try {
    const { status, assignedTo } = req.body;
    const ok = ["Pending", "Assigned", "Collected", "Missed", "Cancelled"];
    if (status && !ok.includes(status)) return res.status(400).json({ message: "Invalid status" });

    const doc = await WastePickup.findByIdAndUpdate(
      req.params.id,
      { $set: { status, ...(assignedTo ? { assignedTo } : {}) } },
      { new: true }
    );
    res.json(doc);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---- Report Overflow ----
router.post("/overflow", upload.array("photos", 3), async (req, res) => {
  try {
    const { ward, type, location } = req.body;
    const pics = (req.files || []).map(f => `/uploads/waste/${path.basename(f.path)}`);
    const loc = location ? JSON.parse(location) : null;

    const bin = await WasteBin.create({
      ward,
      type: type || "Mixed",
      location: loc,
      fillLevel: 95,
      status: "Overflow",
      lastEmptied: null,
    });

    res.json({ message: "Overflow reported", data: { bin, photos: pics } });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---- List Bins ----
router.get("/bins", async (req, res) => {
  try {
    const bins = await WasteBin.find().sort({ updatedAt: -1 });
    res.json(bins);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---- Update a Bin ----
router.patch("/bins/:id", async (req, res) => {
  try {
    const { fillLevel, status } = req.body;
    const doc = await WasteBin.findByIdAndUpdate(
      req.params.id,
      { $set: { ...(fillLevel != null ? { fillLevel } : {}), ...(status ? { status } : {}) } },
      { new: true }
    );
    res.json(doc);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---- Ward Calendar (static demo) ----
router.get("/calendar", async (req, res) => {
  const { ward = "1" } = req.query;
  const calendar = {
    ward,
    weekly: [
      { day: "Monday",    types: ["Plastic", "Mixed"] },
      { day: "Tuesday",   types: ["Organic"] },
      { day: "Wednesday", types: ["Plastic"] },
      { day: "Thursday",  types: ["Mixed"] },
      { day: "Friday",    types: ["Organic"] },
      { day: "Saturday",  types: ["E-Waste"] },
      { day: "Sunday",    types: [] },
    ],
  };
  res.json(calendar);
});

// ---- Analytics (quick counts) ----
router.get("/analytics", async (req, res) => {
  try {
    const byStatus = await WastePickup.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);
    const byType = await WastePickup.aggregate([{ $group: { _id: "$wasteType", count: { $sum: 1 } } }]);
    res.json({ byStatus, byType });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---- Export CSV (basic) ----
router.get("/export.csv", async (req, res) => {
  try {
    const items = await WastePickup.find().sort({ createdAt: -1 });
    let csv = "name,phone,address,ward,wasteType,preferredDate,timeSlot,status\n";
    items.forEach((i) => {
      csv += `"${i.name}","${i.phone}","${i.address}","${i.ward}","${i.wasteType}",${dayjs(i.preferredDate).format("YYYY-MM-DD")},"${i.timeSlot}","${i.status}"\n`;
    });
    res.header("Content-Type", "text/csv");
    res.attachment("pickups.csv");
    res.send(csv);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

