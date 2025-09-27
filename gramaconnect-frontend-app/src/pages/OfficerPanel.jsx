import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OfficerPanel.css";

export default function OfficerPanel(){
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token"); // from login

  const load = async () => {
    const res = await axios.get("http://localhost:5000/api/permits/all", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setData(res.data);
  };

  const setStatus = async (id, status, note="") => {
    await axios.patch(`http://localhost:5000/api/permits/${id}/status`,
      { status, note },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    load();
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="officer-page">
      <h2>Officer – Building Permits</h2>
      {data.map(p=>(
        <div className="card" key={p._id}>
          <div className="row">
            <div><b>{p.owner}</b> — {p.plotLocation}</div>
            <div>Status: <span className={`badge ${p.status.toLowerCase()}`}>{p.status}</span></div>
          </div>
          <a href={`http://localhost:5000/${p.planFile}`} target="_blank" rel="noreferrer">View Plan</a>
          <div className="actions">
            <button onClick={()=>setStatus(p._id,"Reviewed","Plan reviewed")}>Mark Reviewed</button>
            <button className="ok" onClick={()=>setStatus(p._id,"Approved","Approved")}>Approve</button>
            <button className="danger" onClick={()=>setStatus(p._id,"Rejected","Not compliant")}>Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
}
