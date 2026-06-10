import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import { auth } from '../../../firebase';
import { 
  DollarSign, Clock, CheckCircle2, AlertCircle, 
  RefreshCw, Building2, User, CreditCard, Shield 
} from 'lucide-react';
import "./withdraw.css";

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Withdraw = () => {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [maxWithdrawal, setMaxWithdrawal] = useState(0);
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Eligibility state
  const [eligible, setEligible] = useState(false);
  const [eligibilityMessage, setEligibilityMessage] = useState('');
  const [daysRemaining, setDaysRemaining] = useState(0);
  
  // Countdown state
  const [showCountdown, setShowCountdown] = useState(false);
  const [withdrawalId, setWithdrawalId] = useState(null);
  const [countdownEndsAt, setCountdownEndsAt] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState({ minutes: 20, seconds: 0 });
  const [withdrawalStatus, setWithdrawalStatus] = useState('pending');
  
  // Success state
  const [showSuccess, setShowSuccess] = useState(false);

  // Load user and check eligibility
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await loadUserData(user.email);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loadUserData = async (email) => {
    try {
      // Load balance
      const metricsRes = await axios.get(`${API_BASE}/api/identity/dashboard-metrics?email=${email}`);
      const availableBalance = metricsRes.data.balances?.availableLiquidity || 0;
      setBalance(availableBalance);
      setMaxWithdrawal(availableBalance * 0.5);

      // Check eligibility
      const eligibilityRes = await axios.get(`${API_BASE}/api/withdrawal/check-eligibility/${email}`);
      if (eligibilityRes.data.success) {
        setEligible(eligibilityRes.data.eligible);
        setEligibilityMessage(eligibilityRes.data.message);
        if (eligibilityRes.data.daysRemaining) {
          setDaysRemaining(eligibilityRes.data.daysRemaining);
        }
      }
    } catch (err) {
      console.error("Failed to load user data:", err);
      setError("Failed to load account information");
    }
  };

  // Countdown timer
  useEffect(() => {
    if (!showCountdown || !countdownEndsAt) return;

    const interval = setInterval(() => {
      const now = new Date();
      const end = new Date(countdownEndsAt);
      const diff = end - now;

      if (diff <= 0) {
        setTimeRemaining({ minutes: 0, seconds: 0 });
        clearInterval(interval);
        return;
      }

      const minutes = Math.floor(diff / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeRemaining({ minutes, seconds });

      // Check withdrawal status every 10 seconds
      if (withdrawalId) {
        checkWithdrawalStatus();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [showCountdown, countdownEndsAt, withdrawalId]);

  const checkWithdrawalStatus = async () => {
    if (!withdrawalId || !user) return;

    try {
      const response = await axios.get(`${API_BASE}/api/withdrawal/status/${withdrawalId}?email=${user.email}`);
      if (response.data.success) {
        const status = response.data.withdrawal.status;
        setWithdrawalStatus(status);
        
        if (status === 'completed') {
          setShowSuccess(true);
          setShowCountdown(false);
        }
      }
    } catch (err) {
      console.error("Failed to check status:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!amount || !accountNumber || !bankName || !accountName) {
      setError("Please fill all fields");
      return;
    }

    const amountNum = parseFloat(amount);
    if (amountNum > maxWithdrawal) {
      setError(`Maximum withdrawal is $${maxWithdrawal.toFixed(2)} (50% of balance)`);
      return;
    }

    if (amountNum < 50) {
      setError("Minimum withdrawal is $50");
      return;
    }

    setSubmitting(true);

    try {
      const response = await axios.post(`${API_BASE}/api/withdrawal/request`, {
        email: user.email,
        amount: amountNum,
        accountNumber: accountNumber,
        bankName: bankName,
        accountName: accountName
      });

      if (response.data.success) {
        setWithdrawalId(response.data.withdrawal.id);
        setCountdownEndsAt(response.data.withdrawal.countdownEndsAt);
        setShowCountdown(true);
        setWithdrawalStatus('pending');
        
        // Clear form
        setAmount('');
        setAccountNumber('');
        setBankName('');
        setAccountName('');
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit withdrawal request");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetMax = () => {
    setAmount(maxWithdrawal.toFixed(2));
  };

  if (loading) {
    return (
      <div className="withdraw-container">
        <div className="loading-state">
          <RefreshCw className="spin" size={24} />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="withdraw-container">
        <div className="error-state">
          <AlertCircle size={24} />
          <p>Please log in to withdraw funds.</p>
        </div>
      </div>
    );
  }

  // Success screen
  if (showSuccess) {
    return (
      <div className="withdraw-container">
        <div className="success-screen">
          <div className="success-icon">
            <CheckCircle2 size={64} />
          </div>
          <h2>Withdrawal Completed!</h2>
          <p>Your funds have been successfully transferred to your bank account.</p>
          <div className="success-details">
            <div className="detail-row">
              <span>Amount:</span>
              <strong>${parseFloat(amount).toFixed(2)}</strong>
            </div>
            <div className="detail-row">
              <span>Bank:</span>
              <strong>{bankName}</strong>
            </div>
            <div className="detail-row">
              <span>Account:</span>
              <strong>{accountNumber.substring(0, 4)}****</strong>
            </div>
          </div>
          <button 
            className="btn-primary"
            onClick={() => {
              setShowSuccess(false);
              loadUserData(user.email);
            }}
          >
            Make Another Withdrawal
          </button>
        </div>
      </div>
    );
  }

  // Countdown screen
  if (showCountdown) {
    return (
      <div className="withdraw-container">
        <div className="countdown-screen">
          <div className="countdown-header">
            <Clock size={48} />
            <h2>Processing Your Withdrawal</h2>
          </div>
          
          <div className="countdown-timer">
            <div className="time-unit">
              <span className="time-value">{String(timeRemaining.minutes).padStart(2, '0')}</span>
              <span className="time-label">Minutes</span>
            </div>
            <span className="time-separator">:</span>
            <div className="time-unit">
              <span className="time-value">{String(timeRemaining.seconds).padStart(2, '0')}</span>
              <span className="time-label">Seconds</span>
            </div>
          </div>

          <div className="countdown-info">
            <p>Your withdrawal request is being processed by our admin team.</p>
            <p>Please keep this window open. The timer will automatically update when your transfer is complete.</p>
          </div>

          <div className="countdown-details">
            <div className="detail-row">
              <span>Amount:</span>
              <strong>${parseFloat(amount).toFixed(2)}</strong>
            </div>
            <div className="detail-row">
              <span>Bank:</span>
              <strong>{bankName}</strong>
            </div>
            <div className="detail-row">
              <span>Account:</span>
              <strong>{accountNumber.substring(0, 4)}****</strong>
            </div>
            <div className="detail-row">
              <span>Status:</span>
              <strong className={`status-${withdrawalStatus}`}>
                {withdrawalStatus === 'pending' && '⏳ Pending'}
                {withdrawalStatus === 'processing' && '🔄 Processing'}
                {withdrawalStatus === 'completed' && '✅ Completed'}
              </strong>
            </div>
          </div>

          <div className="countdown-note">
            <Shield size={16} />
            <span>All transactions are secured and encrypted</span>
          </div>
        </div>
      </div>
    );
  }

  // Main withdrawal form
  return (
    <div className="withdraw-container">
      <div className="withdraw-header">
        <h2>Withdraw Funds</h2>
        <p className="withdraw-subtitle">Transfer funds to your bank account</p>
      </div>
      
      <div className="balance-card">
        <div className="balance-info">
          <DollarSign size={20} />
          <div>
            <span>Available Balance</span>
            <strong>${balance.toFixed(2)}</strong>
          </div>
        </div>
        <div className="max-withdrawal">
          <span>Max Withdrawal (50%)</span>
          <strong>${maxWithdrawal.toFixed(2)}</strong>
        </div>
      </div>

      {!eligible && (
        <div className="eligibility-warning">
          <AlertCircle size={20} />
          <div>
            <strong>Not Eligible Yet</strong>
            <p>{eligibilityMessage}</p>
            {daysRemaining > 0 && (
              <p className="days-remaining">
                <Clock size={14} /> {daysRemaining} days remaining
              </p>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="error-message">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="withdraw-form">
        <div className="form-section">
          <label>Withdrawal Amount (USD)</label>
          <div className="amount-input-group">
            <span className="currency-symbol">$</span>
            <input
              type="number"
              step="0.01"
              min="50"
              max={maxWithdrawal}
              placeholder={`Min $50 • Max $${maxWithdrawal.toFixed(2)}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={!eligible}
              required
            />
            <button 
              type="button" 
              className="btn-max" 
              onClick={handleSetMax}
              disabled={!eligible}
            >
              MAX
            </button>
          </div>
          <p className="input-hint">You can withdraw up to 50% of your balance</p>
        </div>

        <div className="form-section">
          <label><CreditCard size={14} /> Account Number</label>
          <input
            type="text"
            placeholder="Enter your bank account number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            disabled={!eligible}
            required
          />
        </div>

        <div className="form-section">
          <label><Building2 size={14} /> Bank Name</label>
          <input
            type="text"
            placeholder="Enter your bank name"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            disabled={!eligible}
            required
          />
        </div>

        <div className="form-section">
          <label><User size={14} /> Account Name</label>
          <input
            type="text"
            placeholder="Enter account holder name"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            disabled={!eligible}
            required
          />
        </div>

        <button 
          type="submit" 
          className="btn-submit"
          disabled={submitting || !eligible || !amount || !accountNumber || !bankName || !accountName}
        >
          {submitting ? (
            <>
              <RefreshCw size={16} className="spin" />
              Processing...
            </>
          ) : (
            <>
              <DollarSign size={16} />
              Submit Withdrawal Request
            </>
          )}
        </button>
      </form>

      <div className="withdraw-info">
        <div className="info-item">
          <Clock size={16} />
          <span>Processing time: 20 minutes max</span>
        </div>
        <div className="info-item">
          <Shield size={16} />
          <span>All withdrawals are secured and encrypted</span>
        </div>
        <div className="info-item">
          <AlertCircle size={16} />
          <span>Admin will review and process your request</span>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;