// Hero.jsx

import React from "react";
import "./hero.css";
import spikeImg from "../assets/spike.png";

const Hero = () => {
  return (
    <section className="hero">

      {/* BACKGROUND GLOW */}
      <div className="hero-glow"></div>

      <div className="hero-container">

        {/* ===== LEFT CONTENT ===== */}
        <div className="hero-content fade-left">

          <h1 className="hero-title">
            Build Wealth Automatically—
            <br />
            Starting Small
          </h1>

          <p className="hero-text">
            Start investing with as little as $10. Let smart automation and
            compounding growth turn your money into long-term wealth.
          </p>

          {/* FEATURES */}
          <div className="hero-features">

            <div className="feature-item fade-up delay-1">
              <span>✔</span>
              <p>Trusted by 10,000+ users</p>
            </div>

            <div className="feature-item fade-up delay-2">
              <span>✔</span>
              <p>Bank-level security</p>
            </div>

            <div className="feature-item fade-up delay-3">
              <span>✔</span>
              <p>No hidden fees</p>
            </div>

          </div>

          {/* BUTTONS */}
          <div className="hero-buttons fade-up delay-4">

            <button className="primary-btn">
              Get Started Free
            </button>

            <button className="secondary-btn">
              See How It Works
            </button>

          </div>

        </div>

        {/* ===== RIGHT IMAGE ===== */}
        <div className="hero-image fade-right">

          <div className="image-glow"></div>

          <img
            src={spikeImg}
            alt="Investment Growth"
            className="floating-image"
          />

        </div>

      </div>
    </section>
  );
};

export default Hero;