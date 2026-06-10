// MarketTelemetry.jsx
import React, { useState, useEffect } from 'react';
import { 
  LineChart as ChartIcon, 
  RefreshCw, 
  ArrowUpRight, 
  ArrowDownRight, 
  Gauge, 
  Activity, 
  Eye, 
  Zap,
  Radio
} from 'lucide-react';
import "./MarketTelemetryTracker.css";

export default function MarketTelemetry() {
  const [livePulse, setLivePulse] = useState(true);
  const [tick, setTick] = useState(0);

  // Mocking real-time system variance tick updates to make telemetry look organic
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(prev => prev + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Structural dynamic tracker matrices for tracked assets
  const marketFeeds = [
    { asset: "BTC/USD", price: "$62,015.40", change: "+2.41%", isPositive: true, liquidity: "$42.1M", volume24h: "1,240.5 BTC" },
    { asset: "ETH/USD", price: "$3,295.12", change: "+1.85%", isPositive: true, liquidity: "$18.4M", volume24h: "4,890.2 ETH" },
    { asset: "LTC/USD", price: "$84.98", change: "-0.62%", isPositive: false, liquidity: "$6.2M", volume24h: "14,350.0 LTC" },
    { asset: "USDT/USD", price: "$1.0002", change: "+0.01%", isPositive: true, liquidity: "$85.0M", volume24h: "12,401,900 USDT" }
  ];

  const coreNodes = [
    { name: "Binance Liquidity Relay", latency: "14ms", status: "Operational", efficiency: "99.9%" },
    { name: "Coinbase Pro Node", latency: "22ms", status: "Operational", efficiency: "99.8%" },
    { name: "Kraken Settlement Bridge", latency: "38ms", status: "Operational", efficiency: "99.6%" }
  ];

  return (
    <div className="telemetry-system-workspace">
      
      {/* ===== HEADER ENGINE MODULE ===== */}
      <header className="telemetry-header">
        <div className="telemetry-header-meta">
          <h1>Market Telemetry Tracker</h1>
          <p>Real-time cross-exchange aggregate indices, order book liquidity depth, and execution relay delays.</p>
        </div>
        <div className="telemetry-action-cluster">
          <div className={`live-feed-banner ${livePulse ? "streaming" : ""}`}>
            <Radio size={14} />
            <span>{livePulse ? "Live Data Pipeline Streaming" : "Pipeline Paused"}</span>
          </div>
          <button 
            type="button" 
            className="telemetry-refresh-btn"
            onClick={() => setLivePulse(!livePulse)}
          >
            <RefreshCw size={14} className={livePulse ? "pulse-spinning" : ""} />
            <span>{livePulse ? "Pause Stream" : "Resume Stream"}</span>
          </button>
        </div>
      </header>

      {/* ===== LIVE PRICE TELEMETRY CHIPS ===== */}
      <section className="telemetry-ticker-grid">
        {marketFeeds.map((feed, index) => (
          <div key={index} className="ticker-telemetry-card">
            <div className="ticker-top-row">
              <span className="ticker-asset-title">{feed.asset}</span>
              <span className={`ticker-trend-pill ${feed.isPositive ? "up" : "down"}`}>
                {feed.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {feed.change}
              </span>
            </div>
            <div className="ticker-value-row">
              <h2>{feed.price}</h2>
            </div>
            <div className="ticker-bottom-stats">
              <div className="sub-stat">
                <span className="sub-lbl">Book Depth</span>
                <span className="sub-val">{feed.liquidity}</span>
              </div>
              <div className="sub-stat">
                <span className="sub-lbl">24H Volume</span>
                <span className="sub-val">{feed.volume24h}</span>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ===== TECHNICAL VISUALIZATION GRID ===== */}
      <div className="telemetry-split-layout">
        
        {/* LEFT COMPONENT: MOCK ORDER BOOK DEPTH CHANNELS */}
        <div className="order-depth-block">
          <div className="block-header-flat">
            <div className="header-meta-group">
              <h3>Order Book Volatility Density</h3>
              <p>Combined platform buy/sell threshold barriers across active nodes</p>
            </div>
            <Gauge size={16} className="text-muted-icon" />
          </div>

          <div className="depth-bars-container">
            {/* Ask Orders (Sells) */}
            <div className="depth-group asks">
              <span className="depth-group-title">Asks (Liquidity Resistance Sell)</span>
              <div className="depth-row">
                <span className="depth-price sell-txt">$62,100.00</span>
                <div className="depth-bar-wrapper">
                  <div className="depth-fill-bar ask-fill" style={{ width: `${Math.min(85 + (tick % 5), 100)}%` }}></div>
                </div>
                <span className="depth-vol">4.25 BTC</span>
              </div>
              <div className="depth-row">
                <span className="depth-price sell-txt">$62,050.00</span>
                <div className="depth-bar-wrapper">
                  <div className="depth-fill-bar ask-fill" style={{ width: "45%" }}></div>
                </div>
                <span className="depth-vol">1.12 BTC</span>
              </div>
            </div>

            {/* Bid Orders (Buys) */}
            <div className="depth-group bids">
              <span className="depth-group-title">Bids (Liquidity Support Buy)</span>
              <div className="depth-row">
                <span className="depth-price buy-txt">$62,000.00</span>
                <div className="depth-bar-wrapper">
                  <div className="depth-fill-bar bid-fill" style={{ width: `${Math.min(70 + (tick % 7), 100)}%` }}></div>
                </div>
                <span className="depth-vol">3.89 BTC</span>
              </div>
              <div className="depth-row">
                <span className="depth-price buy-txt">$61,950.00</span>
                <div className="depth-bar-wrapper">
                  <div className="depth-fill-bar bid-fill" style={{ width: "90%" }}></div>
                </div>
                <span className="depth-vol">8.44 BTC</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COMPONENT: INTERNAL ORDER RELAY CLUSTERS */}
        <div className="relay-nodes-block">
          <div className="block-header-flat">
            <div className="header-meta-group">
              <h3>External Liquidity Node Feeds</h3>
              <p>System cluster communication statistics and synchronization delays</p>
            </div>
            <Zap size={16} className="text-muted-icon" />
          </div>

          <div className="relay-nodes-stack">
            {coreNodes.map((node, i) => (
              <div key={i} className="relay-node-row">
                <div className="node-identity-core">
                  <div className="pulse-indicator-active"></div>
                  <div className="node-name-meta">
                    <span className="node-title">{node.name}</span>
                    <span className="node-efficiency-label">Uptime Metric: {node.efficiency}</span>
                  </div>
                </div>
                <div className="node-performance-metrics">
                  <span className="latency-badge"><Activity size={10} /> {node.latency}</span>
                  <span className="status-string-pill">{node.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}




