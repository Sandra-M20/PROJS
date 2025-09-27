import React, { useState } from "react";
import axios from "axios";
import "./PermitTracker.css";

export default function PermitTracker(){
  const [email, setEmail] = useState("");
  const [data, setData] = useState([]);

  const search = async () => {
    const res = await axios.get(`http://localhost:5000/api/permits/my?email=${email}`);
    setData(res.data);
  };

  return (
    <div className="tracker-page">
      <h2>My Building Permits</h2>
      <div className="search">
        <input placeholder="Enter your email" value={email} onChange={e=>setEmail(e.target.value)} />
        <button onClick={search}>Search</button>
      </div>

      {data.map(p => (
        <div className="card" key={p._id}>
          <div className="row">
            <div><b>Owner:</b> {p.owner}</div>
            <div><b>Status:</b> {p.status}</div>
          </div>
          <div className="steps">
            {["Pending","Reviewed","Approved","Rejected"].map(s=>(
              <div key={s} className={`step ${p.status===s ? "active": ""}`}>{s}</div>
            ))}
          </div>
          <details>
            <summary>Timeline</summary>
            <ul>
              {p.timeline?.map((t,i)=>(
                <li key={i}>{t.status} — {new Date(t.at).toLocaleString()} {t.note?`(Note: ${t.note})`:""}</li>
              ))}
            </ul>
          </details>
        </div>
      ))}
    </div>
  )
}
