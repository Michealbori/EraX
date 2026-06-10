// Navbar.jsx
import "./nav.css";
import { NavLink } from "react-router-dom";
import { TrendingUp, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        {/* ===== LOGO ===== */}
        <NavLink
          to="/Home"
          className="logo-container"
          onClick={() => setMenuOpen(false)}
        >
          <div className="logo-icon">
            <div className="bar bar1"></div>
            <div className="bar bar2"></div>
            <div className="bar bar3"></div>

            <TrendingUp
              size={18}
              className="trend-icon"
            />
          </div>

          <h1 className="logo-text">
            era<span>X</span>
          </h1>
        </NavLink>

        {/* ===== NAV LINKS ===== */}
        <ul className={menuOpen ? "nav-links active-menu" : "nav-links"}>
          {/* HOME */}
          <li>
            <NavLink
              to="/Home"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
              onClick={() => setMenuOpen(false)}
            >
              Home
            </NavLink>
          </li>

          {/* FEATURES */}
          <li>
            <NavLink
              to="/features"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
              onClick={() => setMenuOpen(false)}
            >
              Features
            </NavLink>
          </li>

          {/* ABOUT */}
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
              onClick={() => setMenuOpen(false)}
            >
              About-us
            </NavLink>
          </li>

          {/* ===== MOBILE BUTTON ===== */}
          <li className="mobile-btn-wrapper">
            <NavLink to="/getStarted">
              <button className="cta-btn mobile-btn">
                Get Started Free
              </button>
            </NavLink>
          </li>
        </ul>

        {/* ===== DESKTOP BUTTON ===== */}
        <div className="desktop-btn-wrapper">
          <NavLink to="/getStarted" className="mydecoration">
            <button className="cta-btn">
              Get Started Free
            </button>
          </NavLink>
        </div>

        {/* ===== MOBILE MENU ICON ===== */}
        <div
          className="mobile-menu-icon"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;