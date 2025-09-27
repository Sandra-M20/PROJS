import React, { useState } from "react";
import api from "../api";
import "./JobPortal.css";

export default function Login({ onLogin }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", { phone, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin?.(data.user);
    } catch (e) {
      alert("Login failed");
    }
  };

  return (
    <div className="card auth">
      <h2>Login</h2>
      <form onSubmit={submit} className="form">
        <input placeholder="Phone" value={phone} onChange={(e)=>setPhone(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button className="btn primary">Login</button>
      </form>
    </div>
  );
}
