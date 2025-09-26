import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const COLORS = ["#FF8042","#FFBB28","#00C49F","#0088FE","#8884D8"];

export default function AnalyticsChart(){
  const [summary, setSummary] = useState(null);

  useEffect(()=> {
    api.get("/complaints/analytics/summary").then(r => setSummary(r.data)).catch(()=>{});
  }, []);

  if (!summary) return <div>Loading...</div>;

  const pieData = [
    { name: "Pending", value: summary.pending },
    { name: "In Progress", value: summary.inProgress },
    { name: "Resolved", value: summary.resolved }
  ];

  return (
    <div style={{maxWidth:1000, margin:"20px auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:20}}>
      <div style={{background:"#fff",padding:20,borderRadius:10, boxShadow:"0 6px 18px rgba(0,0,0,0.06)"}}>
        <h3>Complaint Status Breakdown</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
              {pieData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div style={{background:"#fff",padding:20,borderRadius:10, boxShadow:"0 6px 18px rgba(0,0,0,0.06)"}}>
        <h3>Quick Stats</h3>
        <p>Total complaints: <b>{summary.total}</b></p>
        <p>Avg resolution (days): <b>{summary.avgResolutionDays ? summary.avgResolutionDays.toFixed(2) : "N/A"}</b></p>
        <h4>Trend (mock sample)</h4>
        {/* you can supply real time-series data later */}
        <BarChart width={400} height={200} data={[
            {name:"Week1", value: 10}, {name:"Week2", value: 7}, {name:"Week3", value: 14}, {name:"Week4", value: 5}
        ]}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#ff6600"/>
        </BarChart>
      </div>
    </div>
  );
}
