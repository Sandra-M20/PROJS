const mongoose = require("mongoose");

const wasteRequestSchema = new mongoose.Schema({
  citizenName: { type: String, required: true },
  address: { type: String, required: true },
  wasteType: { type: String, required: true },
  photo: { type: String },
  location: {
    lat: Number,
    lng: Number,
  },
  status: { type: String, default: "Requested" }, // Requested, Assigned, Collected
  assignedTo: { type: String, default: "Not Assigned" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("WasteRequest", wasteRequestSchema);
