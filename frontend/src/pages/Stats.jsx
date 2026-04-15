import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { speechService } from "../utils/speechService";

const STATS_DATA = {
  totalPredictions: 5240,
  accuracy: 87,
  processingSpeed: "0.45s",
  categories: [
    { name: "Plastic", count: 1248, percentage: 24, color: "#10b981" },
    { name: "Metal", count: 890, percentage: 17, color: "#3b82f6" },
    { name: "Glass", count: 756, percentage: 14, color: "#06b6d4" },
    { name: "Paper", count: 628, percentage: 12, color: "#94a3b8" },
    { name: "Organic", count: 520, percentage: 10, color: "#059669" },
    { name: "Electronic", count: 408, percentage: 8, color: "#8b5cf6" },
    { name: "Cardboard", count: 314, percentage: 6, color: "#92400e" },
    { name: "Other", count: 476, percentage: 9, color: "#64748b" }
  ],
  modelPerformance: {
    precision: 86,
    recall: 88,
    f1Score: 87
  }
};

export default function Stats() {
  const [activeTab, setActiveTab] = useState('distribution');
  const navigate = useNavigate();

  const handleSpeakStats = () => {
    const summary = `System Performance Overview: Total predictions processed: ${STATS_DATA.totalPredictions}. Core accuracy: ${STATS_DATA.accuracy}%. Primary material detected: Plastic. Model health metrics are stable with an F1 score of ${STATS_DATA.modelPerformance.f1Score}%.`;
    speechService.speak(summary);
  };

  return (
    <div className="stats-container">
      <header className="stats-hero">
        <h1 className="gradient-text">Analytics Engine</h1>
        <p>Real-time insights into classification trends and model performance</p>
        <button className="stats-speak-btn" onClick={handleSpeakStats}>
          🔊 Generate Audio Report
        </button>
      </header>

      <div className="stats-summary-grid">
        <div className="stats-sum-card premium-card">
          <span className="sum-label">Total Classified</span>
          <h2 className="sum-value">{STATS_DATA.totalPredictions.toLocaleString()}</h2>
          <div className="sum-footer green">↑ 12% from last month</div>
        </div>
        <div className="stats-sum-card premium-card">
          <span className="sum-label">Model Accuracy</span>
          <h2 className="sum-value">{STATS_DATA.accuracy}%</h2>
          <div className="sum-footer blue">Optimized MobileNetV2</div>
        </div>
        <div className="stats-sum-card premium-card">
          <span className="sum-label">Avg. Latency</span>
          <h2 className="sum-value">{STATS_DATA.processingSpeed}</h2>
          <div className="sum-footer purple">Edge Inference</div>
        </div>
      </div>

      <main className="stats-content premium-card">
        <div className="stats-tabs">
          <button 
            className={activeTab === 'distribution' ? 'tab active' : 'tab'} 
            onClick={() => setActiveTab('distribution')}
          >
            Material Distribution
          </button>
          <button 
            className={activeTab === 'performance' ? 'tab active' : 'tab'} 
            onClick={() => setActiveTab('performance')}
          >
            Model Performance
          </button>
        </div>

        <div className="tab-pane">
          {activeTab === 'distribution' ? (
            <div className="distribution-view">
              <h3>Volume by Category</h3>
              <div className="dist-list">
                {STATS_DATA.categories.map((cat, i) => (
                  <div key={i} className="dist-row">
                    <div className="dist-info">
                      <span className="dist-name">{cat.name}</span>
                      <span className="dist-val">{cat.count} units</span>
                    </div>
                    <div className="dist-track">
                      <div 
                        className="dist-fill" 
                        style={{ width: `${cat.percentage}%`, background: cat.color }}
                      ></div>
                    </div>
                    <span className="dist-perc">{cat.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="performance-view">
              <h3>Confusion Matrix Metrics</h3>
              <div className="perf-grid">
                {[
                  { label: "Precision", val: STATS_DATA.modelPerformance.precision, desc: "Positive predictive value" },
                  { label: "Recall", val: STATS_DATA.modelPerformance.recall, desc: "Sensitivity or true positive rate" },
                  { label: "F1 Score", val: STATS_DATA.modelPerformance.f1Score, desc: "Harmonic mean of precision and recall" }
                ].map((m, i) => (
                  <div key={i} className="perf-metric">
                    <div className="metric-ring">
                      <svg viewBox="0 0 36 36">
                        <path className="ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="ring-fill" strokeDasharray={`${m.val}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <text x="18" y="20.35" className="ring-text">{m.val}%</text>
                      </svg>
                    </div>
                    <h4>{m.label}</h4>
                    <p>{m.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <section className="stats-insights">
        <h2 className="section-title">Environmental Impact</h2>
        <div className="insights-grid">
          <div className="insight-item premium-card">
            <div className="insight-icon">🌳</div>
            <h4>Carbon Offset</h4>
            <p>Properly classifying 5k+ waste items has potentially prevented 1.2 tons of CO2 emissions.</p>
          </div>
          <div className="insight-item premium-card">
            <div className="insight-icon">💧</div>
            <h4>Water Conserved</h4>
            <p>Recycling identified paper and metal has saved approximately 15,000 liters of industrial water use.</p>
          </div>
        </div>
      </section>

      <section className="nlp-query-section premium-card">
        <div className="nlp-header">
          <div className="nlp-label">NLP ELECTIVE COMPONENT</div>
          <h2>Smart Query Interface</h2>
          <p>Ask natural language questions about your waste metrics and system performance in plain English — powered by a multi-intent NLP engine with 12+ intent types.</p>
        </div>
        <div className="nlp-preview-grid">
          {[
            "How many items today?",
            "Most common waste type?",
            "Compare plastic vs metal",
            "Model accuracy this week?"
          ].map((q) => (
            <div key={q} className="nlp-preview-chip">
              <span>💬</span> {q}
            </div>
          ))}
        </div>
        <button className="nlp-goto-btn" onClick={() => navigate('/nlp')}>
          🧠 Open NLP Query Engine →
        </button>
      </section>

      <style>{`
        .stats-container {
          animation: fadeInUp 0.8s ease-out;
          padding-bottom: 4rem;
        }

        .stats-hero {
          text-align: center;
          margin-bottom: 3.5rem;
        }
        .stats-hero h1 { font-size: 3.5rem; }
        .stats-hero p { color: var(--text-muted); font-size: 1.1rem; }

        .stats-speak-btn {
          margin-top: 2rem;
          background: var(--text-main);
          color: white;
          border: none;
          padding: 0.8rem 2rem;
          border-radius: 100px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .stats-speak-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }

        .stats-summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
        }
        .stats-sum-card {
          padding: 2rem;
          text-align: left;
        }
        .sum-label {
          color: var(--text-muted);
          font-weight: 700;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .sum-value {
          font-size: 2.5rem;
          font-weight: 800;
          margin: 0.5rem 0;
          color: var(--text-main);
        }
        .sum-footer {
          font-size: 0.9rem;
          font-weight: 600;
        }
        .sum-footer.green { color: var(--primary); }
        .sum-footer.blue { color: var(--secondary); }
        .sum-footer.purple { color: var(--accent); }

        .stats-content {
          padding: 0;
          overflow: hidden;
          margin-bottom: 5rem;
        }
        .stats-tabs {
          display: flex;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }
        .tab {
          flex: 1;
          padding: 1.5rem;
          border: none;
          background: transparent;
          font-weight: 700;
          font-family: inherit;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.3s;
        }
        .tab.active {
          color: var(--primary);
          background: white;
          border-bottom: 2px solid var(--primary);
        }

        .tab-pane {
          padding: 3rem;
        }

        .dist-row {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 1.25rem;
        }
        .dist-info {
          width: 150px;
          display: flex;
          flex-direction: column;
        }
        .dist-name { font-weight: 700; }
        .dist-val { font-size: 0.8rem; color: var(--text-muted); }
        .dist-track {
          flex: 1;
          height: 12px;
          background: #f1f5f9;
          border-radius: 100px;
          overflow: hidden;
        }
        .dist-fill { height: 100%; border-radius: 100px; }
        .dist-perc { width: 50px; font-weight: 800; text-align: right; }

        .perf-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem;
        }
        .perf-metric { text-align: center; }
        .metric-ring { width: 120px; margin: 0 auto 1.5rem; }
        .ring-bg { fill: none; stroke: #f1f5f9; stroke-width: 3.5; }
        .ring-fill { fill: none; stroke: var(--primary); stroke-width: 3.5; stroke-linecap: round; transition: stroke-dasharray 1s ease; }
        .ring-text { fill: var(--text-main); font-size: 0.5rem; font-weight: 800; text-anchor: middle; }

        .insights-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 2rem;
        }
        .insight-item { padding: 2rem; display: flex; gap: 1.5rem; align-items: flex-start; }
        .insight-icon { font-size: 2.5rem; }
        .insight-item h4 { font-size: 1.2rem; font-weight: 700; margin-bottom: 0.5rem; }
        .insight-item p { color: var(--text-muted); line-height: 1.6; }

        @media (max-width: 768px) {
          .tab-pane { padding: 1.5rem; }
          .perf-grid { grid-template-columns: 1fr; }
          .dist-info { width: 100px; }
          .insights-grid { grid-template-columns: 1fr; }
        }

        .nlp-query-section {
          padding: 3.5rem;
          background: linear-gradient(135deg, white, #f8fafc);
          margin-top: 4rem;
        }
        .nlp-header { margin-bottom: 2.5rem; }
        .nlp-label {
          display: inline-block;
          background: rgba(16, 185, 129, 0.1);
          color: var(--primary);
          padding: 0.4rem 1rem;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }
        .nlp-header h2 { font-size: 2rem; margin-bottom: 0.5rem; }
        .nlp-header p { color: var(--text-muted); }

        .nlp-preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .nlp-preview-chip {
          background: rgba(16,185,129,.07);
          border: 1px solid rgba(16,185,129,.2);
          border-radius: 14px;
          padding: 1rem 1.25rem;
          font-size: .9rem;
          font-weight: 600;
          color: var(--text-main);
          display: flex;
          align-items: center;
          gap: .6rem;
        }
        .nlp-goto-btn {
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
          border: none;
          padding: 1rem 2.5rem;
          border-radius: 16px;
          font-weight: 800;
          font-size: 1rem;
          font-family: inherit;
          cursor: pointer;
          transition: .3s;
        }
        .nlp-goto-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(16,185,129,.35);
        }
      `}</style>
    </div>
  );
}