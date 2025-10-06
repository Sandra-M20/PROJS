// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../utils/api";
import AdminLayout from "./AdminLayout";

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    api
      .get("/admin/summary", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setSummary(res.data))
      .catch(() => alert("Failed to load summary"));
  }, []);

  return (
    <AdminLayout>
      <h2>Admin Dashboard</h2>
      {summary ? (
        <div className="stats-grid">
          <div className="stat-box">🧾 Complaints: {summary.complaints}</div>
          <div className="stat-box">🏗 Permits: {summary.permits}</div>
          <div className="stat-box">💼 Jobs: {summary.jobs}</div>
          <div className="stat-box">👥 Users: {summary.users}</div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </AdminLayout>
  );
}
