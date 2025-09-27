// routes/authRoutes.js
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

const sign = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

router.post("/register", async (req, res) => {
  try {
    const { name, phone, password, role = "seeker", ward, skills = [] } = req.body;
    if (!name || !phone || !password) return res.status(400).json({ message: "Missing fields" });

    const exists = await User.findOne({ phone });
    if (exists) return res.status(400).json({ message: "Phone already registered" });

    const user = await User.create({ name, phone, password, role, ward, skills });
    const token = sign(user);
    res.json({ token, user });
  } catch (e) {
    res.status(500).json({ message: "Register failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });
    const token = sign(user);
    res.json({ token, user });
  } catch (e) {
    res.status(500).json({ message: "Login failed" });
  }
});

module.exports = router;
