import React, { useState, useEffect, useRef } from "react";
import {
  ArrowDownCircle,
  Copy,
  QrCode,
  ShieldCheck,
  Info,
  CheckCircle2,
  Clock,
  ExternalLink,
  Sparkles,
  X,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import axios from "axios";
import "./Deposit.css";

import { API_ENDPOINTS } from "../../config/api";

const Deposit = () => {
  // Network & UI State
  const [selectedNetwork, setSelectedNetwork] = useState("USDT (TRC-20)");
  const [copied, setCopied] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  
  // Deposit Flow State
  const [depositAmount, setDepositAmount] = useState("");
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState("");
  const [countdown, setCountdown] = useState(600); // 10 minutes
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [uploadError, setUploadError] = useState("");
  
  // Polling State for Auto-Redirect
  const [depositId, setDepositId] = useState(null);
  const [pollingActive, setPollingActive] = useState(false);

  const fileInputRef = useRef(null);

  // Wallet addresses
  const networkAddresses = {
    "USDT (TRC-20)": "TKbUyxpYxRskWZAVKaAXEyU23sDZWZ3LbN",
    BTC: "1GJRZhnSwNXYNtzEPN8daLi9b811sSsPWn",
    LTC: "LU38DPtoHiHBk7ynpv6SopMAa3GYwmT4go",
    ETH: "0x543a2f4566fa2416e1fd9baca0bc43f9b910579c",
  };

  // Recent inbound records
  const activeInboundTx = [
    {
      id: "TXN-4401",
      amount: "1,200.00 USDT",
      network: "USDT (TRC-20)",
      confirms: "12/20",
      status: "Syncing",
      time: "2 mins ago",
    },
    {
      id: "TXN-3982",
      amount: "0.145 BTC",
      network: "BTC",
      confirms: "2/2",
      status: "Credited",
      time: "1 hr ago",
    },
  ];

  const currentTicker = selectedNetwork.split(" ")[0];

  // Load current user from localStorage
  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) {
      console.log("👤 User loaded:", email);
      setCurrentUser({ email });
    }
  }, []);

  // ✅ Countdown timer - ONLY runs AFTER form submission
  useEffect(() => {
    if (paymentSubmitted && countdown > 0) {
      const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
    // Auto-redirect when countdown expires (safety fallback)
    if (paymentSubmitted && countdown === 0) {
      console.log("⏰ Countdown expired, redirecting...");
      if (pollingActive) setPollingActive(false);
      window.location.href = "/dashboard/overview";
    }
  }, [paymentSubmitted, countdown, pollingActive]);

  // ✅ Polling for deposit approval status
  useEffect(() => {
    if (!depositId || !paymentSubmitted) {
      console.log("⏸️ Polling paused:", { depositId, paymentSubmitted });
      return;
    }

    console.log(" Polling started for deposit:", depositId);
    setPollingActive(true);

    const checkStatus = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/api/deposit/status/${depositId}`);
        console.log("📊 Polling response:", data);

        if (data.status === "Confirmed") {
          console.log("✅ Deposit confirmed! Redirecting user...");
          setPollingActive(false);
          alert(`✅ Your deposit of $${data.amount} ${data.currency} has been approved!\nRedirecting to Overview...`);
          window.location.href = "/dashboard/overview";
        }
      } catch (error) {
        console.error("❌ Polling error:", error.response?.data || error.message);
        // Stop polling if deposit is deleted or server error persists
        if (error.response?.status === 404) {
          setPollingActive(false);
          alert("❌ Deposit record not found. Please contact support.");
        }
      }
    };

    // Check immediately, then every 5 seconds
    checkStatus();
    const interval = setInterval(checkStatus, 5000);

    // Cleanup function
    return () => {
      console.log("🧹 Polling cleanup");
      clearInterval(interval);
      setPollingActive(false);
    };
  }, [depositId, paymentSubmitted]);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (screenshotPreview?.startsWith("blob:")) URL.revokeObjectURL(screenshotPreview);
    };
  }, [screenshotPreview]);

  // Copy address
  const handleCopy = () => {
    navigator.clipboard.writeText(networkAddresses[selectedNetwork]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Open modal & reset states
  const handleProceed = () => {
    setShowOverlay(true);
    setPaymentSubmitted(false);
    setCountdown(600);
    setDepositAmount("");
    setScreenshotFile(null);
    setScreenshotPreview("");
    setUploadError("");
    setDepositId(null);
    setPollingActive(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Close modal & reset states
  const handleCloseOverlay = () => {
    setShowOverlay(false);
    setPaymentSubmitted(false);
    setCountdown(600);
    setDepositAmount("");
    setScreenshotFile(null);
    setScreenshotPreview("");
    setUploadError("");
    setDepositId(null);
    setPollingActive(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Handle screenshot upload
  const handleScreenshotChange = (e) => {
    const file = e.target.files?.[0];
    setUploadError("");
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload an image file (JPG, PNG, WEBP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be less than 5MB.");
      return;
    }

    setScreenshotFile(file);
    const previewUrl = URL.createObjectURL(file);
    setScreenshotPreview(previewUrl);
  };

  // Remove screenshot
  const handleRemoveScreenshot = () => {
    setScreenshotFile(null);
    if (screenshotPreview?.startsWith("blob:")) URL.revokeObjectURL(screenshotPreview);
    setScreenshotPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    setUploadError("");
  };

  // Trigger hidden file input
  const handleUploadClick = () => fileInputRef.current?.click();

  // ✅ Submit deposit to admin - WITH POLLING
  const handlePaymentConfirmation = async () => {
    const amount = parseFloat(depositAmount);
    
    if (!currentUser?.email) { alert("Please log in to make a deposit."); return; }
    if (!amount || amount < 200) { alert("Minimum deposit amount is $200"); return; }
    if (!screenshotFile) { setUploadError("Please upload a screenshot of your transaction."); return; }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", currentUser.email);
      formData.append("amount", amount);
      formData.append("currency", currentTicker);
      formData.append("network", selectedNetwork);
      formData.append("screenshot", screenshotFile);

      console.log("📤 Sending deposit request...");
      const res = await axios.post(`${API_BASE}/api/deposit/notify-admin`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ Admin notified:", res.data);
      
      // ✅ Start polling for approval
      if (res.data.depositId) {
        setDepositId(res.data.depositId);
        console.log("🔄 Deposit ID set, polling started...");
        setPaymentSubmitted(true); // Triggers countdown & success UI
      } else {
        setUploadError("Server did not return a deposit ID.");
      }
      
    } catch (err) {
      console.error("❌ Failed to notify admin:", err);
      setUploadError(err.response?.data?.message || "Failed to submit deposit request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="erax-dashboard-wrapper">

      {/* ================= HERO SECTION ================= */}
      <div className="erax-stats-strip wallet-hero-grid">
        <div className="erax-stat-node wallet-main-card deposit-hero-card">
          <div className="wallet-card-header">
            <span className="erax-node-label">
              <ArrowDownCircle size={14} /> Capital Inbound Vault
            </span>
            <span className="secure-badge">
              <ShieldCheck size={12} /> Institutional Security Enabled
            </span>
          </div>
          <div className="wallet-balance-hero">
            <h2>Instant Crypto Inflow</h2>
            <span className="currency-tag">Zero Fee Entry</span>
          </div>
        </div>
      </div>

      {/* ================= MAIN WORKSPACE ================= */}
      <div className="erax-split-workspace">

        {/* ================= LEFT PANEL ================= */}
        <div className="erax-workspace-panel main-ledger-panel">
          <div className="panel-header-action">
            <div>
              <h3 className="panel-title">Address Settlement Generation</h3>
              <p className="panel-subtitle">Select your preferred asset gateway pipeline</p>
            </div>
          </div>

          <div className="deposit-form-body">
            {/* NETWORK SELECTOR */}
            <div className="form-group custom-deposit-group">
              <label>Select Inbound Gateway Protocol</label>
              <div className="deposit-network-selector-grid">
                {Object.keys(networkAddresses).map((net) => (
                  <button
                    key={net}
                    type="button"
                    className={`network-select-btn ${selectedNetwork === net ? "active-net-btn" : ""}`}
                    onClick={() => setSelectedNetwork(net)}
                  >
                    <span>{net}</span>
                    {net === "USDT (TRC-20)" && (
                      <span className="recommended-pill-badge">
                        <Sparkles size={10} /> Recommended
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* ADDRESS BOX */}
            <div className="address-generation-display-box">
              <div className="qr-placeholder-wrapper">
                <div className="qr-matrix-box">
                  <QrCode size={130} strokeWidth={1.2} className="text-white" />
                  <div className="qr-center-logo">X</div>
                </div>
              </div>
              <div className="generated-address-details">
                <span className="address-field-header">
                  Your Secured {selectedNetwork} Settlement Address
                </span>
                <div className="address-copy-interactive-row" onClick={handleCopy}>
                  <code className="truncate-address">{networkAddresses[selectedNetwork]}</code>
                  <button className="address-copy-action-icon" type="button">
                    {copied ? (
                      <CheckCircle2 size={16} className="text-green" />
                    ) : (
                      <Copy size={16} className="text-gold" />
                    )}
                  </button>
                </div>
                {copied && (
                  <span className="copy-success-floating-txt">Copied to secure platform clipboard!</span>
                )}
              </div>
            </div>

            {/* PROCEED BUTTON */}
            <button className="deposit-proceed-btn" onClick={handleProceed}>
              Proceed
            </button>

            {/* WARNING */}
            <div className="deposit-notice-callout-card">
              <Info size={18} className="text-gold flex-shrink-0" />
              <p>
                Send only <strong>{currentTicker}</strong> to this specific node pipeline.
                Transmitting any other digital asset standard will lead to permanent capital liquidation.
              </p>
            </div>
          </div>
        </div>

        {/* ================= RIGHT PANEL ================= */}
        <div className="erax-workspace-panel analytics-side-panel">
          <div className="inner-analytics-card premium-action-card deposit-tracking-card">
            <h4 className="card-inner-title">
              <Clock size={16} /> Live Network Synchronization
            </h4>
            <p className="terminal-desc">
              Tracking ledger arrivals across decentralized node consensus validation rings.
            </p>
            <div className="live-inbound-syncing-stack">
              {activeInboundTx.map((tx) => (
                <div key={tx.id} className="inbound-sync-row">
                  <div className="sync-row-identity">
                    <span className="sync-amt">{tx.amount}</span>
                    <span className="sync-net-tag">{tx.network} Pipeline</span>
                  </div>
                  <div className="sync-row-status-metrics">
                    <span className={`sync-status-txt ${tx.status === "Credited" ? "text-green" : "text-gold"}`}>
                      {tx.status === "Credited" ? "Settled" : `Confirming (${tx.confirms})`}
                    </span>
                    <span className="sync-time-stamp">
                      {tx.time}
                      <ExternalLink size={10} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= OVERLAY MODAL ================= */}
      {showOverlay && (
        <div className="deposit-overlay">
          <div className="deposit-modal">
            <button className="overlay-close-btn" onClick={handleCloseOverlay}>
              <X size={18} />
            </button>

            {!paymentSubmitted ? (
              <>
                <h3>Complete Your Deposit</h3>
                
                {/* Amount Input */}
                <div className="deposit-amount-input-group">
                  <label>Deposit Amount (USD)</label>
                  <input
                    type="number"
                    min="200"
                    step="0.01"
                    placeholder="Minimum $200"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="deposit-amount-input"
                    disabled={loading}
                  />
                  {depositAmount && parseFloat(depositAmount) < 200 && (
                    <span className="amount-error-text">⚠️ Minimum deposit is $200</span>
                  )}
                </div>

                {/* Screenshot Upload */}
                <div className="screenshot-upload-group">
                  <label>Upload Transaction Screenshot</label>
                  
                  {!screenshotPreview ? (
                    <div className="screenshot-upload-box" onClick={handleUploadClick}>
                      <ImageIcon size={24} className="text-gold" />
                      <span>Click to upload screenshot</span>
                      <span className="upload-hint">JPG, PNG, WEBP (max 5MB)</span>
                    </div>
                  ) : (
                    <div className="screenshot-preview-box">
                      <img src={screenshotPreview} alt="Transaction preview" className="screenshot-preview-image" />
                      <button type="button" className="screenshot-remove-btn" onClick={handleRemoveScreenshot} disabled={loading}>
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  )}
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotChange}
                    className="hidden-file-input"
                    disabled={loading}
                  />
                  {uploadError && <span className="amount-error-text">{uploadError}</span>}
                </div>

                <button
                  className="payment-confirm-btn"
                  onClick={handlePaymentConfirmation}
                  disabled={parseFloat(depositAmount) < 200 || !screenshotFile || loading}
                >
                  {loading ? "Submitting to Admin..." : "I Have Sent the Funds"}
                </button>
              </>
            ) : (
              <div className="payment-success-box">
                <CheckCircle2 size={50} className="success-icon" />
                <h3>Request Submitted!</h3>
                <p>Your deposit of ${parseFloat(depositAmount).toFixed(2)} {currentTicker} is pending admin approval.</p>
                
                {/* ✅ Countdown starts AFTER submission */}
                <div className="countdown-container" style={{ marginTop: "20px" }}>
                  <Clock size={16} className="text-gold" />
                  <span>Admin approval window:</span>
                  <span className="countdown-timer">{formatTime(countdown)}</span>
                </div>
                
                {/* ✅ Polling Status Display */}
                <div style={{ 
                  marginTop: "15px", 
                  padding: "12px", 
                  background: "rgba(74, 222, 128, 0.1)", 
                  borderRadius: "8px",
                  fontSize: "13px",
                  color: "#4ade80"
                }}>
                  <p style={{ margin: 0, fontWeight: 600 }}> {pollingActive ? "Polling for approval..." : "Waiting for polling to start..."}</p>
                  <p style={{ margin: "6px 0 0 0", fontSize: "11px", opacity: 0.8 }}>Deposit ID: {depositId ? `${depositId.slice(0, 8)}...` : "N/A"}</p>
                  <p style={{ margin: "6px 0 0 0", fontSize: "11px", opacity: 0.8 }}>Auto-redirects when status changes to "Confirmed"</p>
                </div>
                
                <p className="redirect-text" style={{ color: "#4ade80", fontWeight: "500", marginTop: "15px" }}>
                  ⏳ Waiting for admin approval...<br/>
                  You will be auto-redirected when approved!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Deposit;