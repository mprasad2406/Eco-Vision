import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import "../styles/Landing.css";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-content">
        {/* Logo Section */}
        <div className="landing-logo">
          <Logo />
        </div>

        {/* Main Title */}
        <h1 className="landing-title">Eco-Vision</h1>
        <p className="landing-subtitle">Smart Waste Classification System</p>

        {/* Description */}
        <div className="landing-description">
          <p>
            Revolutionizing waste management through Artificial Intelligence.
            Automatically classify waste into 17 categories with 85-90% accuracy.
          </p>
        </div>

        {/* Features */}
        <div className="landing-features">
          <div className="feature-box">
            <span className="feature-icon">🤖</span>
            <h3>AI-Powered</h3>
            <p>Advanced deep learning models</p>
          </div>
          <div className="feature-box">
            <span className="feature-icon">📸</span>
            <h3>Fast Recognition</h3>
            <p>Real-time waste classification</p>
          </div>
          <div className="feature-box">
            <span className="feature-icon">♻️</span>
            <h3>Eco-Friendly</h3>
            <p>Support sustainable practices</p>
          </div>
          <div className="feature-box">
            <span className="feature-icon">📊</span>
            <h3>Analytics</h3>
            <p>Detailed statistics & insights</p>
          </div>
        </div>

        {/* CTA Button */}
        <button className="cta-button" onClick={() => navigate("/home")}>
          Get Started
        </button>

        {/* Bottom Stats */}
        <div className="landing-stats">
          <div className="stat">
            <span className="stat-number">17</span>
            <span className="stat-label">Waste Categories</span>
          </div>
          <div className="stat">
            <span className="stat-number">90%</span>
            <span className="stat-label">Accuracy Rate</span>
          </div>
          <div className="stat">
            <span className="stat-number">Real-time</span>
            <span className="stat-label">Processing</span>
          </div>
        </div>
      </div>
    </div>
  );
}
