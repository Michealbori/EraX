import React from 'react';
import './ourSecurity.css';
import securityAsset from '../assets/Data security.png'; // The high-res image I generated for you

const OurSecurity = () => {
  const securityGrid = [
    { title: "No Selling or Sharing", icon: "🛡️", desc: "We do not sell or transfer your data to third parties." },
    { title: "PCI", icon: "💳", desc: "PCI DSS payment card security standard." },
    { title: "GDPR", icon: "📄", desc: "General data protection regulation of the European Union." },
    { title: "SSL", icon: "🔒", desc: "256-bit SSL encryption keeps your data secure." },
  ];

  return (
    <section className="data-security-section">
      <div className="security-container">
        {/* Top Header */}
        <div className="security-header">
          <h2>Data Security</h2>
          <p>Your data is processed in accordance with global and European security standards, including PCI DSS, SSL, and GDPR.</p>
        </div>

        <div className="security-layout">
          {/* Left: Fingerprint Asset */}
          <div className="visual-column">
            <img src={securityAsset} alt="Security Visual" className="fingerprint-img" />
          </div>

          {/* Right: Security Cards */}
          <div className="info-column">
            <div className="cards-grid">
              {securityGrid.map((item, index) => (
                <div key={index} className="sec-card">
                  <div className="sec-icon">{item.icon}</div>
                  <div className="sec-content">
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* The Wide Bottom Card */}
            <div className="sec-card wide-card">
              <div className="sec-icon">🔒</div>
              <div className="sec-content">
                <h3>SSL</h3>
                <p>256-bit SSL encryption keeps your data secure.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurSecurity;
