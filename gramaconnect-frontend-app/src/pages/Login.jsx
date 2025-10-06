import React, { useState } from "react";
import api from "../utils/api";
import "./JobPortal.css"; // or create a separate Auth.css for login styles

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { phone, password });

      // Save token and user info in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect user based on role
      const role = data.user.role;
      if (role === "admin") window.location.href = "/admin";
      else if (role === "officer") window.location.href = "/officer";
      else window.location.href = "/citizen";
    } catch (err) {
      console.error(err);
      alert("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card auth">
      <h2>🔐 Login</h2>
      <form onSubmit={submit} className="form">
        <input
          placeholder="📞 Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="🔑 Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn primary" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="muted" style={{ marginTop: "10px" }}>
        New user? <a href="/register">Register here</a>
      </p>
    </div>
  );
}
