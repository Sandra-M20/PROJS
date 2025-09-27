const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.auth = async (req, res, next) => {
  try {
    const hdr = req.headers.authorization || "";
    if (!hdr.startsWith("Bearer ")) return res.status(401).json({ message: "No token" });
    const token = hdr.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) return res.status(401).json({ message: "Invalid token" });
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
};

exports.only = (roles = []) => (req, res, next) => {
  if (!roles.length) return next();
  if (!roles.includes(req.user.role)) return res.status(403).json({ message: "Forbidden" });
  next();
};
