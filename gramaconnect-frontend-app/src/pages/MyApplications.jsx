import React, { useEffect, useState } from "react";
import api from "../api";
import "./JobPortal.css";

export default function MyApplications() {
  const [apps, setApps] = useState([]);

  useEffect(() => { (async () => {
    const { data } = await api.get("/jobs/my/applications");
    setApps(data);
  })(); }, []);

  return (
    <div className="card">
      <h2>My Applications</h2>
      <div className="list">
        {apps.map(a => (
          <div className="job" key={a._id}>
            <h3>{a.job?.title}</h3>
            <p className="muted">{a.job?.company || "Employer"} — {a.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
