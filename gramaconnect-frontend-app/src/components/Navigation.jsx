// src/components/shared/Navigation.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Navigation.css";

const Navigation = () => {
  return (
    <nav className="navbar">
      <h2 className="logo">GramaConnect</h2>
      <ul className="nav-links">
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/complaints">Complaints</Link></li>
        <li><Link to="/building-permit">Building Permits</Link></li>
        <li><Link to="/waste-management">Waste Mgmt</Link></li>
        <li><Link to="/job-portal">Job Portal</Link></li>
        <li><Link to="/weather-alerts">Weather</Link></li>
        <li><Link to="/certificates">Certificates</Link></li>
        <li><Link to="/status-tracker">Status</Link></li>
      </ul>
    </nav>
  );
};

export default Navigation;
