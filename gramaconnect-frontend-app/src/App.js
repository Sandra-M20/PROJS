import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Layout from "./components/shared/Layout";

// Import all pages
import Dashboard from "./pages/Dashboard";
import ComplaintForm from "./pages/ComplaintForm";
import BuildingPermit from "./pages/BuildingPermit";
import WasteManagement from "./pages/WasteManagement";
import JobPortal from "./pages/JobPortal";
import WeatherAlerts from "./pages/WeatherAlerts";
import CertificateApplication from "./pages/CertificateApplication";
import StatusTracker from "./pages/StatusTracker";

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;
