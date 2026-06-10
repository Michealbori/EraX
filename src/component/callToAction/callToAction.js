import React from 'react';
import './callToAction.css';

const CallToAction = () => {
  return (
    <section className="cta-section">
      <div className="cta-content">
        <h2>Start Building Your Wealth Today</h2>
        <p>Join thousands of users growing their money with smart investing.</p>
        
        <div className="light-line-container">
          <div className="light-line"></div>
          <button className="cta-btn">
            Get Started Free <span>&gt;</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
