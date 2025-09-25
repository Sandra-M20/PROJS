import React from "react";
import "./StatusBadge.css";

const StatusBadge = ({ status }) => {
  let badgeClass = "badge ";

  if (status === "Pending") badgeClass += "pending";
  else if (status === "In Progress") badgeClass += "progress";
  else if (status === "Resolved") badgeClass += "resolved";
  else badgeClass += "default";

  return <span className={badgeClass}>{status}</span>;
};

export default StatusBadge;
