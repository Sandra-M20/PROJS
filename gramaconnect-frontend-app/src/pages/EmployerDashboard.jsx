import React, { useEffect, useState } from "react";
import api from "../utils/api";
import "./JobPortal.css";

export default function EmployerDashboard() {
  const [data, setData] = useState({ jobs: [], apps: [] });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Always call hooks before any returns
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    setUser(storedUser);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user && ["employer", "officer"].includes(user.role)) {
      load();
    }
  }, [user]);

  const load = async () => {
    try {
      const { data } = await api.get("/jobs/employer/manage");
      setData(data);
    } catch (err) {
      console.error(err);
    }
  };

  const update = async (id, status) => {
    await api.patch(`/jobs/applications/${id}`, { status });
    load();
  };

  // ✅ Handle early return AFTER hooks are declared
  if (loading) return <p>Loading...</p>;
  if (!user || !["employer", "officer"].includes(user.role)) 
    return <p>Only employers/officers can access this.</p>;

  return (
    <div className="card">
      <h2>Employer Dashboard</h2>

      <h3>Your Jobs</h3>
      <ul>
        {data.jobs.map(j => (
          <li key={j._id}>{j.title} — {j.isOpen ? "Open" : "Closed"}</li>
        ))}
      </ul>

      <h3>Applications</h3>
      <div className="list">
        {data.apps.map(a => (
          <div className="job" key={a._id}>
            <h3>{a.job?.title}</h3>
            <p className="muted">
              {a.seeker?.name} ({a.seeker?.phone}) • {a.status}
            </p>
            <div className="row">
              <button className="btn" onClick={() => update(a._id, "Shortlisted")}>Shortlist</button>
              <button className="btn" onClick={() => update(a._id, "Selected")}>Select</button>
              <button className="btn" onClick={() => update(a._id, "Rejected")}>Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
