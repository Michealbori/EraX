import React from 'react';
import { Star, Quote, ShieldCheck } from 'lucide-react';
import './Testimonials.css';

const reviews = [
  {
    name: "Sarah L.",
    role: "Verified Portfolio Builder",
    text: "The returns I've achieved with eraX have exceeded my expectations. I love the ease of use and how transparent everything is.",
    tags: ["Bonds", "Stocks", "Private Equity"],
    rating: 5,
    seed: "sarah"
  },
  {
    name: "John T.",
    role: "Capital Allocator",
    text: "eraX has simplified investing for me. The automated portfolio management is incredibly effective. I can start with a small amount, and the returns have been impressive.",
    tags: ["Stocks", "Crypto", "Real Estate"],
    rating: 5,
    featured: true,
    seed: "john"
  },
  {
    name: "David S.",
    role: "Systematic Investor",
    text: "eraX outperforms other platforms I've tried. The smart portfolios and automatic rebalancing make it effortless to grow my investments without constant oversight.",
    tags: ["Crypto", "Stocks", "Commodities"],
    rating: 5,
    seed: "david"
  }
];

export default function Testimonials() {
  return (
    <section className="testimonials-section">
      {/* Background Decorative Lighting Nodes */}
      <div className="testimonials-glow top-left"></div>
      <div className="testimonials-glow bottom-right"></div>

      <div className="testimonials-container">
        
        {/* ===== SECTION HEADER ===== */}
        <header className="test-header">
          <div className="test-badge">
            <Star size={12} className="badge-star-icon" />
            <span>Platform Trust Matrix</span>
          </div>
          <h2>What Our Capital Partners Say</h2>
          <p>Over sovereign terminal configurations running live active fund vectors globally.</p>
        </header>

        {/* ===== INTERACTIVE AVATAR TRACK ===== */}
        <div className="avatar-track-row" aria-hidden="true">
          {[...Array(7)].map((_, i) => (
            <div key={i} className={`avatar-frame-circle ${i === 3 ? 'center-active' : ''}`}>
              <img 
                src={`https://api.dicebear.com/7.x/adventurer/svg?seed=node-${i + 20}`} 
                alt="System active user identity matrix" 
              />
            </div>
          ))}
        </div>

        {/* ===== TESTIMONIAL GRID MATRIX ===== */}
        <div className="cards-grid-container">
          {reviews.map((rev, i) => (
            <article 
              key={i} 
              className={`test-card ${rev.featured ? 'featured-card' : ''}`}
            >
              {rev.featured && <div className="featured-top-glow"></div>}
              
              <div className="card-upper-layout">
                <div className="quote-icon-container">
                  <Quote size={18} />
                </div>
                
                <div className="stars-row">
                  {[...Array(5)].map((_, starIndex) => (
                    <Star 
                      key={starIndex} 
                      size={14} 
                      fill="currentColor" 
                      className="star-vector" 
                    />
                  ))}
                  <span className="rating-absolute-val">5.0</span>
                </div>
              </div>

              <p className="quote-body-text">"{rev.text}"</p>

              <footer className="card-user-footer">
                <div className="user-profile-block">
                  <div className="user-avatar-wrapper">
                    <img 
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${rev.seed}&backgroundType=gradientLinear`} 
                      alt={rev.name} 
                    />
                    <div className="verification-dot">
                      <ShieldCheck size={10} />
                    </div>
                  </div>
                  <div className="user-identity">
                    <h3>{rev.name}</h3>
                    <span>{rev.role}</span>
                  </div>
                </div>

                <div className="card-tags-cloud">
                  {rev.tags.map((tag, tagIdx) => (
                    <span key={tagIdx} className="asset-tag-pill">
                      {tag}
                    </span>
                  ))}
                </div>
              </footer>
            </article>
          ))}
        </div>

        {/* ===== PAGINATION REFINEMENT ===== */}
        <div className="pagination-system">
          <span className="dot-node"></span>
          <span className="dot-node dynamic-active-node"></span>
          <span className="dot-node"></span>
        </div>

      </div>
    </section>
  );
}