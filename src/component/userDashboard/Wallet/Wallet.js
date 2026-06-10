import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import { auth } from '../../../firebase';
import { 
  Wallet as WalletIcon, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw, 
  Copy, 
  CheckCircle2, 
  Eye, 
  Plus 
} from 'lucide-react';
import "./Wallet.css";

const Wallet = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  // Dynamic Financial State Nodes loaded directly from your MongoDB via backend API
  const [financials, setFinancials] = useState({
    totalPortfolio: 0.00,
    netProfitLoss: 0.00,
    availableLiquidity: 0.00
  });

  // Transaction state tracks empty initially until deposit hooks record movement data
  const [recentTransactions, setRecentTransactions] = useState([]);

  // ==========================================================================
  // REAL-TIME AUTHENTICATION TRACKER & LIQUIDITY FETCH PIPELINE
  // ==========================================================================
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          email: user.email
        });

        // FETCH REAL WALLET VALUES: Connect directly to your backend Express node
        try {
          const response = await axios.get(`http://localhost:5000/api/identity/dashboard-metrics?email=${user.email}`);
          if (response.data) {
            setFinancials(response.data.balances);
            
            // Temporary dynamic mockup of transactions array conditional on having a balance:
            if (response.data.balances.availableLiquidity > 0) {
              setRecentTransactions([
                { 
                  id: 'TX-9021', 
                  type: 'Deposit', 
                  asset: 'USDT', 
                  amount: `+${response.data.balances.availableLiquidity.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 
                  date: 'Recent Settlement', 
                  status: 'Completed', 
                  isCredit: true 
                }
              ]);
            } else {
              setRecentTransactions([]);
            }
          }
        } catch (err) {
          console.error("Backend wallet communication error, staying at baseline zero:", err.message);
          // Gracefully falls back to zeroes if the backend is down or account is fresh
        } finally {
          setLoadingMetrics(false);
        }
      } else {
        setCurrentUser(null);
        setLoadingMetrics(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const copyAddress = () => {
    navigator.clipboard.writeText('0x71C2293297489394A3B8f3ba2fC71CB29');
    alert('Wallet destination key copied to clipboard.');
  };

  // Dynamically map balances based on true backend liquidity context strings
  const liquidity = financials.availableLiquidity;
  const walletBalances = [
    { 
      id: 1, 
      currency: 'USDT', 
      name: 'Tether USD Wallet', 
      amount: liquidity > 0 ? liquidity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00', 
      fiatValue: `$${liquidity > 0 ? liquidity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}`, 
      network: 'TRC-20 / ERC-20 Node' 
    },
    { 
      id: 2, 
      currency: 'USD', 
      name: 'Fiat Capital Balance', 
      amount: '0.00', 
      fiatValue: '$0.00', 
      network: 'FedWire / ACH' 
    }
  ];

  if (loadingMetrics) {
    return (
      <div className="erax-dashboard-wrapper flex items-center justify-center" style={{ minHeight: '80vh', color: '#94A3B8' }}>
        <div className="text-center">
          <p className="font-mono text-sm animate-pulse text-[#f3ba2f]">SYNCHRONIZING LIQUIDITY WALLET VAULT...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="erax-dashboard-wrapper">
      
      {/* 1. PRIMARY METRIC STRIP */}
      <div className="erax-stats-strip wallet-hero-grid">
        <div className="erax-stat-node wallet-main-card">
          <div className="wallet-card-header">
            <span className="erax-node-label"><WalletIcon size={14} /> Total Combined Net Liquidity</span>
            <span className="secure-badge"><Eye size={12} /> Verified Asset Balance</span>
          </div>
          <div className="wallet-balance-hero">
            <h2>${liquidity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
            <span className="currency-tag">USD Value</span>
          </div>
        </div>
      </div>

      {/* 2. DUAL INDUSTRIAL WORKSPACE MATRIX */}
      <div className="erax-split-workspace">
        
        {/* LEFT COLUMN: CURRENCY NODES & TRANSFERS */}
        <div className="erax-workspace-panel main-ledger-panel">
          <div className="panel-header-action">
            <div>
              <h3 className="panel-title">Available Balances</h3>
              <p className="panel-subtitle">Liquid funds ready for deployment</p>
            </div>
            <button className="live-pulse-container btn-add-wallet" style={{ border: '1px solid rgba(255,255,255,0.05)', background: 'transparent', cursor: 'pointer' }}>
              <Plus size={14} /> Link Account
            </button>
          </div>

          <div className="holdings-table-container">
            {walletBalances.map((balance) => (
              <div key={balance.id} className="holding-row-card wallet-balance-row">
                <div className={`holding-icon-box ${balance.id === 2 ? 'bonds-tint' : 'stocks-tint'}`} style={{ backgroundColor: liquidity > 0 || balance.id !== 1 ? '' : 'rgba(255,255,255,0.02)' }}>
                  <span className="currency-symbol-txt" style={{ color: liquidity > 0 || balance.id !== 1 ? '#f3ba2f' : '#475569' }}>{balance.currency}</span>
                </div>

                <div className="holding-identity-cell">
                  <h4>{balance.name}</h4>
                  <span>Network: {balance.network}</span>
                </div>

                <div className="holding-data-cell text-right">
                  <span className="cell-top market-value" style={{ color: liquidity > 0 && balance.id === 1 ? '#ffffff' : '#475569' }}>
                    {balance.amount} {balance.currency}
                  </span>
                  <span className="cell-bottom wallet-fiat-subtitle">{balance.fiatValue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: ACTION CONTROLLERS & INTERFACE */}
        <div className="erax-workspace-panel analytics-side-panel">
          
          {/* QUICK TRANSFERS PANEL */}
          <div className="inner-analytics-card premium-action-card wallet-action-card">
            <h4 className="card-inner-title"><RefreshCw size={16} /> Quick Funds Transfer</h4>
            <p className="terminal-desc">Move capital instantly between your cash balances and investment accounts.</p>
            
            <div className="wallet-action-row-buttons">
              <button className="wallet-action-btn"><ArrowDownLeft size={16} /> Deposit</button>
              <button className="wallet-action-btn" disabled={liquidity === 0} style={{ opacity: liquidity > 0 ? 1 : 0.4, cursor: liquidity > 0 ? 'pointer' : 'not-allowed' }}><ArrowUpRight size={16} /> Withdraw</button>
              <button className="wallet-action-btn" disabled={liquidity === 0} style={{ opacity: liquidity > 0 ? 1 : 0.4, cursor: liquidity > 0 ? 'pointer' : 'not-allowed' }}><RefreshCw size={14} /> Swap</button>
            </div>
          </div>

          {/* FUNDING DESTINATION CARD */}
          <div className="inner-analytics-card wallet-address-card">
            <div className="address-card-header">
              <h5>Fast Funding Key (USDT)</h5>
              <span className="network-pill">ERC-20 / TRC-20</span>
            </div>
            <div className="address-copy-box" onClick={copyAddress} style={{ cursor: 'pointer' }}>
              <code>0x71C22932974893...B29</code>
              <Copy size={14} className="text-gold" />
            </div>
          </div>

        </div>

      </div>

      {/* 3. RECENT TRANSACTION STATEMENT LEDGER */}
      <div className="erax-workspace-panel full-width-ledger">
        <div className="panel-header-action">
          <div>
            <h3 className="panel-title">Recent Ledger Logs</h3>
            <p className="panel-subtitle">A live record of account fund settlement status</p>
          </div>
        </div>

        <div className="holdings-table-container">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((tx) => (
              <div key={tx.id} className="holding-row-card tx-ledger-row">
                <div className={`holding-icon-box ${tx.isCredit ? 'tx-credit-tint' : 'tx-debit-tint'}`}>
                  {tx.isCredit ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                </div>

                <div className="holding-identity-cell">
                  <h4>{tx.type} Asset Order</h4>
                  <span>Ref: {tx.id} • {tx.date}</span>
                </div>

                <div className="holding-data-cell hide-mobile">
                  <span className="cell-top">Asset Vector</span>
                  <span className="cell-bottom text-white">{tx.asset} Ledger</span>
                </div>

                <div className="holding-data-cell text-right">
                  <span className={`cell-top market-value ${tx.isCredit ? 'text-green' : 'text-white'}`}>
                    {tx.amount}
                  </span>
                  <span className="cell-bottom tx-status-indicator">
                    <CheckCircle2 size={12} /> {tx.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '36px 20px', color: '#475569', fontSize: '0.85rem' }}>
              No recent asset movements registered. Deploy tracking address configurations above to activate settlement logging.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Wallet;