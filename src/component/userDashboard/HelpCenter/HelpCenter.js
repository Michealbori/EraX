import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  MessageSquare, 
  ShieldAlert, 
  Terminal, 
  ChevronDown, 
  ChevronUp, 
  Activity, 
  Layers, 
  Cpu,
  Send,
  ExternalLink,
  Clock,
  Users
} from 'lucide-react';
import "./HelpCenter.css"

// ✅ Telegram Configuration - UPDATE THIS WITH YOUR ACTUAL TELEGRAM USERNAME
const TELEGRAM_USERNAME = 'eraXSupport'; // ← Change this to your actual Telegram username
const TELEGRAM_LINK = `https://t.me/${TELEGRAM_USERNAME}`;

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  // Elite system operational stats
  const supportCategories = [
    { id: 1, title: 'Asset Deployment', desc: 'Queries on Stock equity matching or physical commodities settlement chains.', icon: <Layers size={20} /> },
    { id: 2, title: 'Security & Custody', desc: 'Cryptographic 2FA protocols, cold vault asset storage, and escrow structures.', icon: <ShieldAlert size={20} /> },
    { id: 3, title: 'API & Execution', desc: 'Institutional latency tracking, webhook events, and settlement processing keys.', icon: <Terminal size={20} /> }
  ];

  // Configured target knowledge articles
  const faqDatabase = [
    { id: 1, question: 'What are the settlement processing windows for asset liquidations?', answer: 'Stocks and Bond vectors operate on a guaranteed T+0 institutional clearing matrix. Outbound fiat or cryptocurrency liquidation requests are processed via automated node triggers within 15 minutes of compliance release.' },
    { id: 2, question: 'How does eraX store tokenized physical commodities safely?', answer: 'All raw commodity distributions (such as Spot Gold allocations) are securely paired with physically auditable reserves held in high-grade Swiss vault installations. Digital representation layers utilize strict smart-contract consensus protocols.' },
    { id: 3, question: 'Are there maximum limitations on inbound or outbound capital loads?', answer: 'Basic identity verification layers support up to $50,000 daily transaction frames. Corporate profiles or users running cryptographic institutional API layers can request unlimited custom balance sheet routing structures.' },
    { id: 4, question: 'How do I contact support for urgent account issues?', answer: 'For immediate assistance, click the "Open Telegram Support" button below to connect directly with our institutional desk officers via encrypted Telegram channels. Response time is typically under 5 minutes during operational hours.' }
  ];

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const filteredFaqs = faqDatabase.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Handle Telegram button click
  const handleTelegramClick = () => {
    window.open(TELEGRAM_LINK, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="erax-dashboard-wrapper">
      
      {/* 1. HERO SYSTEM TRACK OVERVIEW */}
      <div className="erax-stats-strip wallet-hero-grid">
        <div className="erax-stat-node wallet-main-card help-hero-card">
          <div className="wallet-card-header">
            <span className="erax-node-label"><HelpCircle size={14} /> Knowledge Core Engine</span>
            <div className="live-pulse-container support-online-tag">
              <span className="pulse-dot internet-pulse"></span> Support Online
            </div>
          </div>
          <div className="wallet-balance-hero help-center-hero-content">
            <h2>Support Operational Core</h2>
            
            {/* Contextual Vector Search Channel Bar */}
            <div className="ledger-search-box help-search-override">
              <Search size={16} className="search-icon-inside" />
              <input 
                type="text" 
                placeholder="Search error codes, asset rules, settlement timelines..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. DUAL INTERACTIVE GRID MATRIX BLOCK */}
      <div className="erax-split-workspace">
        
        {/* LEFT COLUMN: CATEGORIES AND INTERACTIVE FAQS */}
        <div className="erax-workspace-panel main-ledger-panel help-main-panel-override">
          <div className="panel-header-action">
            <div>
              <h3 className="panel-title">System Resolution Nodes</h3>
              <p className="panel-subtitle">Select operational vectors to clear balance sheet hold errors</p>
            </div>
          </div>

          {/* Core Categories Row Rack Grid */}
          <div className="support-categories-flex-grid">
            {supportCategories.map((cat) => (
              <div key={cat.id} className="support-cat-node-card">
                <div className="holding-icon-box stocks-tint help-icon-tint">
                  {cat.icon}
                </div>
                <h4>{cat.title}</h4>
                <p>{cat.desc}</p>
              </div>
            ))}
          </div>

          {/* Interactive Accordion Matrix */}
          <div className="referral-sub-section-header">
            <h4 className="panel-title mx-font">Frequently Indexed Queries</h4>
          </div>

          <div className="faq-accordion-stack">
            {filteredFaqs.length === 0 ? (
              <p className="empty-ledger-fallback-txt">No indexed documentation matching that query pattern.</p>
            ) : (
              filteredFaqs.map((faq) => (
                <div key={faq.id} className={`faq-row-item ${openFaq === faq.id ? 'faq-item-expanded' : ''}`}>
                  <button type="button" className="faq-question-trigger" onClick={() => toggleFaq(faq.id)}>
                    <span>{faq.question}</span>
                    {openFaq === faq.id ? <ChevronUp size={16} className="text-gold" /> : <ChevronDown size={16} />}
                  </button>
                  {openFaq === faq.id && (
                    <div className="faq-answer-draw-content">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: REVENUE STATUS RUNTIME PIPELINES */}
        <div className="erax-workspace-panel analytics-side-panel">
          
          {/* NETWORK STATUS HEALTH COMPONENT CARD */}
          <div className="inner-analytics-card premium-action-card help-status-card">
            <div className="terminal-header">
              <h4 className="card-inner-title"><Activity size={16} /> API Integration States</h4>
              <span className="security-lock-badge latency-green-badge"><Cpu size={12} /> 12ms Latency</span>
            </div>
            
            <div className="live-inbound-syncing-stack status-bar-spacing">
              <div className="inbound-sync-row status-health-row">
                <span className="sync-amt font-regular-size">S&P 500 Feed Router</span>
                <span className="system-health-pill active-health">Operational</span>
              </div>
              <div className="inbound-sync-row status-health-row">
                <span className="sync-amt font-regular-size">Commodities Liquidity Pipe</span>
                <span className="system-health-pill active-health">Operational</span>
              </div>
              <div className="inbound-sync-row status-health-row">
                <span className="sync-amt font-regular-size">Outbound Escrow Relay</span>
                <span className="system-health-pill active-health">Operational</span>
              </div>
            </div>
          </div>

          {/* ✅ LIVE DESK ACCESS TERMINAL CONTROLLER - TELEGRAM INTEGRATION */}
          <div className="inner-analytics-card secure-support-desk-card telegram-support-card">
            <div className="telegram-header-section">
              <h4 className="card-inner-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="telegram-icon-svg">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                Institutional Support Desk
              </h4>
              <div className="telegram-status-badge">
                <span className="status-dot-online"></span>
                Online Now
              </div>
            </div>
            
            <p className="terminal-desc">Connect directly with authorized eraX compliance officers via encrypted Telegram channel. Average response time: <strong className="text-gold">under 5 minutes</strong>.</p>
            
            <div className="telegram-info-box">
              <div className="telegram-info-row">
                <Users size={14} />
                <span>24/7 Support Available</span>
              </div>
              <div className="telegram-info-row">
                <Clock size={14} />
                <span>Typical Response: &lt; 5 min</span>
              </div>
              <div className="telegram-info-row">
                <ShieldAlert size={14} />
                <span>End-to-End Encrypted</span>
              </div>
            </div>

            <button 
              type="button" 
              className="terminal-btn primary-gold help-desk-btn telegram-btn"
              onClick={handleTelegramClick}
            >
              <Send size={16} />
              <span>Open Telegram Support</span>
              <ExternalLink size={14} className="external-link-icon" />
            </button>

            <p className="telegram-username-hint">
              @{TELEGRAM_USERNAME}
            </p>
          </div>

          {/* ✅ QUICK ACTIONS CARD */}
          <div className="inner-analytics-card quick-actions-card">
            <h4 className="card-inner-title">Quick Actions</h4>
            <div className="quick-actions-grid">
              <button className="quick-action-btn" onClick={handleTelegramClick}>
                <MessageSquare size={16} />
                <span>Live Chat</span>
              </button>
              <button className="quick-action-btn" onClick={() => window.open('mailto:support@erax.com')}>
                <Send size={16} />
                <span>Email</span>
              </button>
              <button className="quick-action-btn" onClick={() => setOpenFaq(1)}>
                <HelpCircle size={16} />
                <span>FAQ</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default HelpCenter;