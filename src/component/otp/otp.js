import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import { ShieldCheck, Lock, ArrowRight, RefreshCw, Layers } from "lucide-react";
import "./otp.css";

export default function OtpVerification() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(30);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const inputRefs = useRef([]);
  const navigate = useNavigate(); 
  const location = useLocation();

  // STABLE EMAIL CAPTURE MATRIX
  useEffect(() => {
    // Pipeline Layer 1: Read out of operational local storage parameters
    let registeredEmail = localStorage.getItem("userEmail");
    
    // Pipeline Layer 2: Location state fallback parameter reading
    if (!registeredEmail && location.state?.email) {
      registeredEmail = location.state.email;
      localStorage.setItem("userEmail", registeredEmail);
    }

    if (registeredEmail) {
      setUserEmail(registeredEmail.toLowerCase().trim());
    } else {
      setError("Authorization context trace lost. Please return to authentication gateway.");
    }
  }, [location]);

  // Premium aesthetic mask logic for email strings
  const formatMaskedEmail = (email) => {
    if (!email) return "Loading Profile Terminal...";
    const [name, domain] = email.split("@");
    if (!name || !domain) return email;
    if (name.length <= 3) {
      return `${name}***@${domain}`;
    }
    return `${name.slice(0, 3)}*******@${domain}`;
  };

  // Resend Lockout Engine
  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  // FIXED WATCHER ENGINE: Fires handshake code sequence upon final entry slice
  useEffect(() => {
    const combinedCode = otp.join("");
    if (combinedCode.length === 6 && !otp.includes("")) {
      const processingDelay = setTimeout(() => {
        handleOtpVerification(combinedCode);
      }, 100);
      return () => clearTimeout(processingDelay);
    }
  }, [otp]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
    setError("");

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

    const focusIndex = Math.min(digits.length, 5);
    if (inputRefs.current[focusIndex]) {
      inputRefs.current[focusIndex].focus();
    }
  };

  const handleOtpVerification = async (codeString) => {
    if (isVerifying) return;
    
    if (!userEmail) {
      setError("Cannot clear gateway check: Missing destination identity email parameter.");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/identity/verify-otp", {
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

      if (!response.ok) {
        throw new Error(data.message || "Verification failed.");
      }

      setError("");
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      navigate("/dashboard/overview"); 

    } catch (err) {
      console.error("OTP Handshake Security Fault:", err);
      setError(err.message || "Failed to establish a verification handshake.");
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
      setError("Please fill out the absolute 6-digit OTP sent to your Email.");
      return;
    }
    handleOtpVerification(code);
  };

  const handleResend = async () => {
    if (countdown > 0 || isResending) return;
    if (!userEmail) {
      setError("Cannot request parameter payload: Target address reference point missing.");
      return;
    }

    setIsResending(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/identity/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail.toLowerCase().trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to cycle parameter payloads.");
      }

      setError("Fresh code parameter payload broadcasted successfully to your inbox.");
      setCountdown(30);
      setOtp(["", "", "", "", "", ""]);
      if (inputRefs.current[0]) inputRefs.current[0].focus();

    } catch (err) {
      console.error("Token Broadcast Interruption Fault:", err);
      setError(err.message || "Failed to broadcast fresh parameter payloads.");
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

        {/* Brand System */}
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

        {/* Content Typography */}
        <div className="content">
          <div className="otp-badge">Secure Authorization</div>
          <h2>Verify Identity</h2>
          <p className="subtext">
            Enter the secondary authorization payload sent directly to your active route terminal:
            <span className="email-highlight" style={{ display: 'block', marginTop: '6px' }}>
              {formatMaskedEmail(userEmail)}
            </span>
          </p>
        </div>

        {/* Operational Grid Frame */}
        <form onSubmit={handleSubmit} noValidate>
          <div 
            className={`otp-wrapper ${error && !error.includes("successfully") ? "has-input-errors" : ""} ${isVerifying ? "processing-lock" : ""}`}
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
            <p className={error.includes("successfully") ? "success-msg-text" : "error-text"} 
               style={{ color: error.includes("successfully") ? "#00e676" : "#ff3d00", fontSize: "13px", marginTop: "10px", textAlign: "center" }}>
              {error.includes("successfully") ? "✓" : "⚠️"} {error}
            </p>
          )}

          <div className="security-notice">
            <div className="icon-badge">
              <ShieldCheck size={16} />
            </div>
            <p>Vault systems isolate this gateway context. Do not expose authorization keys.</p>
          </div>

          <button 
            type="submit" 
            className="verify-btn interactive-shimmer" 
            disabled={isVerifying || !userEmail}
            style={{ opacity: isVerifying || !userEmail ? 0.7 : 1 }}
          >
            <span>{isVerifying ? "Processing Security Handshake..." : "Verify OTP"}</span>
            <ArrowRight size={20} className="arrow-icon" />
          </button>
        </form>

        {/* Structured Footer Contexts */}
        <div className="footer">
          <div className="divider"></div>
          
          <div className="resend-action-block">
            <p>Did not capture the automated payload transmission?</p>
            <button 
              type="button"
              className={`resend-trigger ${countdown > 0 || isResending ? "lockout" : ""}`}
              onClick={handleResend}
              disabled={countdown > 0 || isResending || isVerifying || !userEmail}
            >
              {isResending ? (
                <span className="spinning-sync"><RefreshCw size={14} /> Broadcasting...</span>
              ) : countdown > 0 ? (
                `Resend Parameter Payload (${countdown}s)`
              ) : (
                "Request Fresh Token"
              )}
            </button>
          </div>

          <div className="bottom-security">
            <div className="secure-badge">
              <Lock size={12} />
              <span>AES-256 Encrypted Context</span>
            </div>
            <div className="status-dot"></div>
            <span className="secure-badge">Verified System</span>
          </div>
        </div>

      </div>
    </div>
  );
}