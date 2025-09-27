const mongoose = require("mongoose");

const subscriberSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true },
    ward: { type: String, required: true },
  },
  { timestamps: true }
);

subscriberSchema.index({ phone: 1 }, { unique: true });

module.exports = mongoose.model("Subscriber", subscriberSchema);
