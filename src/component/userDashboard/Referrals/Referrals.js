import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import { auth } from '../../../firebase';
import { Copy, CheckCircle2, Users, DollarSign } from 'lucide-react';
import "./Referrals.css";

const Referrals = () => {
  const [user, setUser] = useState(null);
  const [referralCode, setReferralCode] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [stats, setStats] = useState({ count: 0, earnings: 0 });
  const [referrals, setReferrals] = useState([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const code = `ERAX-${user.uid.substring(0, 7).toUpperCase()}`;
        setReferralCode(code);
        setReferralLink(`https://erax.investment/register?ref=${code}`);

        try {
          const res = await axios.get(`http://localhost:5000/api/identity/dashboard-metrics?email=${user.email}`);
          // TODO: Replace with real referral API when backend is ready
          setStats({ count: 0, earnings: 0 });
          setReferrals([]);
        } catch (err) {
          console.error("Failed to load referrals:", err);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Copy referral link
  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Share via native share API
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'Join eraX',
        text: 'Earn rewards by inviting friends to eraX',
        url: referralLink
      });
    } else {
      handleCopy();
    }
  };

  if (loading) return <div className="referrals-container"><p>Loading...</p></div>;
  if (!user) return <div className="referrals-container"><p>Please log in to view referrals.</p></div>;

  return (
    <div className="referrals-container">
      <h2>Refer & Earn</h2>
      <p className="subtitle">Invite friends and earn 10% commission on their deposits</p>

      {/* Referral Link Card */}
      <div className="link-card">
        <div className="link-row">
          <code>{referralLink}</code>
          <button onClick={handleCopy} className="copy-btn">
            {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
          </button>
        </div>
        {copied && <span className="copied-msg">✓ Copied to clipboard</span>}
        <button onClick={handleShare} className="share-btn">📤 Share Link</button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <Users size={20} />
          <div>
            <span>Referrals</span>
            <strong>{stats.count}</strong>
          </div>
        </div>
        <div className="stat-card">
          <DollarSign size={20} />
          <div>
            <span>Earnings</span>
            <strong>${stats.earnings.toFixed(2)}</strong>
          </div>
        </div>
      </div>

      {/* Recent Referrals List */}
      <div className="referrals-list">
        <h3>Recent Referrals</h3>
        {referrals.length > 0 ? (
          referrals.map((ref) => (
            <div key={ref.id} className="referral-item">
              <span>@{ref.username}</span>
              <span className="referral-date">{ref.date}</span>
              <span className="referral-earnings">+${ref.earned}</span>
            </div>
          ))
        ) : (
          <p className="empty-msg">No referrals yet. Share your link to get started!</p>
        )}
      </div>

      {/* Commission Info */}
      <div className="info-note">
        <strong>How it works:</strong><br/>
        • 10 Friends sign up using your link get 10$<br/>
        • 20 Friends sign up using your link get 20$<br/>
        • They make a deposit (min $200) you get 3%<br/>
        • Earnings are credited instantly
      </div>
    </div>
  );
};

export default Referrals;