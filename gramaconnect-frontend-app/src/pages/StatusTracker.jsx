import React, { useState } from "react";
import "./StatusTracker.css";

const StatusTracker = () => {
  const [status] = useState("In Progress"); // could be Pending, In Progress, Resolved

  return (
    <div className="status-container">
      <h2>📍 Track Your Request</h2>
      <div className="tracker">
        <div className={`step ${status === "Pending" ? "active" : ""}`}>Pending</div>
        <div className={`step ${status === "In Progress" ? "active" : ""}`}>In Progress</div>
        <div className={`step ${status === "Resolved" ? "active" : ""}`}>Resolved</div>
      </div>
      <p>Current Status: <b>{status}</b></p>
    </div>
  );
};

export default StatusTracker;
