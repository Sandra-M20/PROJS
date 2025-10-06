// src/pages/ComplaintForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap
} from "react-leaflet";
import L from "leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import "./ComplaintForm.css";

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

//  Component for picking location
function LocationPicker({ setLocation }) {
  const [pos, setPos] = useState(null);

  useMapEvents({
    click(e) {
      setPos(e.latlng);
      setLocation(e.latlng);
    },
  });

  return pos ? <Marker position={pos} /> : null;
}

//  Search bar for location
function SearchField({ setLocation }) {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      showMarker: true,
      showPopup: true,
      autoClose: true,
      retainZoomLevel: false,
      searchLabel: "Enter address or place",
    });

    map.addControl(searchControl);

    // When a location is selected from search
    map.on("geosearch/showlocation", (result) => {
      const { x, y } = result.location;
      setLocation({ lat: y, lng: x });
    });

    return () => map.removeControl(searchControl);
  }, [map, setLocation]);

  return null;
}

//  Fix map resize
function ResizeHandler() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 200);
  }, [map]);
  return null;
}

export default function ComplaintForm() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("Low");
  const [photos, setPhotos] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  const onFiles = (e) => setPhotos(Array.from(e.target.files));

  const submit = async (e) => {
    e.preventDefault();
    if (!title || !category || !location)
      return alert("⚠️ Title, category, and location are required.");
    setLoading(true);

    const fd = new FormData();
    fd.append("title", title);
    fd.append("category", category);
    fd.append("description", desc);
    fd.append("priority", priority);
    fd.append("location", JSON.stringify(location));
    photos.forEach((p) => fd.append("photos", p));

    try {
      await axios.post("http://localhost:5000/api/complaints", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(" Complaint submitted successfully!");
      setTitle("");
      setCategory("");
      setDesc("");
      setPriority("Low");
      setPhotos([]);
      setLocation(null);
    } catch (err) {
      console.error(err);
      alert(" Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="complaint-form-card">
      <h2> Public Grievance Form</h2>
      <form onSubmit={submit}>
        {/* Title */}
        <label>Complaint Title *</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />

        {/* Category */}
        <label>Category *</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">-- choose --</option>
          <option value="road">Road</option>
          <option value="waste">Waste</option>
          <option value="water">Water Supply</option>
          <option value="electricity">Electricity</option>
          <option value="other">Other</option>
        </select>

        {/* Description */}
        <label>Description</label>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Describe the issue briefly"
        />

        {/* Priority */}
        <label>Priority</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        {/* Photos */}
        <label>Attach Photos / Videos</label>
        <input type="file" accept="image/*,video/*" multiple onChange={onFiles} />
        <div className="preview-row">
          {photos.map((p, idx) => (
            <img key={idx} src={URL.createObjectURL(p)} alt="preview" className="thumb" />
          ))}
        </div>

        {/* Map with search */}
        <label>Pick Location *</label>
        <div className="mapbox">
          <MapContainer center={[10.8505, 76.2711]} zoom={10} className="mapbox">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <ResizeHandler />
            <SearchField setLocation={setLocation} />
            <LocationPicker setLocation={setLocation} />
          </MapContainer>
        </div>

        {/*  Show selected coordinates */}
        {location && (
          <div className="coords-box">
            <p><b>📍 Selected Coordinates:</b></p>
            <p>Latitude: <span>{location.lat.toFixed(6)}</span></p>
            <p>Longitude: <span>{location.lng.toFixed(6)}</span></p>
          </div>
        )}

        {/* Submit */}
        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>
    </div>
  );
}
