// src/pages/OfficerDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../utils/api";
import AdminLayout from "./AdminLayout";

export default function OfficerDashboard() {
  const [permits, setPermits] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    api
      .get("/admin/officer-data", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setPermits(res.data))
      .catch(() => alert("Failed to load officer data"));
  }, []);

  return (
    <AdminLayout>
      <h2>Officer Dashboard</h2>
      {permits.length ? (
        <div className="permit-list">
          {permits.map((p) => (
            <div key={p._id} className="permit-card">
              <h3>{p.applicantName}</h3>
              <p>Status: {p.status}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No pending permits.</p>
      )}
    </AdminLayout>
  );
}
