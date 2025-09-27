import React, { useState } from "react";
import api from "../api";
import "./JobPortal.css";

export default function Register({ onLogin }) {
  const [form, setForm] = useState({
    name: "", phone: "", password: "", role: "seeker", ward: "", skills: ""
  });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, skills: form.skills ? form.skills.split(",").map(s=>s.trim()) : [] };
      const { data } = await api.post("/auth/register", payload);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin?.(data.user);
    } catch {
      alert("Register failed");
    }
  };

  return (
    <div className="card auth">
      <h2>Create Account</h2>
      <form onSubmit={submit} className="form">
        <input placeholder="Full Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
        <input placeholder="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} />
        <input type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
        <select value={form.role} onChange={(e)=>setForm({...form,role:e.target.value})}>
          <option value="seeker">Job Seeker</option>
          <option value="employer">Employer</option>
        </select>
        <input placeholder="Ward (optional)" value={form.ward} onChange={e=>setForm({...form,ward:e.target.value})} />
        <input placeholder="Skills: tailoring, catering..." value={form.skills} onChange={e=>setForm({...form,skills:e.target.value})} />
        <button className="btn primary">Register</button>
      </form>
    </div>
  );
}
