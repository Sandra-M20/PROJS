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
import StatusTracker from "./pages/StatusTracker";
import PermitTracker from "./pages/PermitTracker";
import WeatherDashboard from "./pages/WeatherDashboard";
import Register from "./pages/Register";
import JobDetails from "./pages/JobDetails";
import EmployerDashboard from "./pages/EmployerDashboard";
import PostJob from "./pages/PostJob";
import MyApplications from "./pages/MyApplications";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <Navigation />
      <Layout>
        <Routes>
          <Route path="/jobs" element={<JobPortal/>}/>
        <Route path="/jobs/post" element={<PostJob/>}/>
        <Route path="/jobs/manage" element={<EmployerDashboard/>}/>
        <Route path="/jobs/my-applications" element={<MyApplications/>}/>
        <Route path="/jobs/:id" element={<JobDetails/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
          <Route path="/" element={<Dashboard />} />
          <Route path="/complaints" element={<ComplaintForm />} />
          <Route path="/building-permit" element={<BuildingPermit />} />
          <Route path="/waste-management" element={<WasteManagement />} />
          <Route path="/job-portal" element={<JobPortal />} />
          <Route path="/weather-alerts" element={<WeatherAlerts />} />
          <Route path="/permit-tracker" element={<PermitTracker />} />
          <Route path="/status-tracker" element={<StatusTracker />} />
          <Route path="/weather" element={<WeatherDashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
