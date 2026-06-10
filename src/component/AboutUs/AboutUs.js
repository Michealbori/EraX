import React, { useState, useEffect } from "react";
import { Cpu, ShieldCheck, Activity, Globe, ArrowRight, Server, Radio, Users } from "lucide-react";
import "./AboutUs.css";

export default function AboutUs() {
  // Live simulated telemetry states to mimic a high-end active trading node
  const [liveTVM, setLiveTVM] = useState(142850300);
  const [latency, setLatency] = useState(412);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTVM(prev => prev + Math.floor(Math.random() * 120));
      setLatency(prev => Math.max(380, Math.min(450, prev + (Math.random() > 0.5 ? 8 : -8))));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <main className="about-page-wrapper">
      {/* Background Graphic Interaction Mesh */}
      <div className="about-ambient blur-top"></div>
      <div className="about-ambient blur-right"></div>

      {/* ===== 1. MANIFESTO HERO SECTION ===== */}
      <header className="about-hero">
        <div className="about-tag">
          <span className="pulse-dot"></span> System Protocol // Manifesto
        </div>
        <h1 className="about-main-title">
          Engineering Capital Velocity For The <span>Next Generation</span>
        </h1>
        <p className="about-main-subtitle">
          eraX breaks down the barrier between complex algorithmic engineering and everyday wealth management. 
          We operate on a single, clean principle: removing emotional trading bias through mathematically pure infrastructure.
        </p>
      </header>

      {/* ===== 2. LIVE TELEMETRY CORE ENGINE DIALS ===== */}
      <section className="telemetry-grid">
        <div className="telemetry-card">
          <div className="telemetry-header">
            <span className="telemetry-label">Total Value Locked (TVL)</span>
            <Radio size={14} className="live-icon-pulse" />
          </div>
          <span className="telemetry-value numerical-font">
            {formatCurrency(liveTVM)}
          </span>
          <p className="telemetry-sub">Live cryptographic capital audit counter.</p>
        </div>

        <div className="telemetry-card">
          <div className="telemetry-header">
            <span className="telemetry-label">Execution Routing Latency</span>
            <Server size={14} className="telemetry-static-icon" />
          </div>
          <span className="telemetry-value numerical-font">{latency}ms</span>
          <p className="telemetry-sub">Sub-millisecond smart order pipeline execution.</p>
        </div>

        <div className="telemetry-card">
          <div className="telemetry-header">
            <span className="telemetry-label">Global Cluster Active Nodes</span>
            <Globe size={14} className="telemetry-static-icon" />
          </div>
          <span className="telemetry-value numerical-font">42 / 42</span>
          <p className="telemetry-sub">100% network uptime redundancy verified.</p>
        </div>
      </section>

      {/* ===== 3. THREE CORE PILLARS MATRIX ===== */}
      <section className="pillars-section">
        <div className="section-title-block">
          <h2>The Foundations of eraX</h2>
          <p>The core structural mechanics that differentiate our execution terminal from standard retail broker systems.</p>
        </div>

        <div className="pillars-grid">
          <article className="pillar-card">
            <div className="pillar-icon-box">
              <ShieldCheck size={22} />
            </div>
            <h3>Systemic Security</h3>
            <p>
              Your portfolio operates inside isolated vault network nodes. Leveraging non-custodial structural logic and 
              AES-256 data envelope encryption, eraX guarantees absolute client-side security control.
            </p>
          </article>

          <article className="pillar-card">
            <div className="pillar-icon-box">
              <Cpu size={22} />
            </div>
            <h3>Algorithmic Velocity</h3>
            <p>
              We eliminate traditional speculator market drag. Our automated engine monitors multi-asset variations 
              and executes systematic micro-rebalancing runs automatically to lock in gains seamlessly.
            </p>
          </article>

          <article className="pillar-card">
            <div className="pillar-icon-box">
              <Activity size={22} />
            </div>
            <h3>Unified Allocation</h3>
            <p>
              Say goodbye to fragmented account set-ups. Trade public equities, secure sovereign fixed yields, and 
              fractional high-growth alternative private assets cleanly out of one sovereign platform context.
            </p>
          </article>
        </div>
      </section>

      {/* ===== 4. STRUCTURAL SYSTEM TIMELINE ===== */}
      <section className="timeline-section">
        <div className="section-title-block">
          <h2>The Evolutionary Roadmap</h2>
          <p>Our progressive trajectory as we build out the framework for completely open financial systems.</p>
        </div>

        <div className="timeline-track">
          <div className="timeline-line"></div>
          
          <div className="timeline-item left">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <span className="timeline-phase">Phase 01 // Architecture Initialization</span>
              <h4>Protocol Foundation & Validation</h4>
              <p>Constructed the ultra-secure base server grid and refined the predictive mathematical core engines behind our asset balancing systems.</p>
            </div>
          </div>

          <div className="timeline-item right">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <span className="timeline-phase">Phase 02 // Asset Expansion Run</span>
              <h4>Tokenized Asset Integrations</h4>
              <p>Successfully expanded terminal support outward into stable fractionalized commodities, physical real estate holdings, and liquid digital trust assets.</p>
            </div>
          </div>

          <div className="timeline-item left">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <span className="timeline-phase">Phase 03 // Next Gen Node Release</span>
              <h4>Autonomous Multi-Asset Terminal</h4>
              <p>Deployed the fully live, automated user execution panel online today, featuring real-time client verification mechanics and instantaneous deposit channels.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 5. COMPLIANCE ASSURANCE BLOCK ===== */}
      <footer className="about-compliance-footer">
        <div className="compliance-card">
          <Users size={20} className="compliance-icon" />
          <p>
            Institutional Integrity Framework: All asset matrices mapped inside the eraX container pipeline are mathematically audited, 
            backed by 1:1 real-world allocations, and completely secure against malicious system attacks.
          </p>
        </div>
      </footer>
    </main>
  );
}