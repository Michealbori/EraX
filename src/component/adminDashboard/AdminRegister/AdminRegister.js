import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { 
  ShieldAlert, Lock, User, Mail, Key, Terminal, 
  ArrowRight, CheckCircle2, AlertCircle, Loader2 
} from "lucide-react";
import "./AdminRegister.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function AdminRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [formData, setFormData] = useState({
    adminName: "",
    email: "",
    securityClearanceKey: "",
    password: "",
    confirmPassword: ""
  });
  
  const [passRequirements, setPassRequirements] = useState({
    length: false,
    number: false,
    symbol: false,
    uppercase: false
  });

  // Password complexity validation
  const handlePasswordChange = (value) => {
    setFormData(prev => ({ ...prev, password: value }));
    setPassRequirements({
      length: value.length >= 12,
      number: /[0-9]/.test(value),
      symbol: /[^A-Za-z0-9]/.test(value),
      uppercase: /[A-Z]/.test(value)
    });
  };

  // Form input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  // Submit handler - Calls CORRECT admin API endpoint
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    console.log("📝 Registration attempt with data:", {
      adminName: formData.adminName,
      email: formData.email,
      securityClearanceKey: formData.securityClearanceKey ? "****" : "empty",
      password: formData.password ? "****" : "empty"
    });

    // Client-side validation
    if (!formData.adminName || !formData.email || !formData.securityClearanceKey || !formData.password) {
      setError("All registration fields are required.");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (!passRequirements.length || !passRequirements.number || !passRequirements.symbol || !passRequirements.uppercase) {
      setError("Password does not meet security requirements.");
      setLoading(false);
      return;
    }

    try {
      // ✅ CORRECT API ENDPOINT: /api/admin/auth/register
      const response = await axios.post(`${API_BASE}/api/admin/auth/register`, {
        adminName: formData.adminName.trim(),
        email: formData.email.toLowerCase().trim(),
        securityClearanceKey: formData.securityClearanceKey,
        password: formData.password
      });

      console.log("✅ Registration successful:", response.data);

      setSuccess(response.data.message || "✅ Admin profile provisioned successfully!");
      
      // Redirect to admin login after 2 seconds
      setTimeout(() => {
        navigate("/adminLogin", { 
          state: { 
            message: "Registration successful. Please log in with your new credentials.",
            email: formData.email
          }
        });
      }, 2000);

    } catch (err) {
      console.error("❌ Registration failed:", err);
      console.error("❌ Error response:", err.response?.data);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 403) {
        setError("Invalid security clearance key. Access denied.");
      } else if (err.response?.status === 409) {
        setError("An admin with this email already exists.");
      } else if (err.response?.status === 404) {
        setError("Admin registration endpoint not found. Please check backend configuration.");
      } else {
        setError("Registration failed. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-register-page">
      <div className="admin-glow node-amber"></div>
      <div className="admin-glow node-slate"></div>

      <div className="admin-register-card">
        <div className="admin-accent-strip"></div>

        <header className="admin-card-header">
          <div className="admin-badge">
            <Terminal size={12} />
            <span>Root Authority Infrastructure</span>
          </div>
          <h2>Initialize Admin Profile</h2>
          <p>Deploy secure system credentials to gain access to control plane diagnostics.</p>
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
            <CheckCircle2 size={16} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="admin-form">
          
          <div className="admin-input-group">
            <label htmlFor="adminName">Operator Signature Identity</label>
            <div className="input-field-wrapper">
              <User size={16} className="field-icon" />
              <input
                id="adminName"
                name="adminName"
                type="text"
                placeholder="e.g., Alex Mercer"
                value={formData.adminName}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="admin-input-group">
            <label htmlFor="email">Administrative Access Route (Email)</label>
            <div className="input-field-wrapper">
              <Mail size={16} className="field-icon" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="operator@erax-invest.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="admin-input-group">
            <label htmlFor="securityClearanceKey">Corporate Clearance Auth Key</label>
            <div className="input-field-wrapper">
              <Key size={16} className="field-icon" />
              <input
                id="securityClearanceKey"
                name="securityClearanceKey"
                type="password"
                placeholder="••••-••••-••••-••••"
                value={formData.securityClearanceKey}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <p className="input-hint">Enter the master clearance key from system configuration.</p>
          </div>

          <div className="password-split-row">
            <div className="admin-input-group">
              <label htmlFor="password">System Access Key</label>
              <div className="input-field-wrapper">
                <Lock size={16} className="field-icon" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="admin-input-group">
              <label htmlFor="confirmPassword">Re-verify Access Key</label>
              <div className="input-field-wrapper">
                <Lock size={16} className="field-icon" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="pass-diagnostic-matrix">
            <div className={`metric ${passRequirements.length ? "passed" : ""}`}>
              <CheckCircle2 size={12} />
              <span>12+ Characters</span>
            </div>
            <div className={`metric ${passRequirements.uppercase ? "passed" : ""}`}>
              <CheckCircle2 size={12} />
              <span>Uppercase Letter</span>
            </div>
            <div className={`metric ${passRequirements.number ? "passed" : ""}`}>
              <CheckCircle2 size={12} />
              <span>Numeric Digit</span>
            </div>
            <div className={`metric ${passRequirements.symbol ? "passed" : ""}`}>
              <CheckCircle2 size={12} />
              <span>Special Character</span>
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
                <span>Provisioning...</span>
              </>
            ) : (
              <>
                <span>Provision Access Profile</span>
                <ArrowRight size={18} className="arrow-icon" />
              </>
            )}
          </button>
        </form>

        <footer className="admin-card-footer">
          <p>
            Already certified on this network?{" "}
            <Link to="/adminLogin">Establish Terminal Connection</Link>
          </p>
        </footer>
      </div>
    </div>
  );
}