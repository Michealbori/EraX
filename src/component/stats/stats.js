import React from "react";
import "./stats.css";

const Stats = () => {
  return (
    <section className="stats-section">
      <div className="stats-wrapper">

        <div className="stat-item">
          <h2>10,000+</h2>
          <p>Active Users</p>
        </div>

        <div className="stat-divider"></div>

        <div className="stat-item">
          <h2>$5M+</h2>
          <p>Assets Managed</p>
        </div>

        <div className="stat-divider"></div>

        <div className="stat-item">
          <h2>99.9%</h2>
          <p>Platform Uptime</p>
        </div>

      </div>
    </section>
  );
};

export default Stats;