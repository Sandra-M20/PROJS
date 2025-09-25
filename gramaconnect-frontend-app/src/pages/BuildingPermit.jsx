import React, { useState } from "react";
import "./BuildingPermit.css";

const BuildingPermit = () => {
  const [form, setForm] = useState({ owner: "", planFile: null, plotLocation: "" });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Building permit request submitted ✅\nOfficer will review your plan.");
  };

  return (
    <div className="building-container">
      <h2>🏠 Building Permit Application</h2>
      <form onSubmit={handleSubmit}>
        <label>Owner Name:</label>
        <input type="text" name="owner" onChange={handleChange} required />

        <label>Upload Plan (PDF/Image):</label>
        <input type="file" name="planFile" accept=".pdf,.jpg,.png" onChange={handleChange} required />

        <label>Plot Location (Survey No / Map Link):</label>
        <input type="text" name="plotLocation" onChange={handleChange} required />

        <button type="submit">Submit Application</button>
      </form>
    </div>
  );
};

export default BuildingPermit;
