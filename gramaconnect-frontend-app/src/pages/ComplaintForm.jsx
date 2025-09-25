import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./ComplaintForm.css";

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Component to pick location on map
function LocationPicker({ setLocation }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setLocation(e.latlng);
    },
  });

  return position ? <Marker position={position}></Marker> : null;
}

export default function ComplaintForm() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Complaint Submitted:", {
      title,
      category,
      description,
      photo,
      location,
    });
    alert("Complaint Submitted Successfully ✅");
  };

  return (
    <div className="complaint-form-container">
      <h2>Public Grievance Form</h2>
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <label>
          Complaint Title <span className="required">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter complaint title"
          required
        />

        {/* Category */}
        <label>
          Category <span className="required">*</span>
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">-- Select --</option>
          <option value="road">Road Issue</option>
          <option value="waste">Waste Management</option>
          <option value="water">Water Supply</option>
          <option value="electricity">Electricity</option>
          <option value="other">Other</option>
        </select>

        {/* Description (Optional) */}
        <label>Description (Optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the issue (optional)"
        />

        {/* Photo Upload */}
        <label>Attach Photo</label>
        <input type="file" accept="image/*" capture="environment" onChange={handlePhotoChange} />

        {/* Map Location */}
        <label>
          Select Location <span className="required">*</span>
        </label>
        <p>Click on the map to drop a pin at the incident location.</p>

        <MapContainer
          center={[10.8505, 76.2711]} // Kerala default center
          zoom={10}
          style={{ height: "300px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <LocationPicker setLocation={setLocation} />
        </MapContainer>

        {location && (
          <p className="preview-text">
            📍 Selected Location: {location.lat.toFixed(4)},{" "}
            {location.lng.toFixed(4)}
          </p>
        )}

        {/* Submit Button */}
        <button type="submit" className="submit-btn">
          Submit Complaint
        </button>
      </form>
    </div>
  );
}
