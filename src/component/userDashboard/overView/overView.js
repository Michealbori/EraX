import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import { auth } from "../../../firebase";
import './overView.css';

import { API_ENDPOINTS } from "../../config/api";

const MetricCard = ({ title, value, change, isPositive, subtitle }) => (
  <div className="metric-card">
    <span className="metric-title">{title}</span>
    <h3 className="metric-value">{value}</h3>
    <div className="metric-meta">
      <span className={`metric-change ${isPositive ? 'positive' : 'negative'}`}>
        {isPositive ? '▲' : '▼'} {change}
      </span>
      <span className="metric-subtitle">{subtitle}</span>
    </div>
  </div>
);

const Overview = () => {
  const [timeframe, setTimeframe] = useState('1M');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [financials, setFinancials] = useState({
    totalPortfolio: 0,
    netProfitLoss: 0,
    availableLiquidity: 0
  });

  const [allocationData, setAllocationData] = useState({
    stocks: 0,
    bonds: 0,
    commodities: 0
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser({
          name: user.displayName || user.email.split('@')[0],
          email: user.email,
          photo: user.photoURL
        });

        await fetchDashboardData(user.email);
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchDashboardData = async (email) => {
    try {
      console.log("📊 Fetching dashboard data for:", email);
      
      const response = await axios.get(`${API_BASE}/api/identity/dashboard-metrics`, {
        params: { email }
      });

      console.log("✅ Dashboard data received:", response.data);

      if (response.data.success) {
        setFinancials(response.data.balances || {
          totalPortfolio: 0,
          netProfitLoss: 0,
          availableLiquidity: 0
        });
        
        setAllocationData(response.data.allocations || {
          stocks: 0,
          bonds: 0,
          commodities: 0
        });
      }
    } catch (err) {
      console.error("❌ Failed to fetch dashboard data:", err);
      console.error("❌ Error response:", err.response?.data);
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const total = financials.totalPortfolio;
  
  const assets = [
    { 
      name: 'Stocks', 
      allocation: allocationData.stocks || 0,
      value: total > 0 ? (total * (allocationData.stocks || 0) / 100) : 0,
      color: '#f3ba2f' 
    },
    { 
      name: 'Bonds', 
      allocation: allocationData.bonds || 0,
      value: total > 0 ? (total * (allocationData.bonds || 0) / 100) : 0,
      color: '#627eea' 
    },
    { 
      name: 'Commodities', 
      allocation: allocationData.commodities || 0,
      value: total > 0 ? (total * (allocationData.commodities || 0) / 100) : 0,
      color: '#26a17b' 
    }
  ];

  if (loading) {
    return (
      <div className="overview-workspace" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#94A3B8' }}>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="overview-workspace" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#f87171' }}>
          <p>{error}</p>
          <button onClick={() => fetchDashboardData(currentUser?.email)} style={{ marginTop: '10px', padding: '8px 16px', background: '#1e293b', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="overview-workspace">
      <div className="overview-main-col">
        
        {/* Metrics Grid */}
        <section className="metrics-grid">
          <MetricCard 
            title="Total Portfolio Value" 
            value={`$${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
            change={total > 0 ? "+12.4%" : "0.0%"} 
            isPositive={true} 
            subtitle="this month" 
          />
          <MetricCard 
            title="Net Profit / Loss" 
            value={`${financials.netProfitLoss >= 0 ? '+' : ''}$${financials.netProfitLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
            change={financials.netProfitLoss !== 0 ? "+4.2%" : "0.0%"} 
            isPositive={financials.netProfitLoss >= 0} 
            subtitle="past 24h" 
          />
          <MetricCard 
            title="Available Liquidity" 
            value={`$${financials.availableLiquidity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
            change={financials.availableLiquidity > 0 ? "-0.8%" : "0.0%"} 
            isPositive={true} 
            subtitle="unallocated" 
          />
        </section>

        {/* Chart */}
        <section className="chart-container-card">
          <div className="chart-header">
            <div className="chart-title-block">
              <h4>Performance Analytics</h4>
              <p>Growth trajectory of aggregated capital positions</p>
            </div>
            <div className="timeframe-selectors">
              {['1D', '1W', '1M', '1Y', 'ALL'].map((tf) => (
                <button 
                  key={tf} 
                  className={`tf-btn ${timeframe === tf ? 'active' : ''}`}
                  onClick={() => setTimeframe(tf)}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
          
          <div className="analytics-chart-viewport">
            <svg viewBox="0 0 800 220" className="vector-trendline">
              <defs>
                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f3ba2f" stopOpacity={total > 0 ? "0.15" : "0.05"} />
                  <stop offset="100%" stopColor="#f3ba2f" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {total > 0 ? (
                <>
                  <path d="M0,180 Q150,140 300,90 T600,60 T800,30 L800,220 L0,220 Z" fill="url(#chartGlow)" />
                  <path d="M0,180 Q150,140 300,90 T600,60 T800,30" fill="none" stroke="#f3ba2f" strokeWidth="3" />
                </>
              ) : (
                <>
                  <path d="M0,180 L800,180 L800,220 L0,220 Z" fill="url(#chartGlow)" />
                  <line x1="0" y1="180" x2="800" y2="180" stroke="rgba(243, 186, 47, 0.3)" strokeWidth="2" strokeDasharray="4 4" />
                </>
              )}
            </svg>
          </div>
        </section>

        {/* Active Pools */}
        <section className="active-pools-card">
          <h4 className="card-inner-title">Active Fixed-Yield Positions</h4>
          <div className="pools-table">
            <div className="pool-row header">
              <span>Strategy Pool</span>
              <span>Maturity</span>
              <span>Expected APY</span>
              <span>Current Value</span>
            </div>
            
            {total > 0 ? (
              <>
                <div className="pool-row">
                  <span className="pool-name">⚡ Alpha Smart Yield V4</span>
                  <span className="pool-meta">28 Days Left</span>
                  <span className="pool-yield text-gold">14.2% APY</span>
                  <span className="pool-amount">$12,000.00</span>
                </div>
                <div className="pool-row">
                  <span className="pool-name">🛡️ USD Stable-Premium Core</span>
                  <span className="pool-meta">140 Days Left</span>
                  <span className="pool-yield text-gold">8.5% APY</span>
                  <span className="pool-amount">$5,450.00</span>
                </div>
              </>
            ) : (
              <div className="pool-row text-center" style={{ padding: '24px', justifyContent: 'center', color: '#475569' }}>
                No deployed positions detected.
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Right Column */}
      <div className="overview-side-col">
        
        {/* Allocation */}
        <div className="allocation-mix-card">
          <h4>Asset Allocation</h4>
          <p>Distribution percentage across network verticals</p>
          
          <div className="allocation-bars-stack">
            {assets.map((asset, i) => (
              <div key={i} className="allocation-progress-item">
                <div className="item-labels">
                  <span className="asset-label-name">
                    <span className="color-dot" style={{ backgroundColor: asset.color }}></span>
                    {asset.name}
                  </span>
                  <span className="asset-label-values">
                    {asset.allocation}% (${asset.value.toFixed(2)})
                  </span>
                </div>
                <div className="progress-bar-track">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${asset.allocation}%`, backgroundColor: asset.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Info */}
        {currentUser && (
          <div className="signals-card" style={{ marginTop: '20px', borderTop: '2px solid #f3ba2f' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {currentUser.photo ? (
                <img 
                  src={currentUser.photo} 
                  alt="Avatar" 
                  style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #f3ba2f' }} 
                />
              ) : (
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #f3ba2f', backgroundColor: 'rgba(243, 186, 47, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f3ba2f', fontWeight: 'bold' }}>
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h5 style={{ color: '#ffffff', margin: 0, fontSize: '0.95rem' }}>{currentUser.name}</h5>
                <p style={{ color: '#26a17b', margin: '2px 0 0 0', fontSize: '0.78rem' }}>● System Node Active</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Overview;