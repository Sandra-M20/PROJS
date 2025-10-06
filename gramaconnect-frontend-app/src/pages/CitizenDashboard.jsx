import React from "react";
import { useNavigate } from "react-router-dom";
import "./JobPortal.css"; // Reuse same blue-white theme

export default function CitizenDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const cards = [
    {
      title: "📢 Complaints & Issues",
      desc: "Report potholes, flooding, or service issues directly to your Panchayat.",
      path: "/complaints",
    },
    {
      title: "🏗 Building Permits",
      desc: "Track or apply for building permits and approvals.",
      path: "/permits",
    },
    {
      title: "💼 Kudumbashree Job Portal",
      desc: "Find local jobs and livelihood opportunities through Kudumbashree networks.",
      path: "/jobs",
    },
    {
      title: "🌦 Weather & Alerts",
      desc: "Check local weather updates and disaster alerts instantly.",
      path: "/weather",
    },
    {
      title: "💰 Revenue & Certificates",
      desc: "Pay land tax, and request income or residence certificates.",
      path: "/revenue",
    },
  ];

  return (
    <div className="card" style={{ background: "#fff", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
      <h2 style={{ color: "#0b5ed7" }}>
        Welcome {user.name || "Citizen"}!
      </h2>
      <p style={{ color: "#555", marginBottom: "20px" }}>
        Manage all your Panchayat-level services from one place.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "16px",
        }}
      >
        {cards.map((card, i) => (
          <div
            key={i}
            className="job"
            style={{
              border: "1px solid #d6e4ff",
              borderRadius: "10px",
              padding: "16px",
              background: "#f9fbff",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
            }}
            onClick={() => navigate(card.path)}
          >
            <h3 style={{ color: "#0b5ed7" }}>{card.title}</h3>
            <p style={{ color: "#333", marginTop: "8px" }}>{card.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <button
          onClick={() => navigate("/profile")}
          className="btn primary"
          style={{
            background: "#0b5ed7",
            color: "#fff",
            padding: "10px 18px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
          }}
        >
          👤 View Profile
        </button>
      </div>
    </div>
  );
}
