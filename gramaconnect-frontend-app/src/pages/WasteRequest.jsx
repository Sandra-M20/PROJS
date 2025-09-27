import React, { useState } from "react";
import axios from "axios";
import "./WasteRequest.css";

const WasteRequest = () => {
  const [form, setForm] = useState({
    citizenName: "",
    address: "",
    wasteType: "",
    photo: null,
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));

    try {
      const res = await axios.post("http://localhost:5000/api/waste/request", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(res.data.message);
    } catch (err) {
      console.error(err);
      setMessage("Error submitting request");
    }
  };

  return (
    <div className="waste-container">
      <h2>♻️ Waste Pickup Request</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" name="citizenName" onChange={handleChange} required />

        <label>Address:</label>
        <textarea name="address" onChange={handleChange} required />

        <label>Waste Type:</label>
        <select name="wasteType" onChange={handleChange} required>
          <option value="">-- Select Type --</option>
          <option value="Biodegradable">Biodegradable</option>
          <option value="Plastic">Plastic</option>
          <option value="Medical">Medical</option>
          <option value="E-waste">E-waste</option>
        </select>

        <label>Upload Photo (optional):</label>
        <input type="file" name="photo" accept=".jpg,.png" onChange={handleChange} />

        <button type="submit">Submit Request</button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default WasteRequest;
