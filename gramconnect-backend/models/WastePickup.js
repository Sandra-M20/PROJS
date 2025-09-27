// models/WastePickup.js
const mongoose = require("mongoose");

const WastePickupSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    wasteType: {
      type: String,
      required: true,
      enum: ["Organic", "Plastic", "E-Waste", "Metal", "Mixed"],
    },
    pickupDate: {
      type: Date,
      required: true,
    },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    notes: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Collected", "Verified"],
      default: "Pending",
    },
    photos: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("WastePickup", WastePickupSchema);
