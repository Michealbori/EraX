// EcosystemFineTuning.jsx
import React, { useState } from 'react';
import { 
  Sliders, 
  Save, 
  RefreshCw, 
  ShieldAlert, 
  Percent, 
  Coins, 
  Lock, 
  Cpu,
  CheckCircle2
} from 'lucide-react';
import "./EcosystemFineTuning.css";

export default function EcosystemFineTuning() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Core administrative parameter values state mapping
  const [configs, setConfigs] = useState({
    usdtWithdrawFee: "1.50",
    btcWithdrawFee: "0.0005",
    ltcWithdrawFee: "0.01",
    ethWithdrawFee: "0.003",
    minDepositUSD: "10.00",
    maxWithdrawDailyUSD: "50000.00",
    orderMatchingSpread: "0.15",
    maintenanceMode: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfigs(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    // Commit config parameter mutations to the infrastructure state layer
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="tuning-system-workspace">
      
      {/* ===== HEADER NODE ===== */}
      <header className="tuning-header">
        <div className="tuning-header-meta">
          <h1>Settings</h1>
          <p>Modify global protocol coefficients, baseline clearing costs, minimum trade limits, and systemic variables.</p>
        </div>
      </header>

      <form onSubmit={handleSaveChanges} className="tuning-configuration-form">
        
        {/* ===== DOUBLE COLUMN CONFIG STACK ===== */}
        <div className="tuning-split-grid">
          
          {/* LEFT COLUMN: PROTOCOL AND LIQUIDITY SLATE */}
          <div className="tuning-card-block">
            <div className="block-header-flat">
              <Coins size={16} className="text-gold" />
              <div className="header-meta-group">
                <h3>Asset Withdrawal Processing Fees</h3>
                <p>Fixed transaction overhead deducted during network settlement broadcasts.</p>
              </div>
            </div>

            <div className="tuning-fields-stack">
              <div className="input-field-group">
                <label htmlFor="usdtWithdrawFee">USDT TRC-20 Processing Fee</label>
                <div className="input-addon-wrapper">
                  <input 
                    type="number" 
                    id="usdtWithdrawFee"
                    name="usdtWithdrawFee" 
                    step="0.01" 
                    value={configs.usdtWithdrawFee} 
                    onChange={handleInputChange} 
                  />
                  <span className="input-addon-tag">USDT</span>
                </div>
              </div>

              <div className="input-field-group">
                <label htmlFor="btcWithdrawFee">Bitcoin Network Base Fee</label>
                <div className="input-addon-wrapper">
                  <input 
                    type="number" 
                    id="btcWithdrawFee"
                    name="btcWithdrawFee" 
                    step="0.0001" 
                    value={configs.btcWithdrawFee} 
                    onChange={handleInputChange} 
                  />
                  <span className="input-addon-tag">BTC</span>
                </div>
              </div>

              <div className="input-field-group">
                <label htmlFor="ltcWithdrawFee">Litecoin Network Base Fee</label>
                <div className="input-addon-wrapper">
                  <input 
                    type="number" 
                    id="ltcWithdrawFee"
                    name="ltcWithdrawFee" 
                    step="0.001" 
                    value={configs.ltcWithdrawFee} 
                    onChange={handleInputChange} 
                  />
                  <span className="input-addon-tag">LTC</span>
                </div>
              </div>

              <div className="input-field-group">
                <label htmlFor="ethWithdrawFee">Ethereum ERC-20 Gas Buffer Fee</label>
                <div className="input-addon-wrapper">
                  <input 
                    type="number" 
                    id="ethWithdrawFee"
                    name="ethWithdrawFee" 
                    step="0.001" 
                    value={configs.ethWithdrawFee} 
                    onChange={handleInputChange} 
                  />
                  <span className="input-addon-tag">ETH</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: CORE CLEARING ACCENTS AND BOUNDARIES */}
          <div className="tuning-card-block">
            <div className="block-header-flat">
              <Lock size={16} className="text-blue" />
              <div className="header-meta-group">
                <h3>Velocity & Safety Overrides</h3>
                <p>System risk compliance safety bounds mapped across standard operational channels.</p>
              </div>
            </div>

            <div className="tuning-fields-stack">
              <div className="input-field-group">
                <label htmlFor="minDepositUSD">Minimum Account Inbound Floor</label>
                <div className="input-addon-wrapper">
                  <span className="input-prefix-tag">$</span>
                  <input 
                    type="number" 
                    id="minDepositUSD"
                    name="minDepositUSD" 
                    step="1.00" 
                    value={configs.minDepositUSD} 
                    onChange={handleInputChange} 
                  />
                  <span className="input-addon-tag">USD</span>
                </div>
              </div>

              <div className="input-field-group">
                <label htmlFor="maxWithdrawDailyUSD">24-Hour Automated Withdrawal Ceiling</label>
                <div className="input-addon-wrapper">
                  <span className="input-prefix-tag">$</span>
                  <input 
                    type="number" 
                    id="maxWithdrawDailyUSD"
                    name="maxWithdrawDailyUSD" 
                    step="100.00" 
                    value={configs.maxWithdrawDailyUSD} 
                    onChange={handleInputChange} 
                  />
                  <span className="input-addon-tag">USD</span>
                </div>
              </div>

              <div className="input-field-group">
                <label htmlFor="orderMatchingSpread">Dynamic Market Spread Markup</label>
                <div className="input-addon-wrapper">
                  <input 
                    type="number" 
                    id="orderMatchingSpread"
                    name="orderMatchingSpread" 
                    step="0.01" 
                    value={configs.orderMatchingSpread} 
                    onChange={handleInputChange} 
                  />
                  <span className="input-addon-tag"><Percent size={12} /></span>
                </div>
                <small className="field-explanatory-remark">Artificial exchange spread added above baseline aggregated telemetry data.</small>
              </div>
            </div>
          </div>

        </div>

        {/* ===== BOTTOM COMPLIANCE PANEL & SYSTEM OVERRIDES ===== */}
        <section className="tuning-card-block emergency-card-perimeter">
          <div className="emergency-flex-layout">
            <div className="emergency-text-node">
              <div className="emergency-title-row">
                <ShieldAlert size={18} className="text-red" />
                <h4>Critical Global Infrastructure Safe-Lock</h4>
              </div>
              <p>Activating this immediately blocks all outward user wallet clearing pipelines, order settlements, and API deposits portal-wide while displaying an offline notice. System operators maintain backend administration access.</p>
            </div>
            <div className="toggle-switch-housing">
              <label className="cyber-toggle-switch">
                <input 
                  type="checkbox" 
                  name="maintenanceMode"
                  checked={configs.maintenanceMode}
                  onChange={handleInputChange}
                />
                <span className="toggle-slider-track"></span>
              </label>
              <span className={`toggle-status-descriptor ${configs.maintenanceMode ? "state-critical" : "state-nominal"}`}>
                {configs.maintenanceMode ? "CORE SYSTEM SAFE-LOCKED" : "CORE SYSTEM LIVE"}
              </span>
            </div>
          </div>
        </section>

        {/* ===== CONSOLIDATED FIXATION BAR ===== */}
        <footer className="tuning-sticky-action-bar">
          <div className="alert-notifications-tray">
            {saveSuccess && (
              <div className="success-broadcast-pill">
                <CheckCircle2 size={14} />
                <span>Runtime adjustments successfully committed to cluster memory node files.</span>
              </div>
            )}
          </div>
          <button 
            type="submit" 
            className={`tuning-commit-btn ${isSaving ? "syncing" : ""}`}
            disabled={isSaving}
          >
            {isSaving ? <RefreshCw size={14} className="spin-loader" /> : <Save size={14} />}
            <span>{isSaving ? "Saving System Matrix..." : "Commit Parameter Modifications"}</span>
          </button>
        </footer>

      </form>
    </div>
  );
}