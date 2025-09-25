import React, { useState } from "react";
import "./WasteManagement.css";

const WasteManagement = () => {
  const [wasteType, setWasteType] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [photo, setPhoto] = useState(null);
  const [pickupHistory, setPickupHistory] = useState([]);
  const [status, setStatus] = useState("");

  // Worker teams for assignment
  const workers = ["Team A", "Team B", "Ward Worker 12", "Team C"];

  const handlePhotoUpload = (e) => {
    setPhoto(e.target.files[0]);
  };

  const schedulePickup = () => {
    if (!wasteType || !date || !timeSlot) {
      setStatus("⚠ Please fill all required fields!");
      return;
    }

    const assignedWorker = workers[Math.floor(Math.random() * workers.length)];

    const newRequest = {
      id: pickupHistory.length + 1,
      type: wasteType,
      date,
      timeSlot,
      photo: photo ? photo.name : "No photo uploaded",
      worker: assignedWorker,
      progress: "Scheduled",
    };

    setPickupHistory([...pickupHistory, newRequest]);
    setStatus(`✅ Pickup Scheduled! Assigned to ${assignedWorker}`);
    setWasteType("");
    setDate("");
    setTimeSlot("");
    setPhoto(null);
  };

  const markCollected = (id) => {
    const updatedHistory = pickupHistory.map((req) =>
      req.id === id ? { ...req, progress: "Collected ✅" } : req
    );
    setPickupHistory(updatedHistory);
  };

  return (
    <div className="waste-container">
      <h2>♻ Waste Management Request</h2>

      <div className="form-group">
        <label>Waste Type *</label>
        <select value={wasteType} onChange={(e) => setWasteType(e.target.value)}>
          <option value="">-- Select --</option>
          <option value="Plastic">Plastic</option>
          <option value="E-Waste">E-Waste</option>
          <option value="Medical">Medical Waste</option>
          <option value="Organic">Organic</option>
          <option value="Bulk Waste">Bulk Waste (Roadside)</option>
        </select>
      </div>

      <div className="form-group">
        <label>Preferred Date *</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Time Slot *</label>
        <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
          <option value="">-- Select --</option>
          <option value="Morning">Morning (8 AM - 11 AM)</option>
          <option value="Afternoon">Afternoon (12 PM - 3 PM)</option>
          <option value="Evening">Evening (4 PM - 7 PM)</option>
        </select>
      </div>

      <div className="form-group">
        <label>Upload Photo (Optional)</label>
        <input type="file" accept="image/*" onChange={handlePhotoUpload} />
      </div>

      <button onClick={schedulePickup}>Request Pickup</button>
      {status && <p className="status">{status}</p>}

      {/* Pickup History */}
      <h3>📜 Pickup History</h3>
      {pickupHistory.length === 0 ? (
        <p>No requests yet.</p>
      ) : (
        <ul className="history-list">
          {pickupHistory.map((req) => (
            <li key={req.id}>
              <strong>{req.type}</strong> | {req.date} ({req.timeSlot}) <br />
              Assigned To: {req.worker} <br />
              Status: {req.progress} <br />
              {req.photo !== "No photo uploaded" && (
                <span>📸 {req.photo}</span>
              )}
              {req.progress !== "Collected ✅" && (
                <button
                  className="collect-btn"
                  onClick={() => markCollected(req.id)}
                >
                  Mark as Collected
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WasteManagement;
