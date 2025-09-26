// routes/weatherRoutes.js
const express = require("express");
const router = express.Router();

// static localized tips (keep small and extensible)
const tips = {
  general: [
    { type: "heavy-rain", message_en: "Stay indoors, avoid low-lying areas.", message_ml: "ജോലി ചെയ്യേണ്ടത് വീട്ടി‌ലായിരിക്കുക..." },
    { type: "heat", message_en: "Stay hydrated and avoid peak sun hours.", message_ml: "വെളുത്ത സമയം ഒഴിവാക്കുക..." }
  ],
  farmer: {
    coconut: [
      { event: "wind", message_en: "Secure coconut trees & remove loose fronds.", message_ml: "..." }
    ],
    banana: [
      { event: "wind", message_en: "Tie bunches and anchor plants.", message_ml: "..." }
    ],
    default: [
      { event: "heavy-rain", message_en: "Delay pesticide spraying; cover seedlings.", message_ml: "..." }
    ]
  }
};

router.get("/tips", (req, res) => {
  // query role=farmer&crop=banana&lang=ml
  const { role, crop, lang } = req.query;
  if (role === "farmer") {
    const list = (tips.farmer[crop] || tips.farmer.default).map(t => ({ event: t.event || "general", message: lang === "ml" ? t.message_ml || t.message_en : t.message_en }));
    return res.json(list);
  }
  const list = tips.general.map(t => ({ event: t.type, message: lang === "ml" ? t.message_ml || t.message_en : t.message_en }));
  res.json(list);
});

module.exports = router;
