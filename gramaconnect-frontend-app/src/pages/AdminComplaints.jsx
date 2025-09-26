// src/pages/AdminComplaints.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "./AdminComplaints.css";

export default function AdminComplaints(){
  const [list,setList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [resolutionFiles, setResolutionFiles] = useState([]);

  useEffect(()=> load(), []);
  const load = ()=> axios.get("http://localhost:5000/api/complaints").then(r=>setList(r.data));

  const updateStatus = async (id, status, note="") => {
    const fd = new FormData();
    fd.append("status", status);
    fd.append("note", note);
    const files = resolutionFiles;
    files.forEach(f => fd.append("resolutionPhotos", f));
    await axios.put(`http://localhost:5000/api/complaints/${id}/status`, fd, { headers:{ "Content-Type":"multipart/form-data"}});
    setResolutionFiles([]);
    load();
  };

  return (
    <div className="admin-wrap">
      <h2>Admin — Complaint Management</h2>
      <div className="admin-grid">
        <div className="list-col">
          {list.map(c => (
            <div key={c._id} className="admin-card" onClick={()=>setSelected(c)}>
              <h3>{c.title}</h3>
              <p className="muted">{c.category} • {c.priority}</p>
              <p className="muted">Status: {c.status}</p>
              <div className="mini-actions">
                <button onClick={(e)=>{e.stopPropagation(); updateStatus(c._id,"In Progress","Assigned officer");}}>Assign</button>
                <button onClick={(e)=>{e.stopPropagation(); updateStatus(c._id,"Resolved","Work done");}}>Resolve</button>
              </div>
            </div>
          ))}
        </div>

        <div className="map-col">
          <MapContainer center={[10.8505,76.2711]} zoom={10} style={{height:400}}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {list.map(c => c.location && <Marker key={c._id} position={[c.location.lat, c.location.lng]}>
              <Popup><b>{c.title}</b><br/>{c.category}<br/><button onClick={()=>setSelected(c)}>Open</button></Popup>
            </Marker>)}
          </MapContainer>

          {selected && (
            <div className="detail-panel">
              <h3>{selected.title}</h3>
              <p>{selected.description}</p>
              <p><b>Priority:</b> {selected.priority} <b>•</b> <b>Status:</b> {selected.status}</p>
              <div className="resolution-upload">
                <label>Attach resolution photos</label>
                <input type="file" multiple onChange={e=>setResolutionFiles(Array.from(e.target.files))} />
                <button onClick={()=>updateStatus(selected._id,"Resolved","Resolved by admin")}>Mark Resolved (with photos)</button>
              </div>

              <div className="timeline-admin">
                {selected.timeline && selected.timeline.map((t,i)=> <div key={i}><b>{t.step}</b> — {t.note} <div className="muted">{new Date(t.at).toLocaleString()}</div></div>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
