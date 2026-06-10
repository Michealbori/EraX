import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import { 
  Shield, Lock, Mail, Terminal, ArrowRight, 
  AlertCircle, CheckCircle, Loader2, Eye, EyeOff 
} from "lucide-react";
import "./AdminLogin.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  // Check for messages from registration redirect
  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
      if (location.state?.email) {
        setFormData(prev => ({ ...prev, email: location.state.email }));
      }
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    console.log("🔐 Login attempt:", { email: formData.email });

    if (!formData.email || !formData.password) {
      setError("All terminal validation tokens must be supplied.");
      setLoading(false);
      return;
    }

    try {
      // ✅ CORRECT API ENDPOINT: /api/admin/auth/login
      const response = await axios.post(`${API_BASE}/api/admin/auth/login`, {
        email: formData.email.toLowerCase().trim(),
        password: formData.password
      });

      console.log("✅ Login successful:", response.data);

      if (response.data.success) {
        // Store admin token and data
        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("adminData", JSON.stringify(response.data.admin));
        
        setSuccess("✅ Authentication successful. Redirecting to dashboard...");
        
        // Redirect to admin dashboard after brief delay
        setTimeout(() => {
          navigate("/admin/dashboard", { replace: true });
        }, 1000);
      }
    } catch (err) {
      console.error("❌ Login failed:", err);
      console.error("❌ Error response:", err.response?.data);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError("Invalid admin credentials. Please verify your email and password.");
      } else if (err.response?.status === 403) {
        setError("Access denied. Your account may be suspended or pending approval.");
      } else if (err.response?.status === 404) {
        setError("Admin login endpoint not found. Please check backend configuration.");
      } else {
        setError("Authentication failed. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-glow node-amber"></div>
      <div className="admin-glow node-slate"></div>

      <div className="admin-login-card">
        <div className="admin-accent-strip"></div>

        <header className="admin-card-header">
          <div className="admin-badge">
            <Terminal size={12} />
            <span>Secure System Access Link</span>
          </div>
          <h2>Admin Login</h2>
          <p>Provide verified authenticated information to admin dashboard.</p>
        </header>

        {error && (
          <div className="admin-error-banner" role="alert">
            <AlertCircle size={16} />
            <span>{error}</span>
            <button className="error-close" onClick={() => setError("")}>×</button>
          </div>
        )}

        {success && (
          <div className="admin-success-banner" role="status">
            <CheckCircle size={16} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="admin-form">
          
          <div className="admin-input-group">
            <label htmlFor="email">Admin Gmail</label>
            <div className="input-field-wrapper">
              <Mail size={16} className="field-icon" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="admin@erax-invest.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="admin-input-group">
            <div className="label-row">
              <label htmlFor="password">Admin Password</label>
              <Link to="/admin/forgot-password" className="forgot-link">
                Recover Password
              </Link>
            </div>
            <div className="input-field-wrapper">
              <Lock size={16} className="field-icon" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="admin-submit-btn interactive-shimmer"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Admin Login</span>
                <ArrowRight size={18} className="arrow-icon" />
              </>
            )}
          </button>
        </form>

        <footer className="admin-card-footer">
          <p>
            Deconfigured operator asset profile?{" "}
            <Link to="/admin/register">Initialize New Admin Profile</Link>
          </p>
        </footer>
      </div>
    </div>
  );
}