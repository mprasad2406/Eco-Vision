import React, { useState } from "react";
import { speechService } from "../utils/speechService";

const STATS_DATA = {
  totalPredictions: 5240,
  accuracy: 87,
  processingSpeed: "0.45s",
  categories: [
    { name: "Plastic", count: 1248, percentage: 24 },
    { name: "Metal", count: 890, percentage: 17 },
    { name: "Glass", count: 756, percentage: 14 },
    { name: "Paper", count: 628, percentage: 12 },
    { name: "Organic", count: 520, percentage: 10 },
    { name: "Electronic", count: 408, percentage: 8 },
    { name: "Cardboard", count: 314, percentage: 6 },
    { name: "Other", count: 476, percentage: 9 }
  ],
  modelPerformance: {
    precision: 86,
    recall: 88,
    f1Score: 87
  }
};

export default function Stats() {
  const [selectedMetric, setSelectedMetric] = useState(null);
  const handleSpeakStats = () => {
    const summary = `Total predictions: ${STATS_DATA.totalPredictions}. Overall accuracy: ${STATS_DATA.accuracy}%. Most common waste type: Plastic with ${STATS_DATA.categories[0].percentage} percent.`;
    speechService.speak(summary);
  };

  return (
    <div className="stats-container">
      <div className="stats-header"><h1>📊 Statistics & Analytics</h1><p>Waste Classification Performance Metrics</p><button className="header-speak-btn" onClick={handleSpeakStats}>🔊 Listen</button></div>
      <div className="summary-cards">
        <div className="summary-card"><div className="card-value">{STATS_DATA.totalPredictions.toLocaleString()}</div><div className="card-label">Total Predictions</div><div className="card-icon">📈</div></div>
        <div className="summary-card highlight"><div className="card-value">{STATS_DATA.accuracy}%</div><div className="card-label">Overall Accuracy</div><div className="card-icon">✓</div></div>
        <div className="summary-card"><div className="card-value">17</div><div className="card-label">Waste Categories</div><div className="card-icon">📦</div></div>
        <div className="summary-card"><div className="card-value">{STATS_DATA.processingSpeed}</div><div className="card-label">Processing Speed</div><div className="card-icon">⚡</div></div>
      </div>
      <section className="stats-section"><h2>Waste Distribution by Category</h2><div className="distribution-container">{STATS_DATA.categories.map((cat, idx) => (<div key={idx} className="distribution-item" onMouseEnter={() => setSelectedMetric(cat.name)} onMouseLeave={() => setSelectedMetric(null)}><div className="distribution-label"><span className="cat-name">{cat.name}</span><span className="cat-count">{cat.count}</span></div><div className="distribution-bar"><div className="distribution-fill" style={{ width: `${cat.percentage}%` }}></div></div><div className="distribution-percentage">{cat.percentage}%</div></div>))}</div></section>
      <section className="stats-section"><h2>Model Performance Metrics</h2><div className="performance-grid"><div className="performance-card"><h3>Precision</h3><div className="metric-value">{STATS_DATA.modelPerformance.precision}%</div><div className="metric-bar"><div className="metric-fill" style={{ width: `${STATS_DATA.modelPerformance.precision}%` }}></div></div><p>True positive rate</p></div><div className="performance-card"><h3>Recall</h3><div className="metric-value">{STATS_DATA.modelPerformance.recall}%</div><div className="metric-bar"><div className="metric-fill" style={{ width: `${STATS_DATA.modelPerformance.recall}%` }}></div></div><p>Coverage of categories</p></div><div className="performance-card"><h3>F1 Score</h3><div className="metric-value">{STATS_DATA.modelPerformance.f1Score}%</div><div className="metric-bar"><div className="metric-fill" style={{ width: `${STATS_DATA.modelPerformance.f1Score}%` }}></div></div><p>Harmonic mean</p></div></div></section>
      <section className="stats-section insights"><h2>📊 Key Insights</h2><div className="insights-grid"><div className="insight-card"><h3>Top Category</h3><p>{STATS_DATA.categories[0].name} is the most frequently classified waste type, accounting for {STATS_DATA.categories[0].percentage}% of all predictions.</p></div><div className="insight-card"><h3>Model Efficiency</h3><p>The model achieves {STATS_DATA.accuracy}% accuracy with {STATS_DATA.processingSpeed} processing time per image.</p></div><div className="insight-card"><h3>Category Balance</h3><p>All 17 waste categories are well-represented in the model, ensuring robust classification across different waste types.</p></div><div className="insight-card"><h3>Performance Stability</h3><p>Consistent performance across precision ({STATS_DATA.modelPerformance.precision}%), recall ({STATS_DATA.modelPerformance.recall}%), and F1 score indicates stable model behavior.</p></div></div></section>
      <div className="stats-action"><button className="action-btn" onClick={() => speechService.speak(`Current stats: Total predictions ${STATS_DATA.totalPredictions}, accuracy ${STATS_DATA.accuracy} percent, most common waste is ${STATS_DATA.categories[0].name}`)}>🔊 Read All Stats Aloud</button></div>
      <section className="stats-showcase">
        <h2>Waste Classification Examples</h2>
        <div className="showcase-gallery">
          <div className="gallery-item">
            <img src="https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=400&h=300&fit=crop" alt="Electronics" />
            <h3>Electronics & E-Waste</h3>
            <p className="gallery-stat">6% of predictions</p>
            <p>Circuit boards, keyboards, and mobile devices properly classified</p>
          </div>
          <div className="gallery-item">
            <img src="https://images.unsplash.com/photo-1584361298901-f66c73f72f46?w=400&h=300&fit=crop" alt="Plastic" />
            <h3>Plastic Waste (24%)</h3>
            <p className="gallery-stat">Most common category</p>
            <p>PET bottles, bags, and plastic containers from daily use</p>
          </div>
          <div className="gallery-item">
            <img src="https://images.unsplash.com/photo-1572949645581-9b0b48f57264?w=400&h=300&fit=crop" alt="Organic" />
            <h3>Organic Materials</h3>
            <p className="gallery-stat">10% of predictions</p>
            <p>Food waste, garden materials, and biodegradable items</p>
          </div>
        </div>
      </section>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes imagePan { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        
        .stats-showcase { margin-top: 3rem; padding: 3rem 2rem; background: linear-gradient(135deg, rgba(30, 111, 92, 0.08), rgba(34, 197, 94, 0.05)); border-radius: 28px; animation: fadeIn 0.8s ease-out; }
        .stats-showcase h2 { text-align: center; font-size: 2rem; background: linear-gradient(135deg, #1e6f5c, #16a34a); background-clip: text; -webkit-background-clip: text; color: transparent; margin-bottom: 3rem; font-weight: 800; }
        .showcase-gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2.5rem; }
        .gallery-item { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(30, 111, 92, 0.1); transition: all 0.4s ease; animation: fadeIn 0.8s ease-out backwards; }
        .gallery-item:nth-child(1) { animation-delay: 0.2s; }
        .gallery-item:nth-child(2) { animation-delay: 0.3s; }
        .gallery-item:nth-child(3) { animation-delay: 0.4s; }
        .gallery-item img { width: 100%; height: 250px; object-fit: cover; transition: transform 0.6s ease; animation: imagePan 4s ease-in-out infinite; }
        .gallery-item:hover img { transform: scale(1.08); animation: none; }
        .gallery-item h3 { font-size: 1.3rem; color: #1e6f5c; margin: 1rem; font-weight: 700; }
        .gallery-stat { color: #16a34a; font-weight: 700; margin: -0.5rem 1rem 0.5rem 1rem; font-size: 0.95rem; }
        .gallery-item p { color: #475569; font-size: 0.9rem; padding: 0 1rem 1rem 1rem; line-height: 1.5; margin: 0; }
        .gallery-item:hover { transform: translateY(-8px); box-shadow: 0 16px 40px rgba(30, 111, 92, 0.15); }
        
        .stats-container { max-width: 1100px; margin: 0 auto; }
        .stats-header { text-align: center; margin-bottom: 2rem; }
        .summary-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
        .summary-card { background: white; border-radius: 24px; padding: 1.2rem; text-align: center; position: relative; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
        .card-value { font-size: 2rem; font-weight: 700; color: #1e6f5c; }
        .card-label { color: #5a6e7c; }
        .card-icon { font-size: 2rem; margin-top: 0.5rem; }
        .stats-section { background: white; border-radius: 28px; padding: 1.5rem; margin-bottom: 2rem; }
        .distribution-item { margin-bottom: 1rem; }
        .distribution-label { display: flex; justify-content: space-between; margin-bottom: 0.3rem; }
        .distribution-bar { background: #eef2f7; border-radius: 20px; height: 8px; overflow: hidden; }
        .distribution-fill { background: #1e6f5c; height: 100%; border-radius: 20px; }
        .performance-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; }
        .performance-card { background: #f8fafc; border-radius: 20px; padding: 1rem; text-align: center; }
        .metric-value { font-size: 1.8rem; font-weight: 700; }
        .metric-bar { background: #eef2f7; border-radius: 20px; height: 6px; margin: 0.5rem 0; }
        .metric-fill { background: #1e6f5c; height: 100%; border-radius: 20px; }
        .insights-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; }
        .insight-card { background: #f8fafc; border-radius: 20px; padding: 1rem; }
        .stats-action { text-align: center; margin-top: 1rem; }
        .action-btn { background: #1e6f5c; color: white; border: none; border-radius: 40px; padding: 0.8rem 1.5rem; cursor: pointer; }
        @media (max-width: 768px) { .stats-container { padding: 0 1rem; } .showcase-gallery { grid-template-columns: 1fr; } .stats-showcase { padding: 1.5rem; } }
      `}</style>
    </div>
  );
}