// models/Job.js
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    employer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    company: { type: String },
    logoUrl: { type: String }, // optional uploaded logo
    description: { type: String, required: true },
    category: { type: String, enum: ["Tailoring", "Catering", "Handicrafts", "Agriculture", "Retail", "Care", "Other"], default: "Other" },
    type: { type: String, enum: ["Full-time", "Part-time", "Gig", "Home-based"], default: "Home-based" },
    ward: { type: String },             // local targeting
    address: { type: String },
    lat: { type: Number },              // optional for geolocation
    lng: { type: Number },              // optional
    skills: [{ type: String }],         // required skills tags
    pay: { type: String },              // text or numeric
    isOpen: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
