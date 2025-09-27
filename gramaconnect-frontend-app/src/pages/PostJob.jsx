import React, { useState } from "react";
import api from "../api";
import "./JobPortal.css";

export default function PostJob() {
  const u = JSON.parse(localStorage.getItem("user") || "null");
  const [form, setForm] = useState({
    title: "", description: "", category: "Other", type: "Home-based", ward: "", address: "", pay: "", company: "", skills: ""
  });
  const [logo, setLogo] = useState(null);

  if (!u) return <p>Please login</p>;
  if (!["employer","officer"].includes(u.role)) return <p>Only employers/officers can post jobs.</p>;

  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.keys(form).forEach(k=>fd.append(k, form[k]));
    if (logo) fd.append("logo", logo);
    try {
      await api.post("/jobs", fd, { headers: { "Content-Type": "multipart/form-data" } });
      alert("Job posted ✅");
    } catch {
      alert("Failed to post");
    }
  };

  return (
    <div className="card">
      <h2>Post a Job</h2>
      <form onSubmit={submit} className="form">
        <input placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
        <input placeholder="Company (optional)" value={form.company} onChange={e=>setForm({...form,company:e.target.value})} />
        <textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
        <div className="row">
          <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
            <option>Tailoring</option><option>Catering</option><option>Handicrafts</option>
            <option>Agriculture</option><option>Retail</option><option>Care</option><option>Other</option>
          </select>
          <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
            <option>Full-time</option><option>Part-time</option><option>Gig</option><option>Home-based</option>
          </select>
        </div>
        <div className="row">
          <input placeholder="Ward" value={form.ward} onChange={e=>setForm({...form,ward:e.target.value})} />
          <input placeholder="Pay (e.g. 800/day)" value={form.pay} onChange={e=>setForm({...form,pay:e.target.value})} />
        </div>
        <input placeholder="Address" value={form.address} onChange={e=>setForm({...form,address:e.target.value})} />
        <input placeholder="Skills (comma separated)" value={form.skills} onChange={e=>setForm({...form,skills:e.target.value})} />
        <label>Logo (optional)</label>
        <input type="file" onChange={(e)=>setLogo(e.target.files[0])} />
        <button className="btn primary">Save Job</button>
      </form>
    </div>
  );
}
