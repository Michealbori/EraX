import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import { API_ENDPOINTS } from "../../config/api";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // =========================
  // HANDLE INPUT CHANGES
  // =========================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // =========================
  // FORM VALIDATION
  // =========================
  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!formData.email.trim()) {
      errors.email = "Identity address is required.";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid identity address architecture.";
    }

    if (!formData.password) {
      errors.password = "Security access key is required.";
    } else if (formData.password.length < 8) {
      errors.password = "Access key must be at least 8 elements long.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // =========================
  // LOGIN SUBMISSION - ✅ Backend-Only Auth
  // =========================
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const cleanEmail = formData.email.toLowerCase().trim();

      console.log("🔐 Authenticating with backend:", cleanEmail);

      // ✅ Use backend authentication ONLY (bcrypt + JWT)
      const response = await axios.post(
        `${API_BASE}/api/identity/login`,
        {
          email: cleanEmail,
          password: formData.password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("✅ Backend auth successful:", response.data);

      // ✅ Store auth data
      localStorage.setItem(
        "eraX_auth_token",
        response.data.token || "authenticated"
      );
      localStorage.setItem("userEmail", cleanEmail);
      localStorage.removeItem("auth_stage");

      // ✅ Redirect to dashboard
      console.log("🚀 Navigating to dashboard...");
      navigate("/dashboard/overview");

    } catch (error) {
      console.error("❌ Login failed:", error);

      // Handle specific error cases
      if (error.response?.status === 401) {
        setErrorMessage("Invalid email or password.");
      } else if (error.response?.status === 404) {
        setErrorMessage("No identity node found with this address.");
      } else if (error.code === "ERR_NETWORK") {
        setErrorMessage("Cannot connect to authentication server.");
      } else {
        setErrorMessage(
          error.response?.data?.message ||
          error.message ||
          "Authorization handshake failed. Try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* HEADER */}
        <div className="auth-header">
          <h1 className="brand-logo">
            Era<span>X</span>
          </h1>
          <span className="badge-secure">Secure Authorization</span>
          <h2 className="auth-title">Access Your Profile</h2>
          <p className="auth-subtitle">
            Enter your identity credentials to access your profile
          </p>
        </div>

        {/* ERROR ALERT */}
        {errorMessage && (
          <div className="status-error-alert">
            <span className="alert-icon">⚠️</span>
            <p className="alert-text">{errorMessage}</p>
          </div>
        )}

        {/* LOGIN FORM */}
        <form className="auth-form" onSubmit={handleLoginSubmit} noValidate>
          {/* EMAIL FIELD */}
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="name@domain.com"
              required
              disabled={isLoading}
              autoComplete="email"
              className={fieldErrors.email ? "input-error" : ""}
            />
            {fieldErrors.email && (
              <span className="error-text">❌ {fieldErrors.email}</span>
            )}
          </div>

          {/* PASSWORD FIELD */}
          <div className="input-group">
            <div className="label-row">
              <label htmlFor="password">Password</label>
              <Link to="/forgot-password" className="context-link">
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••••••"
              required
              disabled={isLoading}
              autoComplete="current-password"
              className={fieldErrors.password ? "input-error" : ""}
            />
            {fieldErrors.password && (
              <span className="error-text">❌ {fieldErrors.password}</span>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className={`btn-submit ${isLoading ? "btn-loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? "Validating Credentials..." : "Log In →"}
          </button>
        </form>

        {/* FOOTER */}
        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="context-link">
              Create An Account
            </Link>
          </p>
          <div className="encryption-notice">
            <span className="lock-icon">🔒</span>
            <span>AES-256 Encrypted Context Layer</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;