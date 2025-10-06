import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Layout from "./components/shared/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

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
import AdminDashboard from "./pages/AdminDashboard";
import CitizenDashboard from "./pages/CitizenDashboard";
import OfficerDashboard from "./pages/OfficerDashboard";

function App() {
  return (
    <Router>
      <Navigation />
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/*  Citizen Services */}
          <Route path="/complaints" element={<ComplaintForm />} />
          <Route path="/building-permit" element={<BuildingPermit />} />
          <Route path="/waste-management" element={<WasteManagement />} />
          <Route path="/weather-alerts" element={<WeatherAlerts />} />
          <Route path="/permit-tracker" element={<PermitTracker />} />
          <Route path="/status-tracker" element={<StatusTracker />} />
          <Route path="/weather" element={<WeatherDashboard />} />

          {/* 💼 Job Portal */}
          <Route path="/jobs" element={<JobPortal />} />
          <Route path="/jobs/post" element={<PostJob />} />
          <Route path="/jobs/manage" element={<EmployerDashboard />} />
          <Route path="/jobs/my-applications" element={<MyApplications />} />
          <Route path="/jobs/:id" element={<JobDetails />} />

          {/* 🔐 Protected Dashboards (Role-Based Access) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/officer"
            element={
              <ProtectedRoute allowedRoles={["officer", "admin"]}>
                <OfficerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/citizen"
            element={
              <ProtectedRoute allowedRoles={["citizen", "admin"]}>
                <CitizenDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
