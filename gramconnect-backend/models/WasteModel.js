// models/WasteModel.js
const mongoose = require("mongoose");

const WastePickupSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    ward: {
      type: String,
      required: true,
    },
    wasteType: {
      type: String,
      enum: ["Organic", "Plastic", "E-Waste", "Metal", "Mixed"],
      required: true,
    },
    pickupDate: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      enum: ["Morning", "Afternoon", "Evening"],
      default: "Morning",
    },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    notes: {
      type: String,
    },
    photos: [String], // optional: uploaded images (waste photos)
    status: {
      type: String,
      enum: ["Pending", "Collected", "Verified", "Missed", "Cancelled"],
      default: "Pending",
    },
    assignedTo: {
      type: String, // name/id of waste collector
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WastePickup", WastePickupSchema);
