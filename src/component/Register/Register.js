import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase";
import { API_ENDPOINTS } from "../../config/api";

import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  BadgeDollarSign,
  TrendingUp,
  ArrowRight,
  AlertTriangle,
  Gift,
  CheckCircle,
} from "lucide-react";

import "./Register.css";

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [referralValid, setReferralValid] = useState(null);
  const [referralInfo, setReferralInfo] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  // ✅ Capture referral code from URL on mount
  useEffect(() => {
    const refCode = searchParams.get("ref");
    if (refCode) {
      setReferralCode(refCode);
      validateReferral(refCode);
    }
  }, [searchParams]);

  // ✅ Validate referral code
  const validateReferral = async (code) => {
    if (!code || code.length !== 13) {
      setReferralValid(false);
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.VALIDATE_REFERRAL(code));
      const data = await response.json();
      
      if (data.success && data.valid) {
        setReferralValid(true);
        setReferralInfo(data.referrer);
      } else {
        setReferralValid(false);
        setReferralInfo(null);
      }
    } catch (error) {
      console.error("Referral validation error:", error);
      setReferralValid(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name] || errors.formSummary) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "", formSummary: "" }));
    }
  };

  const handleReferralChange = (e) => {
    const code = e.target.value.toUpperCase();
    setReferralCode(code);
    setReferralValid(null);
    setReferralInfo(null);
    
    if (code.length === 13) {
      validateReferral(code);
    }
  };

  const validate = () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (referralCode && referralValid === false) {
      newErrors.referralCode = "Invalid referral code";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      // ✅ Step 1: Create Firebase Auth User
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );

      await updateProfile(userCredential.user, {
        displayName: formData.fullName.trim()
      });

      // ✅ Step 2: Register in Backend Database
      const backendResponse = await fetch(API_ENDPOINTS.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
          referralCode: referralCode && referralValid ? referralCode : null
        }),
      });

      const backendData = await backendResponse.json();

      if (!backendResponse.ok) {
        throw new Error(backendData.message || "Failed to initialize security token cluster.");
      }

      const cleanEmail = formData.email.toLowerCase().trim();
      
      // ✅ Store user data
      localStorage.setItem("userEmail", cleanEmail);
      if (backendData.referralCode) {
        localStorage.setItem("userReferralCode", backendData.referralCode);
      }
      
      // ✅ Navigate to OTP verification
      navigate("/otp", { state: { email: cleanEmail } });
      
    } catch (error) {
      console.error("Authentication Cluster Registration Fault:", error);
      
      let formException = {};
      
      if (error.code) {
        switch (error.code) {
          case "auth/email-already-in-use":
            formException.email = "This security email is already tied to another user.";
            break;
          case "auth/invalid-email":
            formException.email = "The format of this email address is invalid.";
            break;
          case "auth/weak-password":
            formException.password = "Password network requirements rejected. Use a stronger hash.";
            break;
          default:
            formException.formSummary = `Cluster connection fault: ${error.message}`;
            break;
        }
      } else {
        formException.formSummary = error.message || "Internal server routing connection fault.";
      }
      setErrors(formException);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-page">
      <div className="background-glow glow-left"></div>
      <div className="background-glow glow-right"></div>

      <header className="register-header">
        <div className="logo-row">
          <div className="logo-icon live-logo-animation">
            <div className="bar bar1"></div>
            <div className="bar bar2"></div>
            <div className="bar bar3"></div>
            <TrendingUp size={16} className="trend-icon" />
          </div>
          <h1 className="logo-text">
            Era<span>X</span>
          </h1>
        </div>
      </header>

      <main className="register-container">
        <section className="form-card">
          <div className="top-highlight"></div>
          
          <div className="top-section">
            <div className="profile-circle">
              <User size={32} strokeWidth={1.8} />
            </div>
            <div>
              <h2>ACCOUNT DETAILS</h2>
              <p>
                This data initializes your private <span>custody investment environment</span>.
              </p>
            </div>
          </div>

          <div className="form-divider" style={{ marginTop: '20px' }}>
            <div className="line"></div>
            <span>PROVISION IDENTITY DETAILS</span>
            <div className="line"></div>
          </div>

          {errors.formSummary && (
            <div className="form-alert-error-banner" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', color: '#ef4444', fontSize: '0.82rem', marginBottom: '16px', fontFamily: 'monospace' }}>
              <AlertTriangle size={16} style={{ flexShrink: 0 }} />
              <span>{errors.formSummary}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="input-group">
              <label>Full Name</label>
              <div className={`input-box ${errors.fullName ? "input-error" : ""}`}>
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  name="fullName"
                  disabled={isSubmitting}
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
              {errors.fullName && <p className="error-text">⚠️ {errors.fullName}</p>}
            </div>

            <div className="input-group">
              <label>Email</label>
              <div className={`input-box ${errors.email ? "input-error" : ""}`}>
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  name="email"
                  disabled={isSubmitting}
                  placeholder="Enter your security email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && <p className="error-text">⚠️ {errors.email}</p>}
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className={`input-box ${errors.password ? "input-error" : ""}`}>
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  disabled={isSubmitting}
                  placeholder="Create strong password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="eye-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="error-text">⚠️ {errors.password}</p>}
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <div className={`input-box ${errors.confirmPassword ? "input-error" : ""}`}>
                <Lock size={18} className="input-icon" />
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  disabled={isSubmitting}
                  placeholder="Repeat master password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="eye-toggle"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="error-text">⚠️ {errors.confirmPassword}</p>}
            </div>

            {/* ✅ Referral Code Input */}
            <div className="input-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Gift size={16} style={{ color: '#f3ba2f' }} />
                Referral Code (Optional)
              </label>
              <div className={`input-box ${errors.referralCode ? "input-error" : ""} ${referralValid ? 'input-success' : ''}`}>
                <Gift size={18} className="input-icon" />
                <input
                  type="text"
                  name="referralCode"
                  disabled={isSubmitting}
                  placeholder="ERAX-XXXXXXXX"
                  value={referralCode}
                  onChange={handleReferralChange}
                  maxLength={13}
                  style={{ textTransform: 'uppercase' }}
                />
                {referralValid === true && (
                  <CheckCircle size={18} style={{ color: '#10b981', marginLeft: '8px' }} />
                )}
              </div>
              {referralValid === true && referralInfo && (
                <p className="success-text" style={{ color: '#10b981', fontSize: '0.85rem', marginTop: '6px' }}>
                  ✅ Valid! You were referred by {referralInfo.name}
                </p>
              )}
              {referralValid === false && (
                <p className="error-text">⚠️ Invalid referral code</p>
              )}
              {errors.referralCode && <p className="error-text">⚠️ {errors.referralCode}</p>}
            </div>

            <button 
              type="submit" 
              className="register-btn shimmer-action-btn"
              disabled={isSubmitting}
              style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
            >
              <span>{isSubmitting ? "Provisioning..." : "Sign Up"}</span>
              <ArrowRight className="arrow-right-shimmer" size={18} strokeWidth={2.5} />
            </button>

            <div className="terms-container">
              <ShieldCheck size={16} className="terms-icon" />
              <p>
                By standing up this account node, you certify full clearance agreement with our{" "}
                <a href="/">Terms of Service</a> and <a href="/">Privacy Regulations</a>.
              </p>
            </div>
          </form>

          <div className="features-rack">
            <div className="feat-node">
              <ShieldCheck className="feat-icon" size={20} />
              <div>
                <h5>Secure Cluster</h5>
                <p>Isolated Endpoints</p>
              </div>
            </div>
            <div className="feat-rack-divider"></div>
            <div className="feat-node">
              <Lock className="feat-icon" size={20} />
              <div>
                <h5>Vault Custody</h5>
                <p>AES-256 Protection</p>
              </div>
            </div>
            <div className="feat-rack-divider"></div>
            <div className="feat-node">
              <BadgeDollarSign className="feat-icon" size={20} />
              <div>
                <h5>Zero Spread</h5>
                <p>Transparent Ledgers</p>
              </div>
            </div>
          </div>
        </section>

        <section className="graphic-side">
          <div className="orbit-ring ring1"></div>
          <div className="orbit-ring ring2"></div>

          <div className="chart-card-premium">
            <div className="card-top-header">
              <div className="pulse-indicator"></div>
              <span>Live EraX Allocation Data Tracker</span>
            </div>
            
            <div className="bars-matrix">
              <div className="bar-item h1"></div>
              <div className="bar-item h2"></div>
              <div className="bar-item h3"></div>
              <div className="bar-item h4"></div>
              <div className="bar-item h5"></div>
              <div className="bar-item h6"></div>
            </div>

            <div className="growth-line-sweep"></div>

            <div className="crypto-coin floating-coin-1"><span>$</span></div>
            <div className="crypto-coin floating-coin-2"><span>$</span></div>
            <div className="crypto-coin floating-coin-3"><span>$</span></div>
          </div>
        </section>
      </main>
    </div>
  );
}