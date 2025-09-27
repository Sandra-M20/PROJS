// models/Application.js
const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    seeker: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    coverLetter: { type: String },
    resumeUrl: { type: String }, // uploaded resume
    status: { type: String, enum: ["Applied", "Shortlisted", "Selected", "Rejected"], default: "Applied" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
