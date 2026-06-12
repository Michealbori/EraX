import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import { ShieldCheck, Lock, ArrowRight, RefreshCw, Layers } from "lucide-react";
import "./otp.css";

// ✅ Import the API endpoints configuration
import { API_ENDPOINTS } from "../../config/api";

export default function OtpVerification() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [countdown, setCountdown] = useState(30);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const inputRefs = useRef([]);
  const navigate = useNavigate(); 
  const location = useLocation();

  // ✅ Capture email from localStorage or URL state
  useEffect(() => {
    let registeredEmail = localStorage.getItem("userEmail");
    
    if (!registeredEmail && location.state?.email) {
      registeredEmail = location.state.email;
      localStorage.setItem("userEmail", registeredEmail);
    }

    if (!registeredEmail) {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          registeredEmail = parsed.email;
        } catch (e) {
          console.error("Failed to parse user data");
        }
      }
    }

    if (registeredEmail) {
      setUserEmail(registeredEmail.toLowerCase().trim());
      console.log("✅ User email set:", registeredEmail);
    } else {
      console.error("❌ No email found in localStorage");
      setError("Session expired. Please register again.");
    }
  }, [location]);

  // Format masked email for display
  const formatMaskedEmail = (email) => {
    if (!email) return "Loading...";
    const [name, domain] = email.split("@");
    if (!name || !domain) return email;
    if (name.length <= 3) {
      return `${name}***@${domain}`;
    }
    return `${name.slice(0, 3)}*******@${domain}`;
  };

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  // Auto-verify when all 6 digits entered
  useEffect(() => {
    const combinedCode = otp.join("");
    if (combinedCode.length === 6 && !otp.includes("")) {
      const processingDelay = setTimeout(() => {
        handleOtpVerification(combinedCode);
      }, 300);
      return () => clearTimeout(processingDelay);
    }
  }, [otp]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
    setError("");
    setSuccessMsg("");

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const updatedOtp = [...otp];
        updatedOtp[index - 1] = "";
        setOtp(updatedOtp);
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.slice(0, 6).split("");
    const updatedOtp = [...otp];

    digits.forEach((digit, index) => {
      if (index < 6) updatedOtp[index] = digit;
    });

    setOtp(updatedOtp);
    setError("");
    setSuccessMsg("");

    const focusIndex = Math.min(digits.length, 5);
    if (inputRefs.current[focusIndex]) {
      inputRefs.current[focusIndex].focus();
    }
  };

  // ✅ VERIFY OTP - Uses API_ENDPOINTS for production
  const handleOtpVerification = async (codeString) => {
    if (isVerifying) return;
    
    if (!userEmail) {
      setError("Email not found. Please register again.");
      return;
    }

    setIsVerifying(true);
    setError("");
    setSuccessMsg("");

    try {
      console.log("🔐 Verifying OTP for:", userEmail);
      console.log("📡 Endpoint:", API_ENDPOINTS.VERIFY_OTP);
      
      // ✅ PRODUCTION READY: Uses API_ENDPOINTS.VERIFY_OTP
      const response = await fetch(API_ENDPOINTS.VERIFY_OTP, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail.toLowerCase().trim(),
          otp: codeString.trim(), 
        }),
      });

      const data = await response.json();
      console.log("📥 Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Verification failed.");
      }

      setSuccessMsg("✓ Verification successful! Redirecting...");
      
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("isAuthenticated", "true");
      }
      
      setTimeout(() => {
        navigate("/dashboard/overview");
      }, 1000);

    } catch (err) {
      console.error("❌ OTP Verification Error:", err);
      setError(err.message || "Failed to verify OTP.");
      setOtp(["", "", "", "", "", ""]); 
      if (inputRefs.current[0]) inputRefs.current[0].focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter all 6 digits.");
      return;
    }
    handleOtpVerification(code);
  };

  // ✅ RESEND OTP - Uses API_ENDPOINTS for production
  const handleResend = async () => {
    if (countdown > 0 || isResending) {
      console.log("⏳ Resend locked, countdown:", countdown);
      return;
    }
    
    if (!userEmail) {
      setError("Email not found. Please register again.");
      return;
    }

    setIsResending(true);
    setError("");
    setSuccessMsg("");

    try {
      console.log("🔄 Resending OTP to:", userEmail);
      console.log("📡 Endpoint:", API_ENDPOINTS.RESEND_OTP);
      
      // ✅ PRODUCTION READY: Uses API_ENDPOINTS.RESEND_OTP
      const response = await fetch(API_ENDPOINTS.RESEND_OTP, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail.toLowerCase().trim(),
        }),
      });

      const data = await response.json();
      console.log("📥 Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend OTP.");
      }

      setSuccessMsg("✓ New OTP sent successfully! Check your email.");
      setCountdown(30);
      setOtp(["", "", "", "", "", ""]);
      if (inputRefs.current[0]) inputRefs.current[0].focus();

      setTimeout(() => setSuccessMsg(""), 5000);

    } catch (err) {
      console.error("❌ Resend OTP Error:", err);
      setError(err.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="otp-page">
      <div className="ambient-blur glow-left"></div>
      <div className="ambient-blur glow-right"></div>

      <div className="otp-card">
        <div className="top-glow-accent"></div>

        <div className="logo">
          <div className="logo-icon">
            <div className="bar bar1"></div>
            <div className="bar bar2"></div>
            <div className="bar bar3"></div>
            <Layers size={14} className="accent-node" />
          </div>
          <h1>
            era<span>X</span>
          </h1>
        </div>

        <div className="content">
          <div className="otp-badge">Secure Authorization</div>
          <h2>Verify Identity</h2>
          <p className="subtext">
            Enter the 6-digit verification code sent to:
            <span className="email-highlight" style={{ display: 'block', marginTop: '6px', fontWeight: 'bold' }}>
              {formatMaskedEmail(userEmail)}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div 
            className={`otp-wrapper ${error ? "has-input-errors" : ""} ${isVerifying ? "processing-lock" : ""}`}
            onPaste={handlePaste}
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                pattern="[0-9]*"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                disabled={isVerifying || !userEmail}
                ref={(el) => (inputRefs.current[index] = el)}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="otp-input"
                autoComplete="one-time-code"
              />
            ))}
          </div>

          {error && (
            <p className="error-text" style={{ color: "#ff3d00", fontSize: "13px", marginTop: "10px", textAlign: "center" }}>
              ⚠️ {error}
            </p>
          )}

          {successMsg && (
            <p className="success-msg-text" style={{ color: "#00e676", fontSize: "13px", marginTop: "10px", textAlign: "center" }}>
              ✓ {successMsg}
            </p>
          )}

          <div className="security-notice">
            <div className="icon-badge">
              <ShieldCheck size={16} />
            </div>
            <p>Your verification code is secure and encrypted. Do not share it with anyone.</p>
          </div>

          <button 
            type="submit" 
            className="verify-btn interactive-shimmer" 
            disabled={isVerifying || !userEmail}
            style={{ opacity: isVerifying || !userEmail ? 0.7 : 1 }}
          >
            <span>{isVerifying ? "Verifying..." : "Verify OTP"}</span>
            <ArrowRight size={20} className="arrow-icon" />
          </button>
        </form>

        <div className="footer">
          <div className="divider"></div>
          
          <div className="resend-action-block">
            <p>Didn't receive the code?</p>
            <button 
              type="button"
              className={`resend-trigger ${countdown > 0 || isResending ? "lockout" : ""}`}
              onClick={handleResend}
              disabled={countdown > 0 || isResending || isVerifying || !userEmail}
              style={{ 
                cursor: countdown > 0 || isResending ? 'not-allowed' : 'pointer',
                opacity: countdown > 0 || isResending ? 0.5 : 1
              }}
            >
              {isResending ? (
                <span className="spinning-sync"><RefreshCw size={14} /> Sending...</span>
              ) : countdown > 0 ? (
                `Resend Code (${countdown}s)`
              ) : (
                "Resend Code"
              )}
            </button>
          </div>

          <div className="bottom-security">
            <div className="secure-badge">
              <Lock size={12} />
              <span>Secure Connection</span>
            </div>
            <div className="status-dot"></div>
            <span className="secure-badge">Verified System</span>
          </div>
        </div>

      </div>
    </div>
  );
}