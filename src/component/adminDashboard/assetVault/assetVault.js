import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Coins, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShieldCheck, 
  RefreshCw, 
  Layers, 
  ExternalLink, 
  TrendingUp,
  Download,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import "./assetVault.css";

import { API_ENDPOINTS } from "../../config/api";

// Create axios instance with auth token
const adminApi = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default function AssetVault() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Real data from database
  const [vaultBalances, setVaultBalances] = useState([]);
  const [totals, setTotals] = useState({
    totalValue: 0,
    totalValueFormatted: '$0.00',
    hotWalletValue: 0,
    hotWalletFormatted: '$0.00',
    coldStorageValue: 0,
    coldStorageFormatted: '$0.00',
    hotPercentage: 0,
    coldPercentage: 0
  });
  const [pendingSettlements, setPendingSettlements] = useState([]);
  const [assetCount, setAssetCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setError('No authentication token. Please log in again.');
      setLoading(false);
      setTimeout(() => {
        window.location.href = '/adminLogin';
      }, 2000);
      return;
    }
    
    fetchVaultData();
  }, []);

  const fetchVaultData = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log("🏦 Fetching real vault data from database...");
      
      const response = await adminApi.get('/api/admin/vault/balances');
      
      console.log("✅ Vault data received:", response.data);
      
      setVaultBalances(response.data.vaultBalances || []);
      setTotals(response.data.totals || {});
      setPendingSettlements(response.data.pendingSettlements || []);
      setAssetCount(response.data.assetCount || 0);
      
    } catch (err) {
      console.error("❌ Failed to load vault data:", err);
      console.error("❌ Error response:", err.response?.data);
      
      if (err.response?.status === 401) {
        setError('Session expired. Redirecting to login...');
        localStorage.removeItem('adminToken');
        setTimeout(() => {
          window.location.href = '/adminLogin';
        }, 2000);
      } else {
        setError(err.response?.data?.message || "Failed to load vault data from database.");
      }
    } finally {
      setLoading(false);
    }
  };

  const triggerAuditSync = async () => {
    setIsSyncing(true);
    await fetchVaultData();
    setTimeout(() => setIsSyncing(false), 500);
  };

  const handleLiquiditySweep = async () => {
    if (!window.confirm('Execute liquidity sweep from hot to cold storage?')) return;
    
    try {
      await adminApi.post('/api/admin/vault/sweep', {
        asset: 'USDT',
        amount: 10000
      });
      
      alert('✅ Liquidity sweep executed successfully');
      await fetchVaultData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to execute sweep');
    }
  };

  const handleProvisionLiquidity = async () => {
    if (!window.confirm('Provision hot liquidity for emergency transactions?')) return;
    
    try {
      await adminApi.post('/api/admin/vault/provision', {
        asset: 'USDT',
        amount: 5000,
        reason: 'Emergency provisioning'
      });
      
      alert('✅ Hot liquidity provisioned successfully');
      await fetchVaultData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to provision liquidity');
    }
  };

  if (loading) {
    return (
      <div className="vault-system-workspace">
        <div className="loading-state">
          <Loader2 size={32} className="spin" />
          <p>Loading vault data from database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vault-system-workspace">
        <div className="error-state">
          <AlertTriangle size={32} className="text-red" />
          <p>{error}</p>
          <button onClick={fetchVaultData} className="btn-retry">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="vault-system-workspace">
      
      {/* ===== HEADER METRICS SUB-FRAME ===== */}
      <header className="vault-header">
        <div className="vault-header-meta">
          <h1>Asset Vault Matrix</h1>
          <p>Real-time institutional liquidity settlement ledgers from database.</p>
        </div>
        <button 
          type="button" 
          className={`vault-sync-btn ${isSyncing ? "processing" : ""}`}
          onClick={triggerAuditSync}
          disabled={isSyncing}
        >
          <RefreshCw size={14} className={isSyncing ? 'spin' : ''} />
          <span>{isSyncing ? "Auditing Nodes..." : "Audit Cryptographic Reserves"}</span>
        </button>
      </header>

      {/* ===== GLOBAL RESERVES AGGREGATOR ===== */}
      <section className="vault-aggregate-strip">
        <div className="aggregate-node">
          <div className="node-label">Total Vault Liquidity (USD Equivalent)</div>
          <div className="node-main-val">
            <h2>{totals.totalValueFormatted}</h2>
            <span className="reserve-health-badge">
              <ShieldCheck size={12} /> 100% Backed Reserves
            </span>
          </div>
        </div>
        <div className="aggregate-split-stats">
          <div className="stat-pill">
            <span className="pill-lbl">Cold Isolation ({totals.coldPercentage}%)</span>
            <span className="pill-val">{totals.coldStorageFormatted}</span>
          </div>
          <div className="stat-pill">
            <span className="pill-lbl">Hot Web API Buffer ({totals.hotPercentage}%)</span>
            <span className="pill-val">{totals.hotWalletFormatted}</span>
          </div>
        </div>
      </section>

      {/* ===== MASTER ASSETS INTERACTIVE TABLE MATRIX ===== */}
      <section className="vault-matrix-block">
        <div className="block-title-row">
          <h3>Cryptographic Asset Allocations</h3>
          <span className="matrix-counter">{assetCount} Active Pipelines</span>
        </div>
        
        <div className="vault-responsive-table">
          <table className="vault-data-table">
            <thead>
              <tr>
                <th>Asset / Protocol</th>
                <th>Total Controlled Reserves</th>
                <th>Estimated Value (USD)</th>
                <th>Hot API Buffer Wallet</th>
                <th>Isolated Cold Storage</th>
                <th>Primary Settlement Node Address</th>
                <th>Node Integrity</th>
              </tr>
            </thead>
            <tbody>
              {vaultBalances.length > 0 ? (
                vaultBalances.map((item, index) => (
                  <tr key={index} className="vault-data-row-item">
                    <td className="asset-profile-cell">
                      <div className="asset-ticker-badge">{item.asset}</div>
                      <span className="asset-net-string">{item.network}</span>
                    </td>
                    <td className="monospace-data-field text-highlight">
                      {item.totalFormatted}
                    </td>
                    <td className="monospace-data-field fiat-green">
                      {item.fiatValueFormatted}
                    </td>
                    <td className="monospace-data-field">
                      {item.hotWalletFormatted}
                    </td>
                    <td className="monospace-data-field text-muted">
                      {item.coldStorageFormatted}
                    </td>
                    <td className="address-hash-cell">
                      <code>{item.address}</code>
                    </td>
                    <td>
                      <span className="integrity-tag-secure">{item.status}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-vault">
                    No vault data available. Confirm deposits to populate vault.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ===== SPLIT MANAGEMENT OVERLAYS ===== */}
      <div className="vault-bottom-split-grid">
        
        {/* LEFT FLANK: INTERNAL REBALANCING ENGINE */}
        <div className="vault-action-control-panel">
          <div className="panel-header-flat">
            <h3>Automated Liquidity Sweeper</h3>
            <p>Manually rebalance surplus assets from hot wallet to cold storage.</p>
          </div>
          <div className="action-button-stack">
            <button 
              type="button" 
              className="vault-prime-action-btn sweep-action"
              onClick={handleLiquiditySweep}
            >
              <Layers size={16} />
              <div className="btn-txt-wrapper">
                <span className="btn-title">Execute Surplus Sweep</span>
                <span className="btn-desc">Consolidate hot buffer to cold vault</span>
              </div>
            </button>
            <button 
              type="button" 
              className="vault-prime-action-btn provision-action"
              onClick={handleProvisionLiquidity}
            >
              <Download size={16} />
              <div className="btn-txt-wrapper">
                <span className="btn-title">Provision Hot Liquidity</span>
                <span className="btn-desc">Authorize emergency outbound transactions</span>
              </div>
            </button>
          </div>
        </div>

        {/* RIGHT FLANK: SETTLEMENT QUEUE MONITOR */}
        <div className="vault-queue-panel">
          <div className="panel-header-flat">
            <h3>High-Volume Settlement Queue</h3>
            <p>Awaiting confirmation before ledger execution.</p>
          </div>
          <div className="queue-list-stack">
            {pendingSettlements.length > 0 ? (
              pendingSettlements.map((item) => (
                <div key={item.id} className="queue-row-card">
                  <div className="queue-id-profile">
                    <span className="q-id-tag">{item.id}</span>
                    <span className="q-amt-string">{item.amount} {item.asset}</span>
                  </div>
                  <div className="queue-meta-metrics">
                    <span className="q-status-bubble">{item.status}</span>
                    <span className={`q-risk-factor ${item.risk.toLowerCase()}`}>
                      {item.risk === "Elevated" && <AlertTriangle size={10} />} {item.risk} Risk
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-queue">
                <p>No pending settlements in queue.</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}