// src/pages/ComplaintList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ComplaintList.css";

export default function ComplaintList(){
  const [list, setList] = useState([]);
  useEffect(()=>{ axios.get("http://localhost:5000/api/complaints").then(r=>setList(r.data)); }, []);
  const sendFeedback = async (id, rating, comment) => {
    await axios.post(`http://localhost:5000/api/complaints/${id}/feedback`, { rating, comment });
    alert("Thanks for feedback!");
  };
  return (
    <div className="complaint-list">
      <h2> My Complaints</h2>
      {list.map(c => (
        <div key={c._id} className="complaint-card">
          <div className="card-head">
            <h3>{c.title}</h3>
            <span className={`badge ${c.priority.toLowerCase()}`}>{c.priority}</span>
            <span className={`status ${c.status.replace(/\s+/g,'').toLowerCase()}`}>{c.status}</span>
          </div>
          <p className="muted">{c.category} • {new Date(c.createdAt).toLocaleString()}</p>
          <p>{c.description}</p>
          {c.photos && c.photos.length>0 && <div className="thumbs">{c.photos.map((p,i)=> <img key={i} src={`http://localhost:5000/${p}`} alt="p" />)}</div>}
          <div className="timeline">
            {c.timeline && c.timeline.map((t,i)=> <div key={i} className="timeline-item"><b>{t.step}</b><div className="t-note">{t.note}{t.by?` • ${t.by}`:""}</div><div className="t-time">{new Date(t.at).toLocaleString()}</div></div>)}
          </div>

          {c.status === "Resolved" && !c.feedback && (
            <div className="feedback-box">
              <p>Rate resolution:</p>
              <button onClick={()=>sendFeedback(c._id,5,"Great job")}>5 ★</button>
              <button onClick={()=>sendFeedback(c._id,4,"Good")}>4 ★</button>
              <button onClick={()=>sendFeedback(c._id,3,"Okay")}>3 ★</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
