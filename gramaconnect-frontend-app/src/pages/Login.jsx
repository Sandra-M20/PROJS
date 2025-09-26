// src/pages/Login.jsx
import React, { useState } from "react";
import axios from "axios";

export default function Login({ onLogin }) {
  const [email,setEmail] = useState(""), [pass,setPass]=useState("");
  const submit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password: pass });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      onLogin(user);
    } catch (err) {
      alert("Login failed");
    }
  };
  return (
    <div style={{maxWidth:420, margin:"40px auto"}}>
      <h2>Admin Login</h2>
      <form onSubmit={submit}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input placeholder="Password" type="password" value={pass} onChange={e=>setPass(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
