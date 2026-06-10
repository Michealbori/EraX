// WealthSection.jsx

import React, { useEffect, useState } from "react";
import "./WealthSection.css";

import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const WealthSection = () => {

  /* ===== LIVE CHART DATA ===== */

  const [chartData, setChartData] = useState([
    { value: 1200 },
    { value: 1700 },
    { value: 1500 },
    { value: 2400 },
    { value: 2800 },
    { value: 3200 },
    { value: 2900 },
    { value: 4200 },
    { value: 5100 },
    { value: 4900 },
    { value: 6200 },
  ]);

  /* ===== REAL-TIME MOVEMENT ===== */

  useEffect(() => {

    const interval = setInterval(() => {

      setChartData((prev) => {

        const updated = [...prev.slice(1)];

        const lastValue =
          prev[prev.length - 1].value;

        const nextValue =
          lastValue + (Math.random() * 700 - 250);

        updated.push({
          value: Math.max(1000, nextValue),
        });

        return updated;
      });

    }, 2000);

    return () => clearInterval(interval);

  }, []);

  return (
    <section className="growth-section">

      {/* ===== BACKGROUND GLOW ===== */}
      <div className="growth-bg-glow"></div>

      <div className="growth-container">

        {/* ===== TITLE ===== */}
        <h2 className="growth-title">
          How You Grow Your Wealth
        </h2>

        {/* ===== TOP CARDS ===== */}
        <div className="growth-cards">

          {/* CARD 1 */}
          <div className="growth-card">
            <div className="icon-circle">💰</div>

            <h3>Wealth Creation</h3>

            <p>
              Build long-term wealth
              <br />
              with automated investing strategies.
            </p>
          </div>

          {/* CARD 2 */}
          <div className="growth-card active-card">
            <div className="icon-circle">🪙</div>

            <h3>Dividends</h3>

            <p>
              Earn consistent passive income
              <br />
              from curated assets.
            </p>
          </div>

          {/* CARD 3 */}
          <div className="growth-card">
            <div className="icon-circle">📈</div>

            <h3>Interest Growth</h3>

            <p>
              Grow your balance daily
              <br />
              with compound interest.
            </p>
          </div>

        </div>

        {/* ===== BOTTOM CONTENT ===== */}
        <div className="growth-bottom">

          {/* ===== LEFT SIDE ===== */}
          <div className="growth-content">

            <h2>
              See Your Money Grow
              <br />
              in Real Time
            </h2>

            <p>
              Track your investments, monitor performance,
              <br />
              and watch your wealth grow with powerful
              <br />
              analytics and insights.
            </p>

            <button>
              View Demo Dashboard
            </button>

          </div>

          {/* ===== RIGHT SIDE ===== */}
          <div className="dashboard-wrapper">

            <div className="dashboard-glow"></div>

            <div className="dashboard">

              {/* ===== TOP BAR ===== */}
              <div className="dashboard-topbar">

                <div className="topbar-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <div className="dashboard-tabs">
                  <p>Real Estate</p>
                  <p>Bonds</p>
                  <p>Commodities</p>
                  <p>Stocks</p>
                </div>

              </div>

              {/* ===== LIVE CHART ===== */}
              <div className="graph-area">

                <ResponsiveContainer width="100%" height={180}>

                  <AreaChart data={chartData}>

                    <defs>

                      <linearGradient
                        id="goldGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#f7b733"
                          stopOpacity={0.8}
                        />

                        <stop
                          offset="100%"
                          stopColor="#f7b733"
                          stopOpacity={0}
                        />
                      </linearGradient>

                    </defs>

                    <Tooltip
                      contentStyle={{
                        background: "#0b1222",
                        border:
                          "1px solid rgba(255,183,0,0.2)",
                        borderRadius: "12px",
                        color: "white",
                      }}
                    />

                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#f7b733"
                      strokeWidth={3}
                      fill="url(#goldGradient)"
                      animationDuration={1500}
                    />

                  </AreaChart>

                </ResponsiveContainer>

                <div className="graph-value">
                  +$664.34
                </div>

              </div>

              {/* ===== ASSET ROW ===== */}
              <div className="coin-row">

                <div className="coin-box">
                  <span>REAL ESTATE</span>
                  <p>+18.4%</p>
                </div>

                <div className="coin-box">
                  <span>BONDS</span>
                  <p>+7.2%</p>
                </div>

                <div className="coin-box">
                  <span>COMMODITIES</span>
                  <p>+12.8%</p>
                </div>

                <div className="coin-box">
                  <span>STOCKS</span>
                  <p>+24.6%</p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default WealthSection;