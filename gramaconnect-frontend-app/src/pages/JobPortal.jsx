import React, { useState } from "react";
import "./JobPortal.css";

const JobPortal = () => {
  const [jobs] = useState([
    { id: 1, title: "Tailoring Assistant", type: "Kudumbashree", location: "Ward 5" },
    { id: 2, title: "Data Entry Operator", type: "General", location: "Ward 8" },
  ]);
  const [applications, setApplications] = useState([]);

  const applyJob = (job) => {
    setApplications([...applications, job]);
    alert(`Applied for ${job.title} ✅`);
  };

  return (
    <div className="job-container">
      <h2>💼 Kudumbashree Job Portal</h2>
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>
            <strong>{job.title}</strong> ({job.type}) - {job.location}
            <button onClick={() => applyJob(job)}>Apply</button>
          </li>
        ))}
      </ul>

      <h3>📌 My Applications</h3>
      <ul>
        {applications.map((job, i) => (
          <li key={i}>{job.title} – Applied</li>
        ))}
      </ul>
    </div>
  );
};

export default JobPortal;
