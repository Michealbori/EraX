// Footer.jsx

import "./bottomNav.css";
import { ShieldCheck, Cloud } from "lucide-react";

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* ===== LEFT SIDE ===== */}
        <div className="footer-brand">

          <h1 className="footer-logo">
            era<span>X</span>
          </h1>

          <p className="footer-desc">
            Smart investing made simple.
            <br />
            Build wealth with
            <br />
            automation and confidence.
          </p>

          {/* SECURITY BOX */}
          <div className="security-box">

            <div className="security-item">
              <ShieldCheck size={18} />
              <span>Secured with bank-level encryption</span>
            </div>

            <div className="security-item">
              <Cloud size={18} />
              <span>Powered by trusted infrastructure</span>
            </div>

          </div>

        </div>

        {/* ===== LINKS ===== */}
        <div className="footer-links">

          {/* PRODUCT */}
          <div className="footer-column">
            <h3>Product</h3>

            <a href="/">Features</a>
            <a href="/">Pricing</a>
            <a href="/">Asset Management</a>
            <a href="/">Capital Market</a>
          </div>

          {/* COMPANY */}
          <div className="footer-column">
            <h3>Company</h3>

            <a href="/">About Us</a>
            <a href="/">Careers</a>
            <a href="/">Blog</a>
            <a href="/">Contact</a>
          </div>

          {/* SUPPORT */}
          <div className="footer-column">
            <h3>Support</h3>

            <a href="/">Help Center</a>
            <a href="/">FAQs</a>
            <a href="/">Terms of Service</a>
            <a href="/">Privacy Policy</a>
          </div>

        </div>

      </div>

      {/* ===== BOTTOM ===== */}
      <div className="footer-bottom">
        <p>
          © 2026 eraX | All rights reserved. | Terms | Privacy | Cookies
        </p>
      </div>

    </footer>
  );
};

export default Footer;