import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import "./JobPortal.css";

export default function JobPortal() {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // fetch all jobs
  const loadJobs = async (q = "") => {
    try {
      setLoading(true);
      const { data } = await api.get(`/jobs?q=${q}`);
      setJobs(data);
    } catch (err) {
      console.error("Failed to load jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadJobs(query);
  };

  return (
    <div className="job-portal">
      <h2>💼 Kudumbashree Job Portal</h2>
      <p>Find or post local job opportunities in your Panchayat.</p>

      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, company, or skill..."
        />
        <button className="btn">Search</button>
      </form>

      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p>No jobs available yet.</p>
      ) : (
        <div className="job-grid">
          {jobs.map((job) => (
            <div key={job._id} className="job-card" onClick={() => navigate(`/jobs/${job._id}`)}>
              {job.logoUrl && <img src={`http://localhost:5000${job.logoUrl}`} alt="logo" className="job-logo" />}
              <h3>{job.title}</h3>
              <p><b>Company:</b> {job.company || "N/A"}</p>
              <p><b>Category:</b> {job.category || "General"}</p>
              <p><b>Ward:</b> {job.ward}</p>
              <p className="muted">{job.description?.slice(0, 80)}...</p>
              <p className="salary">💰 {job.pay ? `₹${job.pay}` : "Negotiable"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
