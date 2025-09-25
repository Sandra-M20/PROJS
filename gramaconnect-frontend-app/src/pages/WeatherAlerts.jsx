import React, { useState } from "react";
import "./WeatherAlerts.css";

const WeatherAlerts = () => {
  const [alerts] = useState([
    { type: "Heavy Rain", precaution: "Avoid low-lying areas & keep drains clear.", severity: "orange", daysLeft: 2 },
    { type: "Strong Winds", precaution: "Secure roofs & avoid sea travel.", severity: "red", daysLeft: 1 },
    { type: "Heat Wave", precaution: "Stay hydrated & avoid outdoor work.", severity: "yellow", daysLeft: 3 }
  ]);

  return (
    <div className="weather-container">
      <h2>🌦 Weather Alerts</h2>
      {alerts.map((a, i) => (
        <div className="alert-card" key={i}>
          <div className="alert-icon">⚠️</div>
          <div className="alert-text">
            <b>{a.type}</b> <br />
            {a.precaution} <br />
            <span className={`severity ${a.severity}`}>
              {a.severity.toUpperCase()} – {a.daysLeft} day(s) left
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WeatherAlerts;
