import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useParams } from "react-router-dom";
import "./JobPortal.css";

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [cover, setCover] = useState("");
  const [resume, setResume] = useState(null);
  const u = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => { (async () => {
    const { data } = await api.get(`/jobs/${id}`);
    setJob(data);
  })(); }, [id]);

  const apply = async (e) => {
    e.preventDefault();
    if (!u) return alert("Please login as seeker");
    const fd = new FormData();
    fd.append("coverLetter", cover);
    if (resume) fd.append("resume", resume);
    try {
      await api.post(`/jobs/${id}/apply`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      alert("Applied Successfully");
    } catch {
      alert("Apply failed");
    }
  };

  if (!job) return <p>Loading...</p>;

  return (
    <div className="card">
      <div className="head">
        {job.logoUrl && <img src={`http://localhost:5000${job.logoUrl}`} alt="logo" />}
        <div>
          <h2>{job.title}</h2>
          <p className="muted">{job.company || "Local Employer"} • {job.ward ? `Ward ${job.ward}` : "Kerala"}</p>
        </div>
      </div>
      <p>{job.description}</p>
      <div className="tags">
        <span className="badge">{job.category}</span>
        <span className="badge">{job.type}</span>
        {job.pay && <span className="badge">Pay: {job.pay}</span>}
      </div>
      <div className="chips">
        {job.skills?.map((s,i)=><span key={i} className="chip">{s}</span>)}
      </div>

      <hr/>
      <h3>Apply</h3>
      {!u ? <p>Please login to apply.</p> : (
        <form onSubmit={apply} className="form">
          <textarea placeholder="Cover letter (optional)" value={cover} onChange={e=>setCover(e.target.value)} />
          <label>Resume (PDF, optional)</label>
          <input type="file" accept="application/pdf" onChange={e=>setResume(e.target.files[0])} />
          <button className="btn primary">Submit Application</button>
        </form>
      )}
    </div>
  );
}
