import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const services = [
    { name: "Complaints", path: "/complaints", icon: "📢" },
    { name: "Building Permit", path: "/building-permit", icon: "🏠" },
    { name: "Waste Management", path: "/waste-management", icon: "♻" },
    { name: "Job Portal", path: "/job-portal", icon: "💼" },
    { name: "Weather Alerts", path: "/weather-alerts", icon: "🌦" },
    { name: "Certificates", path: "/certificates", icon: "📜" },
    { name: "Status Tracker", path: "/status-tracker", icon: "📊" },
  ];

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <p>Select a service to continue:</p>
      <div className="services-grid">
        {services.map((s, i) => (
          <Link key={i} to={s.path} className="service-card">
            <span className="icon">{s.icon}</span>
            <h3>{s.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
