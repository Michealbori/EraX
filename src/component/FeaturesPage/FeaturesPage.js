import React, { useState, useMemo } from "react";
import { 
  Landmark, 
  Coins, 
  Gem, 
  Building2, 
  Bitcoin, 
  BriefcaseBusiness, 
  Search, 
  ArrowUpRight, 
  TrendingUp, 
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import "./FeaturesPage.css";

export default function FeaturesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // Extended premium catalog context for a dedicated standalone page
  const catalogData = [
    {
      id: "stocks",
      category: "liquidity",
      icon: <Coins size={22} />,
      title: "Global Stocks",
      description: "Fractional and full shares in top-tier corporate enterprises. Capture value scale as business entities scale up operations and distribute dividends.",
      stats: "+14.2% YTD",
      risk: "Medium"
    },
    {
      id: "bonds",
      category: "fixed-income",
      icon: <Landmark size={22} />,
      title: "Sovereign Bonds",
      description: "Provide capital backing to verified government entities and institutional corporate networks. Secure fixed, highly predictable interest yields over scheduled periods.",
      stats: "5.8% Fixed Yield",
      risk: "Low"
    },
    {
      id: "commodities",
      category: "alternatives",
      icon: <Gem size={22} />,
      title: "Hard Commodities",
      description: "Direct trade mechanics across liquid tangible assets like gold, silver, and crude. Deployed as a strategic hedging defense mechanism against inflationary pressures.",
      stats: "+8.4% YoY",
      risk: "Medium"
    },
    {
      id: "private-equity",
      category: "alternatives",
      icon: <BriefcaseBusiness size={22} />,
      title: "Private Equity",
      description: "Direct seed and venture funding placements into pre-IPO enterprises. High-velocity performance capital outside the exposure constraints of standard public markets.",
      stats: "24.5% Targeted IRR",
      risk: "High"
    },
    {
      id: "real-estate",
      category: "fixed-income",
      icon: <Building2 size={22} />,
      title: "Tokenized Real Estate",
      description: "Fractionalized ownership stakes in institutional grade commercial and premier residential developments. Generate immediate monthly distribution yield alongside collateral appreciation.",
      stats: "9.2% Rental Yield",
      risk: "Low"
    },
    {
      id: "crypto",
      category: "liquidity",
      icon: <Bitcoin size={22} />,
      title: "Digital Assets",
      description: "Automated liquidity pairs on sovereign decentralized blockchain layers. Ultra-high-velocity structural assets designed for generation-defining alpha capture.",
      stats: "+62.8% 12M",
      risk: "High"
    }
  ];

  // Filtering Architecture
  const filteredFeatures = useMemo(() => {
    return catalogData.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "all" || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <main className="features-page-wrapper">
      
      {/* BACKGROUND GRAPHIC INTERACTION MESH */}
      <div className="ambient-blur blur-top"></div>
      <div className="ambient-blur blur-center"></div>

      {/* ===== HERO HEADLINE PRESENTATION BLOCK ===== */}
      <header className="features-hero">
        <div className="features-tag">
          <span className="sparkle">✦</span> Asset Class Architecture
        </div>
        <h1 className="features-main-title">
          We Do It All For The Love Of <span>Investment</span>
        </h1>
        <p className="features-main-subtitle">
          "The individual investor should act consistently as an investor and not as a speculator." 
          <span className="quote-author"> — Benjamin Graham</span>
        </p>
      </header>

      {/* ===== DESK OPERATIONS FILTER CONTROLS ===== */}
      <section className="search-filter-controls">
        <div className="search-input-frame">
          <Search size={18} className="search-mesh-icon" />
          <input 
            type="text" 
            placeholder="Search asset classes, parameters, yields..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="category-pill-row">
          {[
            { id: "all", label: "All Asset Vehicles" },
            { id: "liquidity", label: "High Liquidity" },
            { id: "fixed-income", label: "Fixed Yield" },
            { id: "alternatives", label: "Alternative Alpha" }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`category-pill ${activeCategory === tab.id ? "pill-active" : ""}`}
              onClick={() => setActiveCategory(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* ===== EXPANDED CATALOG GRID ===== */}
      <section className="catalog-grid-section">
        {filteredFeatures.length > 0 ? (
          <div className="features-grid">
            {filteredFeatures.map((item, index) => (
              <article 
                key={item.id} 
                className="feature-card"
                style={{ "--card-index": index }}
              >
                <div className="card-top-accent"></div>
                
                <header className="card-identity-row">
                  <div className="feature-icon-box">
                    {item.icon}
                  </div>
                  <div className="badge-rack">
                    <span className={`risk-badge risk-${item.risk.toLowerCase()}`}>
                      {item.risk} Risk
                    </span>
                  </div>
                </header>

                <div className="card-body">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>

                <footer className="card-analytics-footer">
                  <div className="metric-box">
                    <span className="metric-label">Performance Indicator</span>
                    <span className="metric-value">
                      <TrendingUp size={14} /> {item.stats}
                    </span>
                  </div>
                  <button className="card-action-arrow" aria-label={`Explore ${item.title} marketplace`}>
                    <ArrowUpRight size={18} />
                  </button>
                </footer>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-search-state">
            <p>No systemic asset configurations match your search criteria.</p>
            <button onClick={() => { setSearchQuery(""); setActiveCategory("all"); }} className="reset-btn">
              Clear Filter Channels
            </button>
          </div>
        )}
      </section>

      {/* ===== ACTION CONVERSION BLOCK ===== */}
      <footer className="features-conversion-cta">
        <div className="cta-glass-card">
          <div className="cta-glow"></div>
          <div className="cta-layout">
            <div className="cta-text-side">
              <h2>Ready to engineer your custom portfolio matrix?</h2>
              <p>Deploy capital across pristine tokenized fields and liquid asset classes under an institutional framework.</p>
              
              <ul className="cta-feature-list">
                <li><CheckCircle2 size={16} /> Instant Account Node Setup</li>
                <li><CheckCircle2 size={16} /> Non-Custodial Security Protocol</li>
              </ul>
            </div>
            
            <div className="cta-action-side">
              <button type="button" className="cta-primary-btn">
                <span>Access eraX Terminal</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </footer>

    </main>
  );
}