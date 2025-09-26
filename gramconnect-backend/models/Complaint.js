// models/Complaint.js
const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    priority: { type: String, default: "Low" },
    photos: [{ type: String }], // Store file URLs or paths
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    status: { type: String, default: "Pending" },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "complaints" }
);

module.exports = mongoose.model("Complaint", complaintSchema);
