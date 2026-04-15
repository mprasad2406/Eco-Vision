import React from "react";
import { Link } from "react-router-dom";
import { speechService } from "../utils/speechService";

const Home = () => {
  const handleSpeak = () => {
    speechService.speak("Welcome to Eco-Vision. This is your dashboard for intelligent waste classification. Navigate to Predict to upload waste images, view all categories, check statistics, or learn more about our project.");
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Welcome to Eco-Vision</h1>
        <p>Your Smart Waste Classification Dashboard</p>
        <button className="header-speak-btn" onClick={handleSpeak}>🔊 Listen</button>
      </div>
      <div className="dashboard-grid">
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
      <section className="features-section">
        <h2>Key Features</h2>
        <div className="features-container">
          <div className="feature"><span className="feature-number">1</span><h3>Real-time Classification</h3><p>Upload images and get instant waste type predictions</p></div>
          <div className="feature"><span className="feature-number">2</span><h3>High Accuracy</h3><p>85-90% accuracy across all 17 waste categories</p></div>
          <div className="feature"><span className="feature-number">3</span><h3>Detailed Analytics</h3><p>Track and analyze waste classification patterns</p></div>
          <div className="feature"><span className="feature-number">4</span><h3>Voice Control</h3><p>Control the app using voice commands</p></div>
        </div>
      </section>
      <section className="stats-overview">
        <h2>Quick Stats</h2>
        <div className="stats-boxes">
          <div className="stat-box"><div className="stat-value">17</div><div className="stat-label">Waste Categories</div></div>
          <div className="stat-box"><div className="stat-value">90%</div><div className="stat-label">Accuracy Rate</div></div>
          <div className="stat-box"><div className="stat-value">MobileNetV2</div><div className="stat-label">Model Architecture</div></div>
          <div className="stat-box"><div className="stat-value">224x224</div><div className="stat-label">Input Resolution</div></div>
        </div>
      </section>
      <section className="showcase-section">
        <h2>Real-World Examples</h2>
        <div className="showcase-grid">
          <div className="showcase-card">
            <div className="showcase-image-wrapper">
              <img src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=500" alt="Electronic waste" className="showcase-image" />
            </div>
            <h3>Electronic Waste</h3>
            <p>Proper classification and recycling of electronic components</p>
          </div>
          <div className="showcase-card">
            <div className="showcase-image-wrapper">
              <img src="https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&q=80&w=500" alt="Organic waste" className="showcase-image" />
            </div>
            <h3>Organic Waste</h3>
            <p>Biodegradable materials suitable for composting</p>
          </div>
          <div className="showcase-card">
            <div className="showcase-image-wrapper">
              <img src="https://images.unsplash.com/photo-1495480174669-2da744453d70?auto=format&fit=crop&q=80&w=500" alt="Plastic waste" className="showcase-image" />
            </div>
            <h3>Plastic Waste</h3>
            <p>Recyclable plastics for processing and reuse</p>
          </div>
        </div>
      </section>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInBottom { from { opacity: 0; transform: translateY(40px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
        @keyframes glow { 0%, 100% { box-shadow: 0 8px 20px rgba(34, 197, 94, 0.1); } 50% { box-shadow: 0 12px 30px rgba(34, 197, 94, 0.2); } }
        @keyframes imagePan { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        
        .home-container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .home-header { text-align: center; margin-bottom: 3rem; animation: fadeIn 0.8s ease-out; }
        .home-header h1 { font-size: 3.5rem; background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%); background-clip: text; -webkit-background-clip: text; color: transparent; margin-bottom: 0.5rem; font-weight: 800; letter-spacing: -1px; }
        .home-header p { color: #475569; margin-top: 0.5rem; font-size: 1.2rem; font-weight: 500; }
        .header-speak-btn { background: linear-gradient(135deg, rgba(34, 197, 94, 0.12), rgba(59, 130, 246, 0.08)); border: 1px solid rgba(34, 197, 94, 0.2); color: #16a34a; border-radius: 50px; padding: 0.7rem 1.5rem; margin-top: 1.5rem; cursor: pointer; font-size: 1rem; font-weight: 600; transition: all 0.3s ease; backdrop-filter: blur(10px); }
        .header-speak-btn:hover { background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(59, 130, 246, 0.12)); border-color: rgba(34, 197, 94, 0.4); transform: translateY(-2px); box-shadow: 0 8px 20px rgba(34, 197, 94, 0.15); }
        
        .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; margin: 3rem 0; }
        .dashboard-card { background: linear-gradient(135deg, rgba(34, 197, 94, 0.08), rgba(59, 130, 246, 0.06)); border-radius: 20px; padding: 2.2rem; text-decoration: none; color: inherit; transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); box-shadow: 0 4px 15px rgba(34, 197, 94, 0.08); border: 2px solid rgba(34, 197, 94, 0.15); position: relative; overflow: hidden; backdrop-filter: blur(10px); animation: fadeIn 0.8s ease-out backwards; }
        .dashboard-card:nth-child(1) { animation-delay: 0.1s; }
        .dashboard-card:nth-child(2) { animation-delay: 0.2s; }
        .dashboard-card:nth-child(3) { animation-delay: 0.3s; }
        .dashboard-card:nth-child(4) { animation-delay: 0.4s; }
        .dashboard-card::before { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(34, 197, 94, 0.1), transparent); opacity: 0; transition: opacity 0.4s; }
        .dashboard-card:hover::before { opacity: 1; }
        .dashboard-card:hover { transform: translateY(-12px); box-shadow: 0 16px 40px rgba(34, 197, 94, 0.15); border-color: rgba(34, 197, 94, 0.3); }
        .card-icon { font-size: 3.5rem; margin-bottom: 1rem; display: inline-block; animation: bounce 2s ease-in-out infinite; }
        .dashboard-card:hover .card-icon { animation: bounce 0.6s ease-in-out 3; }
        .dashboard-card h2 { font-size: 1.6rem; margin-bottom: 0.8rem; color: #1e293b; font-weight: 700; }
        .dashboard-card p { color: #475569; line-height: 1.6; font-size: 0.95rem; }
        .card-arrow { position: absolute; bottom: 1.5rem; right: 1.8rem; font-size: 1.8rem; color: #16a34a; opacity: 0; transform: translateX(-8px); transition: all 0.3s ease; }
        .dashboard-card:hover .card-arrow { opacity: 1; transform: translateX(0); }
        
        .features-section { margin: 4rem 0; animation: fadeIn 1s ease-out 0.5s backwards; }
        .features-section h2 { text-align: center; font-size: 2rem; background: linear-gradient(135deg, #16a34a, #22c55e); background-clip: text; -webkit-background-clip: text; color: transparent; margin-bottom: 2.5rem; }
        .features-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 2rem; }
        .feature { background: linear-gradient(135deg, rgba(34, 197, 94, 0.08), rgba(59, 130, 246, 0.06)); border-radius: 16px; padding: 2rem; text-align: center; border: 1px solid rgba(34, 197, 94, 0.15); transition: all 0.4s ease; animation: fadeIn 0.8s ease-out backwards; box-shadow: 0 2px 8px rgba(34, 197, 94, 0.05); }
        .feature:nth-child(1) { animation-delay: 0.6s; }
        .feature:nth-child(2) { animation-delay: 0.7s; }
        .feature:nth-child(3) { animation-delay: 0.8s; }
        .feature:nth-child(4) { animation-delay: 0.9s; }
        .feature:hover { transform: translateY(-8px); background: linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(59, 130, 246, 0.1)); border-color: rgba(34, 197, 94, 0.3); box-shadow: 0 12px 30px rgba(34, 197, 94, 0.12); }
        .feature-number { display: inline-flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #16a34a, #15803d); color: white; width: 45px; height: 45px; border-radius: 50%; margin-bottom: 1rem; font-weight: 700; font-size: 1.3rem; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.25); }
        .feature h3 { color: #16a34a; font-size: 1.2rem; margin: 1rem 0 0.5rem 0; font-weight: 700; }
        .feature p { color: #475569; font-size: 0.95rem; line-height: 1.6; }
        
        .stats-overview { margin: 4rem 0; animation: fadeIn 1s ease-out 1s backwards; }
        .stats-overview h2 { text-align: center; font-size: 2rem; background: linear-gradient(135deg, #16a34a, #22c55e); background-clip: text; -webkit-background-clip: text; color: transparent; margin-bottom: 2.5rem; }
        .stats-boxes { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; }
        .stat-box { background: linear-gradient(135deg, rgba(34, 197, 94, 0.08), rgba(59, 130, 246, 0.06)); border-radius: 16px; padding: 2rem; text-align: center; border: 1px solid rgba(34, 197, 94, 0.15); transition: all 0.4s ease; animation: fadeIn 0.8s ease-out backwards; box-shadow: 0 2px 8px rgba(34, 197, 94, 0.05); }
        .stat-box:nth-child(1) { animation-delay: 1.1s; }
        .stat-box:nth-child(2) { animation-delay: 1.2s; }
        .stat-box:nth-child(3) { animation-delay: 1.3s; }
        .stat-box:nth-child(4) { animation-delay: 1.4s; }
        .stat-box:hover { transform: translateY(-6px); box-shadow: 0 12px 28px rgba(34, 197, 94, 0.12); border-color: rgba(34, 197, 94, 0.3); background: linear-gradient(135deg, rgba(34, 197, 94, 0.12), rgba(59, 130, 246, 0.08)); }
        .stat-value { font-size: 2.5rem; font-weight: 800; background: linear-gradient(135deg, #16a34a, #22c55e); background-clip: text; -webkit-background-clip: text; color: transparent; margin-bottom: 0.5rem; }
        .stat-label { color: #475569; font-size: 0.95rem; font-weight: 700; }
        
        .showcase-section { margin: 5rem 0; animation: fadeIn 1s ease-out 1.2s backwards; }
        .showcase-section h2 { text-align: center; font-size: 2rem; background: linear-gradient(135deg, #16a34a, #22c55e); background-clip: text; -webkit-background-clip: text; color: transparent; margin-bottom: 3rem; font-weight: 800; }
        .showcase-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2.5rem; }
        .showcase-card { animation: fadeIn 0.8s ease-out backwards; }
        .showcase-card:nth-child(1) { animation-delay: 1.3s; }
        .showcase-card:nth-child(2) { animation-delay: 1.4s; }
        .showcase-card:nth-child(3) { animation-delay: 1.5s; }
        .showcase-image-wrapper { position: relative; border-radius: 16px; overflow: hidden; margin-bottom: 1.5rem; box-shadow: 0 10px 35px rgba(34, 197, 94, 0.15); border: 2px solid rgba(34, 197, 94, 0.1); aspect-ratio: 4 / 3; background: linear-gradient(135deg, rgba(34, 197, 94, 0.08), rgba(59, 130, 246, 0.06)); }
        .showcase-image { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease-out; animation: imagePan 5s ease-in-out infinite; }
        .showcase-card:hover .showcase-image { animation: none; transform: scale(1.08); }
        .showcase-card h3 { font-size: 1.3rem; color: #16a34a; margin: 1rem 0 0.5rem 0; font-weight: 700; }
        .showcase-card p { color: #475569; font-size: 0.95rem; line-height: 1.6; }
        
        @media (max-width: 768px) {
          .home-header h1 { font-size: 2.2rem; }
          .dashboard-grid { grid-template-columns: 1fr; gap: 1.5rem; }
          .features-container { grid-template-columns: 1fr; gap: 1.5rem; }
          .stats-boxes { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
          .showcase-grid { grid-template-columns: 1fr; }
          .showcase-section h2 { font-size: 1.6rem; margin-bottom: 2rem; }
        }
      `}</style>
    </div>
  );
};

export default Home;