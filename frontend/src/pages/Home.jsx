import React from "react";
import { Link } from "react-router-dom";
import { speechService } from "../utils/speechService";

const Home = () => {
  const handleSpeak = () => {
    speechService.speak("Welcome to Eco-Vision. This is your dashboard for intelligent waste classification. Navigate to Predict to upload waste images, view all categories, check statistics, or learn more about our project.");
  };

  const navCards = [
    { to: "/predict", icon: "📸", title: "Predict Waste", desc: "Instantly classify waste with AI-powered vision.", color: "var(--primary)" },
    { to: "/categories", icon: "📦", title: "Categories", desc: "Explore 17+ types of recyclable materials.", color: "var(--secondary)" },
    { to: "/stats", icon: "📊", title: "Statistics", desc: "Visualize environmental impact and trends.", color: "var(--accent)" },
    { to: "/about", icon: "ℹ️", title: "About", desc: "Learn about our vision for a zero-waste world.", color: "var(--text-main)" }
  ];

  return (
    <div className="home-container">
      <header className="home-hero">
        <h1 className="gradient-text">Eco-Vision Dashboard</h1>
        <p>Smart Intelligence for Sustainable Waste Management</p>
        <button className="listen-btn" onClick={handleSpeak}>
          <span className="icon">🔊</span> Listen to Overview
        </button>
      </header>

      <div className="home-nav-grid">
        {navCards.map((card, idx) => (
          <Link to={card.to} key={idx} className="home-card premium-card">
            <div className="card-icon-wrapper" style={{'--card-color': card.color}}>
              {card.icon}
            </div>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
            <div className="card-footer">
              <span>Continue</span>
              <span className="arrow">→</span>
            </div>
          </Link>
        ))}
      </div>

      <section className="home-info-section">
        <h2 className="section-title">Why Eco-Vision?</h2>
        <div className="info-grid">
          <div className="info-item">
            <div className="info-icon">⚡</div>
            <h4>Real-time Processing</h4>
            <p>Get instant classification with 90% accuracy using our custom-trained MobileNetV2 architecture.</p>
          </div>
          <div className="info-item">
            <div className="info-icon">♻️</div>
            <h4>Eco Integration</h4>
            <p>Directly connected to local disposal guidelines for all identified waste categories.</p>
          </div>
          <div className="info-item">
            <div className="info-icon">🎙️</div>
            <h4>Accessibility</h4>
            <p>Voice-enabled navigation and audio descriptions for an inclusive user experience.</p>
          </div>
        </div>
      </section>

      <section className="home-showcase">
        <h2 className="section-title">Waste Segregation in Action</h2>
        <div className="showcase-grid">
          {[
            { img: "https://images.unsplash.com/photo-1550009158-9ebf69173e03", title: "E-Waste", tag: "Hazardous" },
            { img: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2", title: "Organic", tag: "Compostable" },
            { img: "https://images.unsplash.com/photo-1495480174669-2da744453d70", title: "Plastics", tag: "Recyclable" }
          ].map((item, i) => (
            <div key={i} className="showcase-card premium-card">
              <div className="image-wrapper">
                <img src={`${item.img}?auto=format&fit=crop&q=80&w=600`} alt={item.title} />
                <span className="tag">{item.tag}</span>
              </div>
              <div className="showcase-info">
                <h4>{item.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .home-container {
          padding-bottom: 4rem;
          animation: fadeInUp 0.8s ease-out;
        }

        .home-hero {
          text-align: center;
          margin-bottom: 4rem;
        }
        .home-hero h1 {
          font-size: clamp(2.5rem, 6vw, 4rem);
          margin-bottom: 0.5rem;
        }
        .home-hero p {
          color: var(--text-muted);
          font-size: 1.25rem;
          font-weight: 500;
        }

        .listen-btn {
          margin-top: 2rem;
          background: white;
          border: 1px solid rgba(0,0,0,0.05);
          padding: 0.75rem 1.5rem;
          border-radius: 100px;
          color: var(--primary-dark);
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
          transition: all 0.3s ease;
        }
        .listen-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.06);
          border-color: var(--primary);
        }

        .home-nav-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-bottom: 6rem;
        }

        .home-card {
          padding: 2.5rem;
          text-decoration: none;
          color: inherit;
        }
        .card-icon-wrapper {
          font-size: 3rem;
          width: 70px;
          height: 70px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 20px;
          margin-bottom: 1.5rem;
          box-shadow: 0 10px 20px rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.02);
        }
        .home-card h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
        }
        .home-card p {
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }
        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 700;
          color: var(--primary);
        }
        .card-footer .arrow {
          transition: transform 0.3s ease;
        }
        .home-card:hover .card-footer .arrow {
          transform: translateX(5px);
        }

        .section-title {
          text-align: center;
          font-size: 2.25rem;
          font-weight: 800;
          margin-bottom: 3.5rem;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 3rem;
          margin-bottom: 6rem;
        }
        .info-item {
          text-align: center;
        }
        .info-icon {
          font-size: 2.5rem;
          margin-bottom: 1.5rem;
          display: inline-block;
          background: white;
          width: 80px;
          height: 80px;
          line-height: 80px;
          border-radius: 50%;
          box-shadow: 0 10px 25px rgba(0,0,0,0.03);
        }
        .info-item h4 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        .info-item p {
          color: var(--text-muted);
          line-height: 1.6;
        }

        .home-showcase {
          margin-bottom: 4rem;
        }
        .showcase-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        .showcase-card {
          padding: 0;
          overflow: hidden;
        }
        .image-wrapper {
          position: relative;
          height: 250px;
        }
        .image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .showcase-card:hover img {
          transform: scale(1.1);
        }
        .tag {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(0,0,0,0.6);
          color: white;
          padding: 0.4rem 1rem;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 600;
          backdrop-filter: blur(4px);
        }
        .showcase-info {
          padding: 1.5rem;
          text-align: center;
        }
        .showcase-info h4 {
          font-size: 1.2rem;
          font-weight: 700;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .home-hero h1 { font-size: 2rem; }
          .home-nav-grid { grid-template-columns: 1fr; }
          .info-grid { gap: 2rem; }
        }
      `}</style>
    </div>
  );
};

export default Home;