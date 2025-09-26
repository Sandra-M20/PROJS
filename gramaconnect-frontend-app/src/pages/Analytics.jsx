// src/pages/Analytics.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
export default function Analytics(){
  const [s,setS] = useState(null);
  useEffect(()=> axios.get("http://localhost:5000/api/complaints/analytics/summary").then(r=>setS(r.data)),[]);
  if(!s) return <div>Loading...</div>;
  return (
    <div style={{maxWidth:800,margin:"20px auto"}}>
      <h2>Dashboard — Analytics</h2>
      <ul>
        <li>Total complaints: {s.total}</li>
        <li>Pending: {s.pending}</li>
        <li>In Progress: {s.inProgress}</li>
        <li>Resolved: {s.resolved}</li>
        <li>Avg resolution time (days): {s.avgResolutionDays ? s.avgResolutionDays.toFixed(2) : "N/A"}</li>
      </ul>
    </div>
  );
}
