const path = require("path");
const fs = require("fs");

exports.simplePlanVerifier = (filePath, plotLocation) => {
  const stats = fs.statSync(filePath);
  const sizeMB = +(stats.size / (1024 * 1024)).toFixed(2);
  const mimeType = path.extname(filePath).toLowerCase(); // .pdf / .png / .jpg etc.

  const issues = [];

  if (!plotLocation || plotLocation.length < 6) {
    issues.push("Plot location seems incomplete.");
  }
  if (![".pdf",".png",".jpg",".jpeg"].includes(mimeType)) {
    issues.push("Unsupported file type. Use PDF/PNG/JPG.");
  }
  if (sizeMB > 25) {
    issues.push("File too large. Max 25 MB.");
  }
  // You can add OCR/plan parsing here or call a Python service.

  return {
    passed: issues.length === 0,
    issues,
    meta: { sizeMB, mimeType, pages: mimeType === ".pdf" ? 1 : undefined }
  };
};
