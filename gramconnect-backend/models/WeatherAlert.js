const mongoose = require("mongoose");

const weatherAlertSchema = new mongoose.Schema({
  message: String,
  severity: { type: String, enum: ["Info", "Warning", "Severe"], default: "Info" },
  ward: String,
  sentTo: [String],
}, { timestamps: true });

module.exports = mongoose.model("WeatherAlert", weatherAlertSchema);
