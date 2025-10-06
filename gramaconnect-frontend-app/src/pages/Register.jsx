import React, { useState } from "react";
import api from "../utils/api";
import "./Auth.css";

export default function Register() {
  const [form, setForm] = useState({ name: "", phone: "", password: "", role: "citizen" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      alert("Registered successfully! Please login.");
      window.location.href = "/login";
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="auth-card">
      <h2>📝 Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full Name" onChange={handleChange} />
        <input name="phone" placeholder="Phone Number" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="citizen">Citizen</option>
          <option value="officer">Officer</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
