// src/pages/WasteManagement.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import {
  MapContainer, TileLayer, Marker, Popup, useMapEvents
} from "react-leaflet";
import L from "leaflet";
import { format } from "date-fns";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import "./WasteManagement.css";

// Leaflet marker fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Pick a location on map
function LocationPicker({ onPick }) {
  useMapEvents({
    click(e) { onPick(e.latlng); }
  });
  return null;
}

const API = "http://localhost:5000/api/waste";
const SOCK = io("http://localhost:5000/waste", { transports: ["websocket"] });

export default function WasteManagement() {
  const [tab, setTab] = useState("schedule"); // schedule | overflow | live | my | calendar | analytics
  return (
    <div className="wm-wrap">
      <h2 className="wm-title">♻ Smart Waste Management</h2>

      <div className="wm-tabs">
        <button className={tab==="schedule"?"active":""} onClick={()=>setTab("schedule")}>Schedule Pickup</button>
        <button className={tab==="overflow"?"active":""} onClick={()=>setTab("overflow")}>Report Overflow</button>
        <button className={tab==="live"?"active":""} onClick={()=>setTab("live")}>Live Tracker</button>
        <button className={tab==="my"?"active":""} onClick={()=>setTab("my")}>My Requests</button>
        <button className={tab==="calendar"?"active":""} onClick={()=>setTab("calendar")}>Ward Calendar</button>
        <button className={tab==="analytics"?"active":""} onClick={()=>setTab("analytics")}>Analytics</button>
      </div>

      {tab==="schedule" && <ScheduleForm />}
      {tab==="overflow" && <OverflowReport />}
      {tab==="live" && <LiveTracker />}
      {tab==="my" && <MyRequests />}
      {tab==="calendar" && <WardCalendar />}
      {tab==="analytics" && <AnalyticsPanel />}
    </div>
  );
}

function ScheduleForm() {
  const [form, setForm] = useState({
    name: "", phone: "", address: "", ward: "",
    wasteType: "Plastic", preferredDate: "", timeSlot: "Morning", notes: ""
  });
  const [photos, setPhotos] = useState([]);
  const [location, setLocation] = useState(null);
  const [ok, setOk] = useState("");

  const onChange = (e) => {
    const { name, value, files } = e.target;
    if (files) setPhotos(Array.from(files));
    else setForm({ ...form, [name]: value });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address || !form.ward || !form.preferredDate || !location) {
      return alert("Please fill all required fields and choose a location.");
    }
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append("location", JSON.stringify(location));
    photos.forEach(p => fd.append("photos", p));

    try {
      const res = await axios.post(`${API}/pickups`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setOk("✅ Pickup scheduled. Ref#: " + res.data.data._id);
      setForm({ name:"", phone:"", address:"", ward:"", wasteType:"Plastic", preferredDate:"", timeSlot:"Morning", notes:"" });
      setPhotos([]); setLocation(null);
    } catch (e2) {
      console.error(e2); setOk("❌ Failed to schedule");
    }
  };

  return (
    <div className="wm-card">
      <h3>Schedule Household Pickup</h3>
      <form onSubmit={submit} className="wm-form">
        <div className="grid2">
          <div>
            <label>Name *</label>
            <input name="name" value={form.name} onChange={onChange} required />
          </div>
          <div>
            <label>Phone *</label>
            <input name="phone" value={form.phone} onChange={onChange} required />
          </div>
        </div>

        <label>Address *</label>
        <input name="address" value={form.address} onChange={onChange} required />

        <div className="grid3">
          <div>
            <label>Ward *</label>
            <input name="ward" value={form.ward} onChange={onChange} placeholder="e.g., 10" required />
          </div>
          <div>
            <label>Waste Type *</label>
            <select name="wasteType" value={form.wasteType} onChange={onChange}>
              <option>Plastic</option>
              <option>Organic</option>
              <option>E-Waste</option>
              <option>Mixed</option>
            </select>
          </div>
          <div>
            <label>Preferred Date *</label>
            <input type="date" name="preferredDate" value={form.preferredDate} onChange={onChange} required />
          </div>
        </div>

        <div className="grid2">
          <div>
            <label>Time Slot</label>
            <select name="timeSlot" value={form.timeSlot} onChange={onChange}>
              <option>Morning</option>
              <option>Afternoon</option>
              <option>Evening</option>
            </select>
          </div>
          <div>
            <label>Notes</label>
            <input name="notes" value={form.notes} onChange={onChange} placeholder="Landmark, instructions..." />
          </div>
        </div>

        <label>Attach Photos (optional)</label>
        <input type="file" multiple accept="image/*" onChange={onChange} />
        <div className="thumb-row">{photos.map((p, i)=>(<img key={i} className="thumb" src={URL.createObjectURL(p)} alt="prev"/>))}</div>

        <label>Choose Location *</label>
        <div className="leaflet-box">
          <MapContainer center={[10.997, 76.30]} zoom={13} className="leaflet-box">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationPicker onPick={setLocation} />
            {location && <Marker position={[location.lat, location.lng]}><Popup>Selected</Popup></Marker>}
          </MapContainer>
        </div>
        {location && <p className="small">📍 {location.lat.toFixed(5)}, {location.lng.toFixed(5)}</p>}

        <button className="btn primary">Submit Request</button>
        {ok && <p className="ok">{ok}</p>}
      </form>
    </div>
  );
}

function OverflowReport() {
  const [ward, setWard] = useState("");
  const [type, setType] = useState("Mixed");
  const [location, setLocation] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!ward || !location) return alert("Ward and location required");
    const fd = new FormData();
    fd.append("ward", ward);
    fd.append("type", type);
    fd.append("location", JSON.stringify(location));
    photos.forEach(p => fd.append("photos", p));
    try {
      await axios.post(`${API}/overflow`, fd, { headers: { "Content-Type":"multipart/form-data" }});
      setMsg("✅ Overflow reported to HKS & Panchayat.");
      setWard(""); setLocation(null); setPhotos([]);
    } catch {
      setMsg("❌ Failed to report");
    }
  };

  return (
    <div className="wm-card">
      <h3>Report Public Bin Overflow</h3>
      <form onSubmit={submit} className="wm-form">
        <div className="grid3">
          <div>
            <label>Ward *</label>
            <input value={ward} onChange={(e)=>setWard(e.target.value)} required />
          </div>
          <div>
            <label>Bin Type</label>
            <select value={type} onChange={(e)=>setType(e.target.value)}>
              <option>Mixed</option><option>Plastic</option><option>Organic</option>
            </select>
          </div>
          <div>
            <label>Photos</label>
            <input type="file" multiple accept="image/*" onChange={(e)=>setPhotos(Array.from(e.target.files))} />
          </div>
        </div>

        <label>Choose Bin Location *</label>
        <div className="leaflet-box">
          <MapContainer center={[10.997, 76.30]} zoom={13} className="leaflet-box">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationPicker onPick={setLocation} />
            {location && <Marker position={[location.lat, location.lng]} />}
          </MapContainer>
        </div>
        {location && <p className="small">📍 {location.lat.toFixed(5)}, {location.lng.toFixed(5)}</p>}

        <button className="btn warn">Report Overflow</button>
        {msg && <p className="ok">{msg}</p>}
      </form>
    </div>
  );
}

function LiveTracker() {
  const [vehicle, setVehicle] = useState(null);
  const [bins, setBins] = useState([]);

  useEffect(() => {
    const h = (data) => setVehicle(data);
    SOCK.on("vehicle:location", h);
    axios.get(`${API}/bins`).then(r=>setBins(r.data)).catch(()=>{});
    return () => {
      SOCK.off("vehicle:location", h);
    };
  }, []);

  const colorForLevel = (lvl) => {
    if (lvl >= 85) return "red"; if (lvl >= 50) return "orange"; return "green";
  };

  return (
    <div className="wm-card">
      <h3>Live Collection Map</h3>
      <div className="leaflet-box tall">
        <MapContainer center={[10.997, 76.30]} zoom={13} className="leaflet-box">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {vehicle && (
            <Marker position={[vehicle.lat, vehicle.lng]}>
              <Popup>Vehicle #{vehicle.id}<br/>Last: {format(new Date(vehicle.updatedAt), "hh:mm a")}</Popup>
            </Marker>
          )}
          {bins.map((b)=>(
            <Marker key={b._id} position={[b.location.lat, b.location.lng]}
              icon={new L.Icon.Default({ className: `marker-${colorForLevel(b.fillLevel)}`})}>
              <Popup>
                Ward {b.ward} ({b.type})<br/>Fill: {b.fillLevel}%<br/>Status: {b.status}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div className="legend">
        <span><i className="dot green"></i>Low</span>
        <span><i className="dot orange"></i>Medium</span>
        <span><i className="dot red"></i>High/Overflow</span>
      </div>
    </div>
  );
}

function MyRequests() {
  const [phone, setPhone] = useState("");
  const [items, setItems] = useState([]);

  const fetchIt = async () => {
    if (!phone) return;
    const r = await axios.get(`${API}/pickups?phone=${phone}`);
    setItems(r.data);
  };

  return (
    <div className="wm-card">
      <h3>My Pickup Requests</h3>
      <div className="grid2">
        <input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="Enter phone used while booking" />
        <button className="btn" onClick={fetchIt}>Search</button>
      </div>

      <div className="list">
        {items.map((i)=>(
          <div key={i._id} className="list-item">
            <div>
              <b>{i.wasteType}</b> • {format(new Date(i.preferredDate), "dd MMM")} ({i.timeSlot})<br/>
              <span className="muted">{i.address} • Ward {i.ward}</span>
            </div>
            <span className={`badge ${i.status.toLowerCase()}`}>{i.status}</span>
          </div>
        ))}
        {!items.length && <p className="muted small">No requests yet. Try searching by your phone.</p>}
      </div>
    </div>
  );
}

function WardCalendar() {
  const [ward, setWard] = useState("1");
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get(`${API}/calendar?ward=${ward}`).then(r=>setData(r.data)).catch(()=>{});
  }, [ward]);

  return (
    <div className="wm-card">
      <h3>Ward Calendar</h3>
      <div className="grid2">
        <div>
          <label>Ward</label>
          <input value={ward} onChange={(e)=>setWard(e.target.value)} />
        </div>
        <div className="muted">Shows weekly waste type schedule</div>
      </div>

      <div className="calendar">
        {data?.weekly?.map((d)=>(
          <div key={d.day} className="cal-item">
            <div className="cal-day">{d.day}</div>
            <div className="cal-types">{d.types.length ? d.types.join(", ") : "—"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsPanel() {
  const [stat, setStat] = useState(null);

  useEffect(() => {
    axios.get(`${API}/analytics`).then(r=>setStat(r.data));
  }, []);

  const COLORS = ["#007bff", "#00c49f", "#ff7300", "#ff4d4f", "#8884d8"];

  const statusData = useMemo(()=> (stat?.byStatus || []).map(s=>({ name: s._id, value: s.count })), [stat]);
  const typeData   = useMemo(()=> (stat?.byType || []).map(s=>({ name: s._id, value: s.count })), [stat]);

  return (
    <div className="wm-card">
      <h3>Analytics</h3>
      {!stat ? <p className="muted small">Loading…</p> : (
        <div className="grid2">
          <div className="chart">
            <h4>By Status</h4>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={80} label>
                  {statusData.map((e, i)=> <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart">
            <h4>By Waste Type</h4>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={typeData} dataKey="value" nameKey="name" outerRadius={80} label>
                  {typeData.map((e, i)=> <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="export">
        <a className="btn" href="http://localhost:5000/api/waste/export.csv" target="_blank" rel="noreferrer">Export CSV</a>
      </div>
    </div>
  );
}
