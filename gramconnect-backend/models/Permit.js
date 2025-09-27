const mongoose = require("mongoose");

const PermitSchema = new mongoose.Schema({
  owner: { type: String, required: true },
  plotLocation: { type: String, required: true },
  planFile: { type: String },
  status: {
    type: String,
    enum: ["Pending", "Reviewed", "Approved"],
    default: "Pending",
  },
  appliedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Permit", PermitSchema);
