// utils/uploader.js
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const baseDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir);

function makeStorage(folder) {
  const dest = path.join(baseDir, folder);
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, dest),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${folder}_${Date.now()}${ext}`);
    },
  });
}

exports.uploadLogo = multer({ storage: makeStorage("logos") });
exports.uploadResume = multer({ storage: makeStorage("resumes") });
