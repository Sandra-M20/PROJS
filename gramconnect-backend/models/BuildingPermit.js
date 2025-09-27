const mongoose = require("mongoose");

const StatusSchema = new mongoose.Schema({
  status: { type: String, enum: ["Pending", "Reviewed", "Approved", "Rejected"], required: true },
  by: { type: String, default: "system" },       // officer email or 'system'
  note: { type: String },
  at: { type: Date, default: Date.now }
});

const BuildingPermitSchema = new mongoose.Schema({
  owner: { type: String, required: true },
  applicantEmail: { type: String, required: false }, // used for notifications
  applicantPhone: { type: String, required: false }, // used for SMS
  plotLocation: { type: String, required: true },    // survey or address
  geo: {                                             // Geo-tag
    lat: Number,
    lng: Number
  },
  planFile: { type: String, required: true },        // local path or cloud url

  status: { type: String, default: "Pending", enum: ["Pending","Reviewed","Approved","Rejected"] },
  timeline: [StatusSchema],

  aiCheck: {
    passed: { type: Boolean, default: false },
    issues: [{ type: String }],
    meta: {
      mimeType: String,
      sizeMB: Number,
      pages: Number
    }
  },

  assignedOfficer: { type: String }, // officer email (optional)
  appliedDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("BuildingPermit", BuildingPermitSchema);
