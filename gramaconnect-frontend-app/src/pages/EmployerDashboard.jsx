import React, { useEffect, useState } from "react";
import api from "../api";
import "./JobPortal.css";

export default function EmployerDashboard() {
  const u = JSON.parse(localStorage.getItem("user") || "null");
  const [data, setData] = useState({ jobs: [], apps: [] });

  if (!u || !["employer","officer"].includes(u.role)) return <p>Only employers/officers</p>;

  const load = async () => {
    const { data } = await api.get("/jobs/employer/manage");
    setData(data);
  };

  const update = async (id, status) => {
    await api.patch(`/jobs/applications/${id}`, { status });
    load();
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="card">
      <h2>Employer Dashboard</h2>

      <h3>Your Jobs</h3>
      <ul>
        {data.jobs.map(j => <li key={j._id}>{j.title} — {j.isOpen ? "Open" : "Closed"}</li>)}
      </ul>

      <h3>Applications</h3>
      <div className="list">
        {data.apps.map(a => (
          <div className="job" key={a._id}>
            <h3>{a.job?.title}</h3>
            <p className="muted">{a.seeker?.name} ({a.seeker?.phone}) • {a.status}</p>
            <div className="row">
              <button className="btn" onClick={()=>update(a._id,"Shortlisted")}>Shortlist</button>
              <button className="btn" onClick={()=>update(a._id,"Selected")}>Select</button>
              <button className="btn" onClick={()=>update(a._id,"Rejected")}>Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
