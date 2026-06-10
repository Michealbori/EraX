import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Wallet, 
  BarChart3, 
  ShieldCheck, 
  Users, 
  Sliders, 
  LogOut, 
  ChevronLeft, 
  ChevronRight, 
  Terminal,
  Radio
} from "lucide-react";
import "./AdminSidebar.css";

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Drop token vectors here
    navigate("/adminLogin");
  };

  return (
    <aside className={`admin-sidebar ${isCollapsed ? "collapsed" : ""}`}>
      {/* ===== SIDEBAR HEADER GATES ===== */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon-node">
            <Terminal size={16} className="terminal-brand-icon" />
            <Radio size={10} className="sidebar-pulse-signal" />
          </div>
          {!isCollapsed && (
            <span className="logo-brand-text">
              era<span>X</span> <span className="control-tag">Core</span>
            </span>
          )}
        </div>
        
        <button 
          type="button"
          className="collapse-toggle-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* ===== NAVIGATION LINKS MATRIX ===== */}
      <nav className="sidebar-nav-container">
        <span className="nav-section-label">{isCollapsed ? "SYS" : "System Diagnostics"}</span>
        <ul className="nav-list-group">
          <li>
            <NavLink 
              to="/admin/dashboard" 
              className={({ isActive }) => `sidebar-link ${isActive ? "active-link" : ""}`}
            >
              <LayoutDashboard size={20} className="link-icon" />
              {!isCollapsed && <span className="link-text">Control Center</span>}
            </NavLink>
          </li>


        </ul>

        <span className="nav-section-label">{isCollapsed ? "SEC" : "Authority Management"}</span>
        <ul className="nav-list-group">
          <li>
            <NavLink 
              to="/admin/users" 
              className={({ isActive }) => `sidebar-link ${isActive ? "active-link" : ""}`}
            >
              <Users size={20} className="link-icon" />
              {!isCollapsed && <span className="link-text">EraX User</span>}
            </NavLink>
          </li>



          {/* <li>
            <NavLink 
              to="/admin/settings" 
              className={({ isActive }) => `sidebar-link ${isActive ? "active-link" : ""}`}
            >
              <Sliders size={20} className="link-icon" />
              {!isCollapsed && <span className="link-text">System Tuning</span>}
            </NavLink>
          </li> */}
        </ul>
      </nav>

      {/* ===== FOOTER OPERATOR CONTAINER ===== */}
      <div className="sidebar-footer-profile">
        <div className="profile-pod-wrapper">
          <div className="operator-avatar">
            <span className="avatar-initials">AM</span>
            <div className="active-status-ring"></div>
          </div>
          
          {!isCollapsed && (
            <div className="operator-meta-details">
              <span className="operator-name">Alex Mercer</span>
              <span className="operator-role">Root Admin</span>
            </div>
          )}
        </div>

        <button 
          type="button" 
          className="sidebar-logout-btn" 
          onClick={handleLogout}
          title="Disconnect Session"
        >
          <LogOut size={18} />
          {!isCollapsed && <span className="logout-text">Disconnect</span>}
        </button>
      </div>
    </aside>
  );
}