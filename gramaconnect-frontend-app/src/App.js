// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Shared components
import Navigation from "./components/Navigation";
import Layout from "./components/shared/Layout.jsx";

// Pages
import Dashboard from "./pages/Dashboard.jsx";
import ComplaintForm from "./pages/ComplaintForm.jsx";
import BuildingPermit from "./pages/BuildingPermit.jsx";
import WasteManagement from "./pages/WasteManagement.jsx";
import JobPortal from "./pages/JobPortal.jsx";
import WeatherAlerts from "./pages/WeatherAlerts.jsx";
import CertificateApplication from "./pages/CertificateApplication.jsx";
import StatusTracker from "./pages/StatusTracker.jsx";

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/complaints" element={<ComplaintForm />} />
            <Route path="/building-permit" element={<BuildingPermit />} />
            <Route path="/waste-management" element={<WasteManagement />} />
            <Route path="/job-portal" element={<JobPortal />} />
            <Route path="/weather-alerts" element={<WeatherAlerts />} />
            <Route path="/certificates" element={<CertificateApplication />} />
            <Route path="/status-tracker" element={<StatusTracker />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
