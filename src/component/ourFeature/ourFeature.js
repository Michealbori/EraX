import React from "react";
import "./ourFeature.css";

import {
  Landmark,
  Coins,
  Gem,
  Building2,
  Bitcoin,
  BriefcaseBusiness,
} from "lucide-react";

const Features = () => {
  return (
    <section className="features-section">

      {/* BACKGROUND GLOW */}
      <div className="features-bg-glow"></div>

      <div className="features-container">

        {/* TOP LABEL */}
        <div className="features-tag">
          ✦ Our Features
        </div>

        {/* TITLE */}
        <h2 className="features-title">
          WE DO IT ALL FOR THE LOVE OF
          <br />
          INVESTMENT
        </h2>

        {/* SUBTITLE */}
        <p className="features-subtitle">
          The individual investor should act consistently
          <br />
          as an investor and not as a speculator.
        </p>

        {/* FEATURE GRID */}
        <div className="features-grid">

          {/* CARD 1 */}
          <div className="feature-card">

            <div className="feature-icon">
              <Coins size={20} />
            </div>

            <h3>Stocks</h3>

            <p>
              Buy shares in a company. Profit as
              the business grows and pays out
              dividends.
            </p>

          </div>

          {/* CARD 2 */}
          <div className="feature-card">

            <div className="feature-icon">
              <Landmark size={20} />
            </div>

            <h3>Bonds</h3>

            <p>
              Lend money to governments or
              firms. Earn steady, predictable
              interest over time.
            </p>

          </div>

          {/* CARD 3 */}
          <div className="feature-card">

            <div className="feature-icon">
              <Gem size={20} />
            </div>

            <h3>Commodities</h3>

            <p>
              Trade raw materials like gold or oil.
              A classic shield against inflation.
            </p>

          </div>

          {/* CARD 4 */}
          <div className="feature-card">

            <div className="feature-icon">
              <BriefcaseBusiness size={20} />
            </div>

            <h3>Private Equity</h3>

            <p>
              Invest in private businesses.
              High-growth potential outside the
              public market.
            </p>

          </div>

          {/* CARD 5 */}
          <div className="feature-card">

            <div className="feature-icon">
              <Building2 size={20} />
            </div>

            <h3>Real Estate</h3>

            <p>
              Own physical property. Generate
              wealth through rent and rising
              land value.
            </p>

          </div>

          {/* CARD 6 */}
          <div className="feature-card">

            <div className="feature-icon">
              <Bitcoin size={20} />
            </div>

            <h3>Cryptocurrencies</h3>

            <p>
              Digital blockchain assets. High-speed,
              high-reward tech-driven investments.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
};

export default Features;