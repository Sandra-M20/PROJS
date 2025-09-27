const express = require("express");
const router = express.Router();
const { uploadPermit } = require("../controllers/permitController");

router.post("/apply", uploadPermit);

module.exports = router;
