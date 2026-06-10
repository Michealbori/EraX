import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import '../ProfileDashboard.css';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // ==========================================================================
  // AUTHORIZED DE-AUTHENTICATION MATRIX
  // ==========================================================================
  const handleLogoutAction = () => {
    // Drop the JWT credential element completely from browser memory storage
    localStorage.removeItem("eraX_auth_token");
    
    // Hard-redirect the client view back to the authentication portal
    navigate("/login", { replace: true });
  };

  return (
    <div className="dashboard-container">
      {/* Mobile Top Header */}
      <header className="mobile-header">
        <div className="logo-brand">
          <span className="logo-icon">📊</span>
          <span className="logo-text">era<span className="text-gold">X</span></span>
        </div>
        <button 
          className="menu-toggle" 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="Toggle Menu"
        >
          ☰
        </button>
      </header>

      {/* Standalone Persistent Sidebar -> Forwarding the logout controller hook */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onLogout={handleLogoutAction} 
      />

      {/* Dynamic Central Canvas Viewport */}
      <main className="main-content">
        <Outlet /> 
      </main>
    </div>
  );
};

export default DashboardLayout;