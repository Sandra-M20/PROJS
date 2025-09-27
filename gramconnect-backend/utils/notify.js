// utils/notify.js
// Dummy Notification Helper (no Twilio needed for now)

exports.sendSMS = async (to, message) => {
  console.log(`📱 [Mock SMS] To: ${to} | Message: ${message}`);
  // No actual SMS sent — this is for local testing only
};

exports.sendEmail = async (to, subject, body) => {
  console.log(`📧 [Mock Email] To: ${to} | Subject: ${subject}`);
};
const twilio = require("twilio");

const USE_TWILIO = String(process.env.USE_TWILIO).toLowerCase() === "true";

let client = null;
if (USE_TWILIO) {
  try {
    client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    console.log("✅ Twilio enabled");
  } catch (e) {
    console.error("❌ Twilio init failed, falling back to mock:", e.message);
  }
}

async function sendSMS(to, body) {
  if (USE_TWILIO && client) {
    return client.messages.create({
      to,
      from: process.env.TWILIO_PHONE_NUMBER,
      body,
    });
  }
  // Mock mode
  console.log(`[SMS MOCK] to=${to} | ${body}`);
  return { sid: "mock" };
}

module.exports = { sendSMS };
