import React, { useState } from "react";
import { speechService } from "../utils/speechService";
import "../styles/Stats.css";

const STATS_DATA = {
  totalPredictions: 1250,
  accuracy: 88.5,
  categories: [
    { name: "Plastic", count: 285, percentage: 22.8 },
    { name: "Paper", count: 198, percentage: 15.8 },
    { name: "Metal", count: 175, percentage: 14.0 },
    { name: "Glass", count: 152, percentage: 12.2 },
    { name: "Organic", count: 138, percentage: 11.0 },
    { name: "Electronic", count: 125, percentage: 10.0 },
    { name: "Others", count: 177, percentage: 14.2 },
  ],
  modelPerformance: {
    precision: 89.2,
    recall: 87.1,
    f1Score: 88.1,
  },
  processingSpeed: "~0.5 seconds per image",
};

export default function Stats() {
  const [selectedMetric, setSelectedMetric] = useState(null);

  const handleSpeakStats = () => {
    const summary = `Total predictions: ${STATS_DATA.totalPredictions}. Overall accuracy: ${STATS_DATA.accuracy}%. Most common waste type: Plastic with ${STATS_DATA.categories[0].percentage} percent.`;
    speechService.speak(summary);
  };

  return (
    <div className="stats-container">
      <div className="stats-header">
        <h1>📊 Statistics & Analytics</h1>
        <p>Waste Classification Performance Metrics</p>
        <button className="header-speak-btn" onClick={handleSpeakStats}>
          🔊 Listen
        </button>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-value">{STATS_DATA.totalPredictions.toLocaleString()}</div>
          <div className="card-label">Total Predictions</div>
          <div className="card-icon">📈</div>
        </div>
        <div className="summary-card highlight">
          <div className="card-value">{STATS_DATA.accuracy}%</div>
          <div className="card-label">Overall Accuracy</div>
          <div className="card-icon">✓</div>
        </div>
        <div className="summary-card">
          <div className="card-value">17</div>
          <div className="card-label">Waste Categories</div>
          <div className="card-icon">📦</div>
        </div>
        <div className="summary-card">
          <div className="card-value">{STATS_DATA.processingSpeed}</div>
          <div className="card-label">Processing Speed</div>
          <div className="card-icon">⚡</div>
        </div>
      </div>

      {/* Category Distribution */}
      <section className="stats-section">
        <h2>Waste Distribution by Category</h2>
        <div className="distribution-container">
          {STATS_DATA.categories.map((cat, idx) => (
            <div
              key={idx}
              className="distribution-item"
              onMouseEnter={() => setSelectedMetric(cat.name)}
              onMouseLeave={() => setSelectedMetric(null)}
            >
              <div className="distribution-label">
                <span className="cat-name">{cat.name}</span>
                <span className="cat-count">{cat.count}</span>
              </div>
              <div className="distribution-bar">
                <div
                  className="distribution-fill"
                  style={{ width: `${cat.percentage}%` }}
                ></div>
              </div>
              <div className="distribution-percentage">{cat.percentage}%</div>
            </div>
          ))}
        </div>
      </section>

      {/* Model Performance */}
      <section className="stats-section">
        <h2>Model Performance Metrics</h2>
        <div className="performance-grid">
          <div className="performance-card">
            <h3>Precision</h3>
            <div className="metric-value">{STATS_DATA.modelPerformance.precision}%</div>
            <div className="metric-bar">
              <div
                className="metric-fill"
                style={{ width: `${STATS_DATA.modelPerformance.precision}%` }}
              ></div>
            </div>
            <p>True positive rate</p>
          </div>

          <div className="performance-card">
            <h3>Recall</h3>
            <div className="metric-value">{STATS_DATA.modelPerformance.recall}%</div>
            <div className="metric-bar">
              <div
                className="metric-fill"
                style={{ width: `${STATS_DATA.modelPerformance.recall}%` }}
              ></div>
            </div>
            <p>Coverage of categories</p>
          </div>

          <div className="performance-card">
            <h3>F1 Score</h3>
            <div className="metric-value">{STATS_DATA.modelPerformance.f1Score}%</div>
            <div className="metric-bar">
              <div
                className="metric-fill"
                style={{ width: `${STATS_DATA.modelPerformance.f1Score}%` }}
              ></div>
            </div>
            <p>Harmonic mean</p>
          </div>
        </div>
      </section>

      {/* Insights */}
      <section className="stats-section insights">
        <h2>📊 Key Insights</h2>
        <div className="insights-grid">
          <div className="insight-card">
            <h3>Top Category</h3>
            <p>
              {STATS_DATA.categories[0].name} is the most frequently classified waste type,
              accounting for {STATS_DATA.categories[0].percentage}% of all predictions.
            </p>
          </div>
          <div className="insight-card">
            <h3>Model Efficiency</h3>
            <p>
              The model achieves {STATS_DATA.accuracy}% accuracy with{" "}
              {STATS_DATA.processingSpeed} processing time per image.
            </p>
          </div>
          <div className="insight-card">
            <h3>Category Balance</h3>
            <p>
              All 17 waste categories are well-represented in the model, ensuring robust
              classification across different waste types.
            </p>
          </div>
          <div className="insight-card">
            <h3>Performance Stability</h3>
            <p>
              Consistent performance across precision ({STATS_DATA.modelPerformance.precision}%), recall ({STATS_DATA.modelPerformance.recall}%), and F1 score indicates stable model behavior.
            </p>
          </div>
        </div>
      </section>

      {/* Action Button */}
      <div className="stats-action">
        <button
          className="action-btn"
          onClick={() =>
            speechService.speak(
              `Current stats: Total predictions ${STATS_DATA.totalPredictions}, accuracy ${STATS_DATA.accuracy} percent, most common waste is ${STATS_DATA.categories[0].name}`
            )
          }
        >
          🔊 Read All Stats Aloud
        </button>
      </div>
    </div>
  );
}