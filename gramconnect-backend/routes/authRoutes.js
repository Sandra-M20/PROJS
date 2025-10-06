
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

/**
 *  REGISTER USER
 * Available roles: "citizen", "officer", "admin"
 */
router.post("/register", async (req, res) => {
  try {
    const { name, phone, password, role } = req.body;

    // Basic validation
    if (!name || !phone || !password)
      return res.status(400).json({ message: "All fields required" });

    // Check if user exists
    const existing = await User.findOne({ phone });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      phone,
      password: hashed,
      role: role || "citizen",
    });

    // Token generation
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
});

/**
 *  LOGIN USER
 */
router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Check user existence
    const user = await User.findOne({ phone });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid password" });

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Respond in frontend expected format
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role, // admin, officer, citizen
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

/**
 *  GET PROFILE (for authenticated user)
 */
router.get("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Profile error:", err);
    res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = router;
