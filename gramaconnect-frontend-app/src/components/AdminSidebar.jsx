import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  ClipboardList,
  Briefcase,
  Settings,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import "./AdminSidebar.css";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">🏛️ GramaConnect</h2>
      <nav className="sidebar-nav">
        <NavLink to="/admin" className="nav-item">
          <LayoutDashboard size={18} /> Dashboard
        </NavLink>

        <NavLink to="/officer" className="nav-item">
          <ShieldCheck size={18} /> Officer Panel
        </NavLink>

        <NavLink to="/complaints" className="nav-item">
          <ClipboardList size={18} /> Complaints
        </NavLink>

        <NavLink to="/permits" className="nav-item">
          <FileText size={18} /> Permits
        </NavLink>

        <NavLink to="/jobs" className="nav-item">
          <Briefcase size={18} /> Jobs
        </NavLink>

        <NavLink to="/users" className="nav-item">
          <Users size={18} /> Users
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/settings" className="nav-item">
          <Settings size={18} /> Settings
        </NavLink>
        <button onClick={logout} className="nav-item logout-btn">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
}
