// src/pages/BuildingPermit.jsx
import React, { useState } from "react";
import axios from "axios";
import "./BuildingPermit.css";

const BuildingPermit = () => {
  const [form, setForm] = useState({
    owner: "",
    plotLocation: "",
    planFile: null,
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.owner || !form.plotLocation || !form.planFile) {
      setMessage("Please fill all fields before submitting.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("owner", form.owner);
    formData.append("plotLocation", form.plotLocation);
    formData.append("planFile", form.planFile);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/permits/apply",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setMessage(res.data.message || "Application submitted successfully!");
      setForm({ owner: "", plotLocation: "", planFile: null });
    } catch (err) {
      console.error(err);
      setMessage(" Error submitting application. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="building-container">
      <h2>🏗️ Building Permit Application</h2>
      <form onSubmit={handleSubmit}>
        <label>Owner Name *</label>
        <input
          type="text"
          name="owner"
          value={form.owner}
          onChange={handleChange}
          placeholder="Enter owner name"
          required
        />

        <label>Upload Building Plan (PDF/Image) *</label>
        <input
          type="file"
          name="planFile"
          accept=".pdf,.jpg,.png"
          onChange={handleChange}
          required
        />

        <label>Plot Location (Survey No / Map Link) *</label>
        <input
          type="text"
          name="plotLocation"
          value={form.plotLocation}
          onChange={handleChange}
          placeholder="e.g., Survey No. 23/7, Ward 4"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default BuildingPermit;
