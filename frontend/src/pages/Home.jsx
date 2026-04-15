import React from "react";
import { Link } from "react-router-dom";
import { speechService } from "../utils/speechService";
import "../styles/Home.css";

const Home = () => {
  const handleSpeak = () => {
    speechService.speak(
      "Welcome to Eco-Vision. This is your dashboard for intelligent waste classification. Navigate to Predict to upload waste images, view all categories, check statistics, or learn more about our project."
    );
  };

return (
    <div className="home-container">
      <div className="home-header">
        <h1>Welcome to Eco-Vision</h1>
        <p>Your Smart Waste Classification Dashboard</p>
        <button className="header-speak-btn" onClick={handleSpeak}>
          🔊 Listen
        </button>
      </div>

      <div className="dashboard-grid">
        {/* Quick Action Cards */}
        <Link to="/predict" className="dashboard-card predict-card">
          <div className="card-icon">📸</div>
          <h2>Predict Waste</h2>
          <p>Upload an image and get instant waste classification with confidence score</p>
          <div className="card-arrow">→</div>
        </Link>

        <Link to="/categories" className="dashboard-card categories-card">
          <div className="card-icon">📦</div>
          <h2>View Categories</h2>
          <p>Explore all 17 waste categories with detailed information and examples</p>
          <div className="card-arrow">→</div>
        </Link>

        <Link to="/stats" className="dashboard-card stats-card">
          <div className="card-icon">📊</div>
          <h2>Statistics</h2>
          <p>View analytics and insights about waste classification patterns</p>
          <div className="card-arrow">→</div>
        </Link>

        <Link to="/about" className="dashboard-card about-card">
          <div className="card-icon">ℹ️</div>
          <h2>About Project</h2>
          <p>Learn more about the Eco-Vision system and its technology stack</p>
          <div className="card-arrow">→</div>
        </Link>
      </div>

      {/* Key Features */}
      <section className="features-section">
        <h2>Key Features</h2>
        <div className="features-container">
          <div className="feature">
            <span className="feature-number">1</span>
            <h3>Real-time Classification</h3>
            <p>Upload images and get instant waste type predictions</p>
          </div>
          <div className="feature">
            <span className="feature-number">2</span>
            <h3>High Accuracy</h3>
            <p>85-90% accuracy across all 17 waste categories</p>
          </div>
          <div className="feature">
            <span className="feature-number">3</span>
            <h3>Detailed Analytics</h3>
            <p>Track and analyze waste classification patterns</p>
          </div>
          <div className="feature">
            <span className="feature-number">4</span>
            <h3>Voice Control</h3>
            <p>Control the app using voice commands</p>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="stats-overview">
        <h2>Quick Stats</h2>
        <div className="stats-boxes">
          <div className="stat-box">
            <div className="stat-value">17</div>
            <div className="stat-label">Waste Categories</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">90%</div>
            <div className="stat-label">Accuracy Rate</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">MobileNetV2</div>
            <div className="stat-label">Model Architecture</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">224x224</div>
            <div className="stat-label">Input Resolution</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;