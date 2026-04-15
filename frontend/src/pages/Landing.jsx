import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import heroEcoFuture from "../assets/LandingPageImages/The Eco-Future Hero.jpg";
import smartHubBin from "../assets/LandingPageImages/The Smart Hub Bin.jpg";
import pureMaterials from "../assets/LandingPageImages/The Purity of Materials.jpg";
import digitalEcoFlow from "../assets/LandingPageImages/Digital Eco-Flow (Abstract).jpg";
import advancedAiDetection from "../assets/LandingPageImages/Advanced AI Detection.jpg";
import automatedRecycling from "../assets/LandingPageImages/Automated Recycling Robotics.jpg";
import globalConnectivity from "../assets/LandingPageImages/Global Connectivity.jpg";
import sustainableCommunity from "../assets/LandingPageImages/Sustainable Community Lifestyle.jpg";
import ecoCity from "../assets/eco_city.png";
import heroPremium from "../assets/hero_premium.png";
import smartDetection from "../assets/smart_detection.png";

export default function Landing() {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    { url: heroEcoFuture, title: "Eco-Future", desc: "Building sustainable cities through technology" },
    { url: heroPremium, title: "Hero Vision", desc: "Premium-grade sustainability experience" },
    { url: ecoCity, title: "Eco City", desc: "Smart urban waste intelligence" },
    { url: smartDetection, title: "Smart Detection", desc: "AI-assisted material recognition" },
    { url: smartHubBin, title: "Smart Segregation", desc: "AI-driven waste sorting with precision" },
    { url: pureMaterials, title: "Purity of Materials", desc: "Real-time material detection and classification" },
    { url: digitalEcoFlow, title: "Digital Eco-Flow", desc: "Optimizing the circular economy" },
    { url: advancedAiDetection, title: "Advanced AI Detection", desc: "Deep learning at the edge" },
    { url: automatedRecycling, title: "Automated Recycling", desc: "Robotics for efficient sorting" },
    { url: globalConnectivity, title: "Global Connectivity", desc: "Connected bins, connected cities" },
    { url: sustainableCommunity, title: "Sustainable Community", desc: "People-first circular systems" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="landing-container">
      {/* Decorative background elements */}
      <div className="bg-blob-1"></div>
      <div className="bg-blob-2"></div>
      
      <div className="landing-content">
        <header className="landing-header">
          <div className="landing-brand">
            <div className="landing-logo-wrapper">
              <Logo />
            </div>
            <h1 className="landing-title">Eco-Vision</h1>
          </div>
          <p className="landing-subtitle">Next-Gen Waste Classification</p>
        </header>

        <section className="hero-section">
          <div className="landing-description">
            <p>Empowering the planet with <span className="highlight">Artificial Intelligence</span>. Our system classifies waste into 17 categories with industry-leading accuracy, fostering a cleaner, greener future for everyone.</p>
          </div>
          
          <div className="cta-wrapper">
            <button className="cta-button" onClick={() => navigate("/home")}>
              Get Started <span className="arrow">→</span>
            </button>
          </div>
        </section>

        <div className="landing-features">
          <div className="feature-card">
            <div className="feature-icon-shell">🤖</div>
            <h3>Neural Core</h3>
            <p>State-of-the-art Deep Learning models</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-shell">⚡</div>
            <h3>Instant ID</h3>
            <p>Millisecond classification response</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-shell">🌍</div>
            <h3>Eco Impact</h3>
            <p>Reducing global landfill waste</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-shell">📈</div>
            <h3>Insights</h3>
            <p>Real-time environmental analytics</p>
          </div>
        </div>

        <div className="landing-stats">
          <div className="stat-item">
            <span className="stat-val">17+</span>
            <span className="stat-tag">Categories</span>
          </div>
          <div className="stat-separator"></div>
          <div className="stat-item">
            <span className="stat-val">90%</span>
            <span className="stat-tag">Accuracy</span>
          </div>
          <div className="stat-separator"></div>
          <div className="stat-item">
            <span className="stat-val">Live</span>
            <span className="stat-tag">Processing</span>
          </div>
        </div>
      </div>

      <div className="landing-showcase">
        <div className="showcase-header">
          <h2>Visualizing Sustainability</h2>
          <div className="showcase-line"></div>
        </div>
        
        <div className="slider-container">
          {slides.map((slide, index) => (
            <div key={index} className={`slide ${index === activeSlide ? 'active' : ''}`}>
              <img src={slide.url} alt={slide.title} />
              <div className="slide-content">
                <h3>{slide.title}</h3>
                <p>{slide.desc}</p>
              </div>
            </div>
          ))}
          
          <div className="slide-progress">
            {slides.map((_, index) => (
              <div 
                key={index} 
                className={`dot ${index === activeSlide ? 'active' : ''}`}
                onClick={() => setActiveSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        :root {
          --primary: #10b981;
          --primary-dark: #059669;
          --secondary: #3b82f6;
          --text-main: #0f172a;
          --text-muted: #64748b;
          --bg-light: #f8fafc;
        }

        .landing-container {
          font-family: 'Plus Jakarta Sans', sans-serif;
          min-height: 100vh;
          background-color: var(--bg-light);
          color: var(--text-main);
          position: relative;
          overflow: hidden;
          padding: 6rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* Ambient background blobs */
        .bg-blob-1 {
          position: absolute;
          top: -10%;
          right: -5%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0) 70%);
          filter: blur(80px);
          z-index: 0;
          animation: float 20s infinite ease-in-out;
        }
        .bg-blob-2 {
          position: absolute;
          bottom: -10%;
          left: -5%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0) 70%);
          filter: blur(80px);
          z-index: 0;
          animation: float 25s infinite ease-in-out reverse;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-30px, 40px); }
        }

        .landing-content {
          max-width: 1100px;
          width: 100%;
          text-align: center;
          position: relative;
          z-index: 10;
          margin-bottom: 8rem;
        }

        .landing-header {
          margin-bottom: 2.5rem;
          animation: fadeInDown 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .landing-brand {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.25rem;
          margin-bottom: 0.5rem;
        }

        .landing-logo-wrapper {
          background: white;
          padding: 0.5rem;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(16, 185, 129, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .landing-title {
          font-size: clamp(2.5rem, 8vw, 4.5rem);
          font-weight: 800;
          letter-spacing: -2px;
          background: linear-gradient(135deg, #10b981, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .landing-subtitle {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--primary-dark);
          text-transform: uppercase;
          letter-spacing: 4px;
        }

        .hero-section {
          margin-bottom: 4rem;
          animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s backwards;
        }

        .landing-description {
          max-width: 800px;
          margin: 0 auto 3rem;
          font-size: 1.25rem;
          line-height: 1.7;
          color: var(--text-muted);
        }

        .highlight {
          color: var(--text-main);
          font-weight: 700;
          position: relative;
        }
        .highlight::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 0;
          width: 100%;
          height: 8px;
          background: rgba(16, 185, 129, 0.15);
          z-index: -1;
        }

        .cta-wrapper {
          display: flex;
          justify-content: center;
        }

        .cta-button {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: none;
          padding: 1.25rem 3rem;
          font-size: 1.2rem;
          font-weight: 700;
          border-radius: 100px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 20px 40px rgba(16, 185, 129, 0.25);
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .cta-button:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 25px 50px rgba(16, 185, 129, 0.35);
        }

        .cta-button .arrow {
          transition: transform 0.3s ease;
        }
        .cta-button:hover .arrow {
          transform: translateX(5px);
        }

        .landing-features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 2rem;
          margin-bottom: 5rem;
          animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s backwards;
        }

        .feature-card {
          background: white;
          padding: 2.5rem 1.5rem;
          border-radius: 24px;
          transition: all 0.4s ease;
          border: 1px solid rgba(0,0,0,0.03);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }

        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
          border-color: rgba(16, 185, 129, 0.2);
        }

        .feature-icon-shell {
          font-size: 2.5rem;
          margin-bottom: 1.5rem;
          display: inline-block;
          padding: 1rem;
          background: var(--bg-light);
          border-radius: 18px;
        }

        .feature-card h3 {
          font-weight: 700;
          margin-bottom: 0.75rem;
          color: var(--text-main);
        }

        .feature-card p {
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .landing-stats {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 3rem;
          background: white;
          padding: 2rem 4rem;
          border-radius: 100px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.04);
          animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.6s backwards;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
        }

        .stat-val {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--primary);
        }

        .stat-tag {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .stat-separator {
          width: 2px;
          height: 40px;
          background: #f1f5f9;
        }

        .landing-showcase {
          width: 100%;
          max-width: 1200px;
          padding: 0 2rem;
          margin-bottom: 4rem;
        }

        .showcase-header {
          text-align: center;
          margin-bottom: 3.5rem;
        }

        .showcase-header h2 {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }

        .showcase-line {
          width: 80px;
          height: 6px;
          background: var(--primary);
          border-radius: 10px;
          margin: 0 auto;
        }

        .slider-container {
          position: relative;
          height: 600px;
          border-radius: 40px;
          overflow: hidden;
          box-shadow: 0 40px 80px rgba(0,0,0,0.15);
        }

        .slide {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1);
          transform: scale(1.05);
        }

        .slide.active {
          opacity: 1;
          transform: scale(1);
        }

        .slide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .slide::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, transparent 100%);
        }

        .slide-content {
          position: absolute;
          bottom: 3rem;
          left: 4rem;
          color: white;
          z-index: 20;
          max-width: 500px;
          text-align: left;
        }

        .slide-content h3 {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }

        .slide-content p {
          font-size: 1.1rem;
          opacity: 0.9;
          font-weight: 500;
        }

        .slide-progress {
          position: absolute;
          bottom: 3rem;
          right: 4rem;
          display: flex;
          gap: 12px;
          z-index: 30;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255,255,255,0.3);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .dot.active {
          background: white;
          width: 35px;
          border-radius: 10px;
        }

        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .landing-brand { flex-direction: column; gap: 0.5rem; }
          .landing-stats { flex-direction: column; border-radius: 30px; padding: 2.5rem; gap: 1.5rem; }
          .stat-separator { width: 60px; height: 2px; }
          .slider-container { height: 400px; }
          .slide-content { left: 1.5rem; bottom: 1.5rem; }
          .slide-progress { right: 1.5rem; bottom: 1.5rem; }
          .slide-content h3 { font-size: 1.8rem; }
        }
      `}</style>
    </div>
  );
}