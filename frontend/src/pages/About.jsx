import React from "react";
import { speechService } from "../utils/speechService";
import "../styles/About.css";

export default function About() {
  const handleSpeak = () => {
    speechService.speak(
      "Eco-Vision is a smart waste classification system powered by advanced deep learning. Our mission is to revolutionize waste management and support sustainable environmental practices."
    );
  };

  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About Eco-Vision</h1>
        <button className="speak-btn" onClick={handleSpeak} title="Listen to about">
          🔊
        </button>
      </div>

      <div className="about-content">
        {/* Mission */}
        <section className="about-section">
          <h2>🎯 Our Mission</h2>
          <p>
            To automate waste classification using Artificial Intelligence and support
            efficient waste segregation for better recycling and environmental management.
          </p>
        </section>

        {/* Technology */}
        <section className="about-section">
          <h2>⚙️ Technology Stack</h2>
          <div className="tech-grid">
            <div className="tech-card">
              <h3>Model Architecture</h3>
              <p>MobileNetV2 with Transfer Learning</p>
            </div>
            <div className="tech-card">
              <h3>Image Processing</h3>
              <p>224x224 pixel input with augmentation</p>
            </div>
            <div className="tech-card">
              <h3>Optimization</h3>
              <p>Adam optimizer with early stopping</p>
            </div>
            <div className="tech-card">
              <h3>Performance</h3>
              <p>85-90% accuracy across all categories</p>
            </div>
          </div>
        </section>

        {/* Waste Categories */}
        <section className="about-section">
          <h2>📦 17 Waste Categories</h2>
          <div className="categories-grid">
            <div className="category-tag">🔋 Battery</div>
            <div className="category-tag">⌨️ Keyboard</div>
            <div className="category-tag">📱 Mobile</div>
            <div className="category-tag">🔌 PCB</div>
            <div className="category-tag">🥤 Glass</div>
            <div className="category-tag">⚙️ Metal</div>
            <div className="category-tag">🛍️ Plastic</div>
            <div className="category-tag">📄 Paper</div>
            <div className="category-tag">🗑️ Trash</div>
            <div className="category-tag">🖨️ Printer</div>
            <div className="category-tag">🖱️ Mouse</div>
            <div className="category-tag">📺 Television</div>
            <div className="category-tag">🌊 Microwave</div>
            <div className="category-tag">🧺 Washing Machine</div>
            <div className="category-tag">📦 Cardboard</div>
            <div className="category-tag">🌱 Organic</div>
            <div className="category-tag">🎮 Player</div>
          </div>
        </section>

        {/* Training Process */}
        <section className="about-section">
          <h2>📚 Training Process</h2>
          <div className="training-phases">
            <div className="phase">
              <h3>Phase 1: Feature Extraction</h3>
              <p>Base model frozen to extract features</p>
            </div>
            <div className="phase">
              <h3>Phase 2: Fine-tuning</h3>
              <p>Last layers unfrozen for optimization</p>
            </div>
          </div>
        </section>

        {/* Future Improvements */}
        <section className="about-section">
          <h2>🚀 Future Improvements</h2>
          <ul className="improvements-list">
            <li>Integration with IoT smart bins</li>
            <li>Real-time YOLO-based object detection</li>
            <li>Mobile application deployment</li>
            <li>Cloud deployment for large-scale use</li>
            <li>Multi-language support</li>
            <li>Advanced analytics dashboard</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
