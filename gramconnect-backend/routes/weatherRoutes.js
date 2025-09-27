const express = require("express");
const axios = require("axios");
const dayjs = require("dayjs");
const WeatherAlert = require("../models/WeatherAlert");
const Subscriber = require("../models/Subscriber");
const { sendSMS } = require("../utils/notify");

const router = express.Router();

const OWM_KEY = process.env.OWM_API_KEY;
if (!OWM_KEY) console.warn("⚠️ OWM_API_KEY missing in .env");

/**
 * GET /api/weather/current?lat=&lon=
 */
router.get("/current", async (req, res) => {
  try {
    const { lat = "10.8505", lon = "76.2711" } = req.query; // Kerala default
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OWM_KEY}`;
    const { data } = await axios.get(url);

    const payload = {
      location: data.name,
      temp: data.main.temp,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      wind: data.wind.speed,
      description: data.weather?.[0]?.description || "",
      icon: data.weather?.[0]?.icon || "01d",
      time: data.dt * 1000,
    };
    res.json(payload);
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ message: "Failed to fetch current weather" });
  }
});

/**
 * GET /api/weather/forecast?lat=&lon=
 * Returns simplified next-5-day forecast (daily buckets)
 */
router.get("/forecast", async (req, res) => {
  try {
    const { lat = "10.8505", lon = "76.2711" } = req.query;
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${OWM_KEY}`;
    const { data } = await axios.get(url);

    // Group by day
    const buckets = {};
    data.list.forEach((item) => {
      const d = dayjs(item.dt * 1000).format("YYYY-MM-DD");
      if (!buckets[d]) buckets[d] = [];
      buckets[d].push(item);
    });

    const days = Object.keys(buckets)
      .slice(0, 5)
      .map((d) => {
        const arr = buckets[d];
        const temps = arr.map((x) => x.main.temp);
        const icons = arr.map((x) => x.weather?.[0]?.icon).filter(Boolean);
        return {
          date: d,
          min: Math.min(...temps),
          max: Math.max(...temps),
          icon: icons.length ? icons[Math.floor(icons.length / 2)] : "01d",
          description: arr[0]?.weather?.[0]?.description || "",
        };
      });

    res.json(days);
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ message: "Failed to fetch forecast" });
  }
});

/**
 * --- Local alerts CRUD ---
 */

// Create and send SMS to subscribers in a ward (or to custom recipients)
router.post("/send-alert", async (req, res) => {
  try {
    const { message, severity = "Info", ward, recipients = [] } = req.body;
    if (!message) return res.status(400).json({ message: "Message required" });

    // Collect recipients: ward subscribers + explicit recipients[]
    let phones = [];

    if (ward) {
      const subs = await Subscriber.find({ ward });
      phones = subs.map((s) => s.phone);
    }
    if (Array.isArray(recipients) && recipients.length) {
      phones = [...new Set([...phones, ...recipients])];
    }

    // send (avoid sending to empty)
    const sentTo = [];
    for (const p of phones) {
      try {
        await sendSMS(p, `[${severity}] ${message}`);
        sentTo.push(p);
      } catch (e) {
        console.error("SMS failed:", p, e.message);
      }
    }

    const alertDoc = await WeatherAlert.create({
      message,
      severity,
      ward,
      sentTo,
    });

    res.json({ message: "Alert processed", data: alertDoc });
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ message: "Failed to send alert" });
  }
});

// List stored alerts
router.get("/alerts", async (req, res) => {
  try {
    const { ward } = req.query;
    const q = ward ? { ward } : {};
    const items = await WeatherAlert.find(q).sort({ createdAt: -1 }).limit(50);
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: "Failed to load alerts" });
  }
});

/**
 * --- Subscribers ---
 */
router.post("/subscribe", async (req, res) => {
  try {
    const { phone, ward } = req.body;
    if (!phone || !ward) return res.status(400).json({ message: "phone & ward required" });

    // Upsert by phone
    const doc = await Subscriber.findOneAndUpdate(
      { phone },
      { $set: { ward } },
      { new: true, upsert: true }
    );
    res.json({ message: "Subscribed", data: doc });
  } catch (e) {
    if (e.code === 11000) return res.status(200).json({ message: "Already subscribed" });
    res.status(500).json({ message: "Subscribe failed" });
  }
});

router.get("/subscribers", async (req, res) => {
  try {
    const { ward } = req.query;
    const q = ward ? { ward } : {};
    const items = await Subscriber.find(q).sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: "Failed to load subscribers" });
  }
});

module.exports = router;
