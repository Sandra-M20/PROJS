// services/notificationServices.js
import axios from "axios";

export async function sendSMS(phone, message) {
  await axios.post("/api/notifications/sms", { phone, message });
}

export async function notifyUser(userId, message) {
  // could be stored in DB and displayed on dashboard
}
