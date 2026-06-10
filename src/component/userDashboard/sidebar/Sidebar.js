import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { TrendingUp } from "lucide-react";
import { onAuthStateChanged } from 'firebase/auth';
// Step up 3 levels to reach the src root folder path cleanly
import { auth } from '../../../firebase'; 
import "./Sidebar.css";

const Sidebar = ({ isOpen, onClose }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // ==========================================================================
  // REAL-TIME API AUTH LISTENER LIFECYCLE FOR SIDEBAR IDENTITIES
  // ==========================================================================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const fallbackName = user.email ? user.email.split('@')[0] : "Authorized Node";
        
        setCurrentUser({
          name: user.displayName || fallbackName,
          email: user.email,
          photo: user.photoURL || null
        });
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'active' : ''}`}>
        
        {/* ===== LOGO ===== */}
        <NavLink
          to="/Dashboard"
          className="logo-container newMe"
          onClick={onClose}
        >
          <div className="logo-icon">
            <div className="bar bar1"></div>
            <div className="bar bar2"></div>
            <div className="bar bar3"></div>

            <TrendingUp
              size={18}
              className="trend-icon"
            />
          </div>

          <h1 className="logo-text">
            era<span>X</span>
          </h1>
        </NavLink>

        {/* Dynamic Navigation Architecture Framework */}
        <nav className="nav-menu">
          <NavLink 
            to="/Dashboard" 
            className={({ isActive }) => `dashboard-nav-item ${isActive ? 'dashboard-active' : ''}`}
            onClick={onClose}
          >
            <span className="nav-icon">🎛️</span> Overview
          </NavLink>
          
          <NavLink 
            to="/dashboard/investments" 
            className={({ isActive }) => `dashboard-nav-item ${isActive ? 'dashboard-active' : ''}`}
            onClick={onClose}
          >
            <span className="nav-icon">📈</span> Investments
          </NavLink>

          <NavLink 
            to="/dashboard/wallet" 
            className={({ isActive }) => `dashboard-nav-item ${isActive ? 'dashboard-active' : ''}`}
            onClick={onClose}
          >
            <span className="nav-icon">💳</span> Wallet
          </NavLink>
          
          <NavLink 
            to="/dashboard/deposit" 
            className={({ isActive }) => `dashboard-nav-item ${isActive ? 'dashboard-active' : ''}`}
            onClick={onClose}
          >
            <span className="nav-icon">📥</span> Deposit 
          </NavLink>
          
          <NavLink 
            to="/dashboard/withdraw" 
            className={({ isActive }) => `dashboard-nav-item ${isActive ? 'dashboard-active' : ''}`}
            onClick={onClose}
          >
            <span className="nav-icon">📤</span> Withdraw
          </NavLink>

          <NavLink 
            to="/dashboard/transactions" 
            className={({ isActive }) => `dashboard-nav-item ${isActive ? 'dashboard-active' : ''}`}
            onClick={onClose}
          >
            <span className="nav-icon">🕒</span> Transactions
          </NavLink>

          <NavLink 
            to="/dashboard/referrals" 
            className={({ isActive }) => `dashboard-nav-item ${isActive ? 'dashboard-active' : ''}`}
            onClick={onClose}
          >
            <span className="nav-icon">👥</span> Referrals
          </NavLink>
          
          <NavLink 
            to="/dashboard/settings" 
            className={({ isActive }) => `dashboard-nav-item ${isActive ? 'dashboard-active' : ''}`}
            onClick={onClose}
          >
            <span className="nav-icon">⚙️</span> Settings
          </NavLink>
          
          <NavLink 
            to="/dashboard/help" 
            className={({ isActive }) => `dashboard-nav-item ${isActive ? 'dashboard-active' : ''}`}
            onClick={onClose}
          >
            <span className="nav-icon">❓</span> Help Center
          </NavLink>
        </nav>

        {/* Informational Security Credentials Block */}
        <div className="security-card">
          <div className="security-card-header">
            <span className="shield-icon">🛡️</span>
            <h4>Bank-grade Security</h4>
          </div>
          <p>Your assets are protected with enterprise-level encryption.</p>
        </div>

        {/* Current Active Account Profile Footprint */}
        <div className="sidebar-footer">
          {currentUser ? (
            <>
              {/* Dynamic Profile Image Node with Premium Fallback Vector SVG */}
              {currentUser.photo ? (
                <img 
                  src={currentUser.photo} 
                  alt="User avatar" 
                  className="footer-avatar" 
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <svg 
                  viewBox="0 0 32 32" 
                  className="footer-avatar"
                  style={{ 
                    border: '1px solid rgba(243, 186, 47, 0.4)', 
                    backgroundColor: 'rgba(243, 186, 47, 0.08)',
                    padding: '2px',
                    boxSizing: 'border-box'
                  }}
                >
                  <defs>
                    <clipPath id="sidebarCircleClip">
                      <circle cx="16" cy="16" r="16" />
                    </clipPath>
                  </defs>
                  <g clipPath="url(#sidebarCircleClip)">
                    <circle cx="16" cy="11.5" r="4.5" fill="#f3ba2f" opacity="0.85" />
                    <path d="M16,19C10.5,19,6,22.5,6,27c0,0.5,0.5,1,1,1h18c0.5,0,1-0.5,1-1C32,22.5,21.5,19,16,19z" fill="#f3ba2f" opacity="0.85" />
                  </g>
                </svg>
              )}
              
              <div className="footer-user-info">
                <span className="footer-username">{currentUser.name}</span>
                <span className="footer-email">{currentUser.email || 'System Node Verified'}</span>
              </div>
            </>
          ) : (
            <>
              <div className="footer-avatar" style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>
              <div className="footer-user-info">
                <span className="footer-username" style={{ opacity: 0.5 }}>Connecting...</span>
                <span className="footer-email" style={{ opacity: 0.3 }}>Establishing node session</span>
              </div>
            </>
          )}
          <span className="footer-arrow">↕</span>
        </div>
      </aside>

      {/* Dimmed mobile overlay mask */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
    </>
  );
};

export default Sidebar;