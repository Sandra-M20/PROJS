// models/WasteBin.js
const mongoose = require("mongoose");

const WasteBinSchema = new mongoose.Schema(
  {
    ward: { type: String, required: true },
    type: { type: String, enum: ["Plastic", "Organic", "Mixed"], default: "Mixed" },
    location: { lat: Number, lng: Number },
    fillLevel: { type: Number, default: 0 }, // 0-100
    status: { type: String, enum: ["Normal", "Overflow", "Maintenance"], default: "Normal" },
    lastEmptied: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("WasteBin", WasteBinSchema);
