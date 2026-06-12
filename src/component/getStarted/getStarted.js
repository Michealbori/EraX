// EraxGetStarted.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRedirectResult } from 'firebase/auth';
import axios from 'axios';
import { auth, executePlatformAuth } from '../../firebase';
import { MoveRight, MoveDown } from 'lucide-react';
import './getStarted.css';

import { API_ENDPOINTS } from "../../config/api";

export default function EraxGetStarted() {
  const navigate = useNavigate();
  const [authInTransit, setAuthInTransit] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ==========================================================================
  // SYNC USER TO BACKEND AND NAVIGATE
  // ==========================================================================
  const syncUserAndNavigate = async (userProfile) => {
    try {
      console.log("[SYNCING USER TO BACKEND]:", userProfile.email);
      
      const response = await axios.post(`${API_BASE}/api/identity/google-signin`, {
        email: userProfile.email,
        fullName: userProfile.displayName || userProfile.email.split('@')[0],
        uid: userProfile.uid,
        photoURL: userProfile.photoURL
      });

      if (response.data.success) {
        console.log("✅ User synced to database:", response.data.user);
        
        const userData = response.data.user;
        
        // ✅ Store ALL necessary data for ProtectedRoute
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', response.data.token || 'google-auth-token');
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', userData.email);
        localStorage.setItem('userId', userData.id);
        
        console.log("[LOCALSTORAGE SET]:", {
          user: localStorage.getItem('user'),
          token: localStorage.getItem('token'),
          isAuthenticated: localStorage.getItem('isAuthenticated')
        });
        
        // ✅ Navigate to dashboard
        console.log("[NAVIGATING TO]: /dashboard/overview");
        navigate('/dashboard/overview', { replace: true });
        
      } else {
        console.error("❌ Backend error:", response.data.message);
        setErrorMessage(response.data.message || "Failed to complete sign-in.");
      }
    } catch (error) {
      console.error("❌ Failed to sync user:", error);
      if (error.response) {
        console.error("Response error:", error.response.data);
        setErrorMessage(error.response.data.message || "Server error. Please try again.");
      } else if (error.request) {
        setErrorMessage("Network error. Please check your connection.");
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };

  // ==========================================================================
  // MOBILE REDIRECT RESOLUTION LIFECYCLE
  // ==========================================================================
  useEffect(() => {
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          console.log("[MOBILE RUNTIME SYNC]: User verified:", result.user.email);
          await syncUserAndNavigate(result.user);
        }
      })
      .catch((error) => {
        console.error("[MOBILE RUNTIME EXCEPTION]:", error);
        setErrorMessage("Failed to synchronize mobile cross-browser session.");
      });
  }, [navigate]);

  // ==========================================================================
  // INTERACTIVE SIGN IN TRIGGERS
  // ==========================================================================
  const handleAuthTrigger = async (providerName) => {
    setErrorMessage("");
    setAuthInTransit(true);
    
    try {
      const userProfile = await executePlatformAuth(providerName);
      
      if (userProfile) {
        console.log("[DESKTOP POPUP SYNC]: User verified:", userProfile.email);
        await syncUserAndNavigate(userProfile);
      } else {
        setErrorMessage("Authentication failed. Please try again.");
      }
    } catch (error) {
      console.error("[AUTH CORE EXCEPTION]:", error);
      if (error.code !== 'auth/popup-closed-by-user') {
        setErrorMessage(error.message || "Authorization handshake interrupted.");
      }
    } finally {
      setAuthInTransit(false);
    }
  };

  return (
    <div className="getstarted-page">
      <div className="background-glow glow-top"></div>
      <div className="background-glow glow-bottom"></div>
      
      <div className="getstarted-card">
        <div className="top-highlight"></div>
        
        {/* LOGO BLOCK */}
        <div className="logo-row">
          <div className="logo-icon live-logo-animation">
            <div className="bar bar1"></div>
            <div className="bar bar2"></div>
            <div className="bar bar3"></div>
          </div>
          <h1 className="logo-text">ERA<span>X</span></h1>
        </div>

        <h2 className="title">Get <span>Started</span></h2>

        {/* SOCIAL CONNECT BUTTONS */}
        <div className="social-connect-stack">
          <button 
            type="button" 
            disabled={authInTransit}
            onClick={() => handleAuthTrigger('google')}
            className="social-btn"
          >
            <div className="social-left">
              <img 
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                alt="Google Network" 
                className="google-logo" 
              />
              <span>Continue with Google</span>
            </div>
            <MoveRight size={16} className="arrow-right" />
          </button>
        </div>

        <div className="divider">
          <div className="line"></div>
          <span>OR</span>
          <div className="line"></div>
        </div>

        {/* TRADITIONAL CREDENTIALS ACTIONS */}
        <div className="traditional-auth-stack">
          <button 
            onClick={() => navigate('/register')} 
            className="shimmer-action-btn"
          >
            <span>Create An Account</span>
            <MoveRight size={16} className="arrow-right-shimmer" />
          </button>

          <button 
            onClick={() => navigate('/login')} 
            className="secondary-outline-btn"
          >
            <span>Sign In </span>
            <MoveDown size={16} className="arrow-right" />
          </button>
        </div>

        <div className="bottom-line"></div>

        <p className="terms">
          By proceeding, you agree to the EraX <span>Terms of Service</span> and acknowledge our system <span>Privacy Policy</span>.
        </p>

        {/* SYSTEM NOTICES */}
        {authInTransit && (
          <p style={{ color: '#f3ba2f', textAlign: 'center', fontSize: '13px', marginTop: '15px' }}>
            Connecting with identity provider network...
          </p>
        )}

        {errorMessage && (
          <p style={{ color: '#ff4d4d', textAlign: 'center', fontSize: '13px', marginTop: '15px' }}>
            {errorMessage}
          </p>
        )}

      </div>
    </div>
  );
}