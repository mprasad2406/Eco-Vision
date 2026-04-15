import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

export default function Landing() {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    { url: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=1200", title: "Smart Innovation", desc: "Leading the way in sustainable tech" },
    { url: "https://images.unsplash.com/photo-1532187863486-abf713177363?auto=format&fit=crop&q=80&w=1200", title: "Precision Detection", desc: "AI-powered material classification" },
    { url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200", title: "Automated Sorting", desc: "Robotic precision in waste management" },
    { url: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=1200", title: "AI Core", desc: "Deep learning for environmental impact" },
    { url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200", title: "Data Driven", desc: "Real-time analytics and insights" },
    { url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200", title: "Eco Collaboration", desc: "Connected platforms for a greener planet" },
    { url: "https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80&w=1200", title: "Future Metrics", desc: "Tracking sustainability progress" },
    { url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200", title: "Global Network", desc: "Connecting recycling ecosystems" },
    { url: "https://images.unsplash.com/photo-1614850715649-1d0106293bd1?auto=format&fit=crop&q=80&w=1200", title: "Digital Flow", desc: "Optimizing waste logistics" },
    { url: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1200", title: "Zero Waste", desc: "Minimalist approach to resource management" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="landing-container">
      <div className="landing-content">
        <div className="landing-logo"><Logo /></div>
        <h1 className="landing-title">Eco-Vision</h1>
        <p className="landing-subtitle">Smart Waste Classification System</p>
        <div className="landing-description">
          <p>Revolutionizing waste management through Artificial Intelligence. Automatically classify waste into 17 categories with 85-90% accuracy.</p>
        </div>
        <div className="landing-features">
          <div className="feature-box"><span className="feature-icon">🤖</span><h3>AI-Powered</h3><p>Advanced deep learning models</p></div>
          <div className="feature-box"><span className="feature-icon">📸</span><h3>Fast Recognition</h3><p>Real-time waste classification</p></div>
          <div className="feature-box"><span className="feature-icon">♻️</span><h3>Eco-Friendly</h3><p>Support sustainable practices</p></div>
          <div className="feature-box"><span className="feature-icon">📊</span><h3>Analytics</h3><p>Detailed statistics & insights</p></div>
        </div>
        <button className="cta-button" onClick={() => navigate("/home")}>Get Started</button>
        <div className="landing-stats">
          <div className="stat"><span className="stat-number">17</span><span className="stat-label">Waste Categories</span></div>
          <div className="stat"><span className="stat-number">90%</span><span className="stat-label">Accuracy Rate</span></div>
          <div className="stat"><span className="stat-number">Real-time</span><span className="stat-label">Processing</span></div>
        </div>
      </div>
      
      <div className="landing-showcase-slider">
        <h2 className="showcase-title">Excellence in Action</h2>
        <div className="slider-viewport">
          {slides.map((slide, index) => (
            <div key={index} className={`slider-item ${index === activeSlide ? 'active' : ''}`}>
              <div className="image-wrapper">
                <img src={slide.url} alt={slide.title} className="showcase-image" />
                <div className="image-overlay">
                  <h3>{slide.title}</h3>
                  <p>{slide.desc}</p>
                </div>
              </div>
            </div>
          ))}
          <div className="slider-indicators">
            {slides.map((_, index) => (
              <div 
                key={index} 
                className={`indicator ${index === activeSlide ? 'active' : ''}`}
                onClick={() => setActiveSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Plus+Jakarta+Sans:wght@300;400;600;800&display=swap');

        @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.2); } 50% { box-shadow: 0 0 40px rgba(34, 197, 94, 0.5); } }
        
        .landing-container { 
          font-family: 'Plus Jakarta Sans', sans-serif;
          min-height: 100vh; 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          background: radial-gradient(circle at top left, #f0fdf4 0%, #ecfdf5 30%, #f0f9ff 100%); 
          padding: 6rem 2rem; 
          position: relative; 
          overflow-x: hidden;
        }
        
        .landing-container::before {
          content: '';
          position: absolute;
          top: -100px;
          right: -100px;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%);
          z-index: 1;
        }

        .landing-content { 
          max-width: 1200px; 
          text-align: center; 
          color: #0f172a; 
          position: relative; 
          z-index: 10;
          margin-bottom: 8rem;
        }

        .landing-logo { 
          display: flex; 
          justify-content: center; 
          margin-bottom: 2rem; 
          animation: scaleIn 1s cubic-bezier(0.34, 1.56, 0.64, 1);
          filter: drop-shadow(0 10px 15px rgba(22, 163, 74, 0.2));
        }

        .landing-title { 
          font-family: 'Outfit', sans-serif;
          font-size: clamp(3.5rem, 12vw, 6.5rem); 
          font-weight: 800; 
          background: linear-gradient(90deg, #065f46, #10b981, #065f46);
          background-size: 200% auto;
          background-clip: text; 
          -webkit-background-clip: text; 
          color: transparent;
          animation: fadeInDown 1s ease-out, shimmer 4s linear infinite;
          margin-bottom: 0.5rem; 
          letter-spacing: -4px;
          line-height: 1;
        }

        .landing-subtitle { 
          font-size: 2rem; 
          color: #047857; 
          margin-bottom: 2rem; 
          animation: fadeIn 1s ease-out 0.3s backwards;
          font-weight: 600;
          letter-spacing: -0.5px;
        }

        .landing-description { 
          max-width: 800px; 
          margin: 0 auto 4rem; 
          font-size: 1.4rem; 
          color: #475569; 
          animation: fadeIn 1s ease-out 0.5s backwards;
          line-height: 1.6;
          font-weight: 400;
        }
        
        .landing-features { 
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 2.5rem; 
          margin: 5rem 0; 
          width: 100%;
          max-width: 1100px;
        }

        .feature-box { 
          background: rgba(255, 255, 255, 0.6); 
          backdrop-filter: blur(20px); 
          border-radius: 32px; 
          padding: 3rem 2rem; 
          border: 1px solid rgba(255, 255, 255, 0.8); 
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); 
          animation: fadeIn 1s ease-out backwards; 
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .feature-box:nth-child(1) { animation-delay: 0.6s; }
        .feature-box:nth-child(2) { animation-delay: 0.7s; }
        .feature-box:nth-child(3) { animation-delay: 0.8s; }
        .feature-box:nth-child(4) { animation-delay: 0.9s; }

        .feature-box:hover { 
          transform: translateY(-15px) scale(1.02); 
          background: rgba(255, 255, 255, 0.9);
          border-color: #10b981; 
          box-shadow: 0 30px 60px rgba(16, 185, 129, 0.15); 
        }

        .feature-icon { 
          font-size: 3.5rem; 
          margin-bottom: 1.5rem; 
          filter: drop-shadow(0 10px 10px rgba(0,0,0,0.1));
          animation: float 4s ease-in-out infinite;
        }
        .feature-box:nth-child(2n) .feature-icon { animation-delay: 1s; }

        .feature-box h3 { color: #065f46; font-size: 1.5rem; margin-bottom: 0.75rem; font-weight: 700; }
        .feature-box p { color: #64748b; font-size: 1.1rem; line-height: 1.5; }
        
        .cta-button { 
          background: linear-gradient(135deg, #059669 0%, #10b981 100%); 
          color: white; 
          font-size: 1.4rem; 
          font-weight: 700; 
          padding: 1.4rem 4.5rem; 
          border-radius: 100px; 
          cursor: pointer; 
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
          border: none;
          box-shadow: 0 20px 40px rgba(16, 185, 129, 0.3);
          animation: slideUp 1s ease-out 1.1s backwards;
          position: relative;
          overflow: hidden;
        }

        .cta-button::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent);
          transform: rotate(45deg);
          transition: 0.5s;
          display: block;
        }

        .cta-button:hover { 
          transform: translateY(-5px) scale(1.05); 
          box-shadow: 0 25px 50px rgba(16, 185, 129, 0.5); 
        }
        .cta-button:hover::after { left: 100%; transition: 0.7s; }

        .landing-stats { 
          display: flex; 
          justify-content: center; 
          gap: 6rem; 
          margin-top: 6rem; 
          animation: fadeIn 1s ease-out 1.3s backwards; 
        }
        .stat { display: flex; flex-direction: column; align-items: center; }
        .stat-number { font-size: 3.5rem; font-weight: 800; color: #065f46; letter-spacing: -2px; }
        .stat-label { font-size: 1rem; color: #64748b; text-transform: uppercase; letter-spacing: 2px; font-weight: 600; margin-top: 0.5rem; }

        .landing-showcase-slider { 
          width: 100%; 
          max-width: 1200px; 
          margin: 0 auto 8rem; 
          text-align: center;
          position: relative;
          z-index: 5;
          animation: fadeIn 1.5s ease-out 1.5s backwards;
        }

        .showcase-title { font-size: 3rem; color: #065f46; margin-bottom: 4rem; font-weight: 800; letter-spacing: -1px; }

        .slider-viewport { 
          position: relative; 
          height: 650px; 
          width: 100%; 
          border-radius: 48px; 
          overflow: hidden; 
          box-shadow: 0 50px 100px rgba(0,0,0,0.12); 
          background: #f1f5f9;
          border: 8px solid white;
        }

        .slider-item { 
          position: absolute; 
          top: 0; 
          left: 0; 
          width: 100%; 
          height: 100%; 
          opacity: 0; 
          transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1); 
          transform: scale(1.1);
          visibility: hidden;
        }

        .slider-item.active { 
          opacity: 1; 
          transform: scale(1); 
          visibility: visible;
        }
        
        .slider-item .image-wrapper { width: 100%; height: 100%; position: relative; }
        .slider-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 6s linear; }
        .slider-item.active img { transform: scale(1.1); }
        
        .image-overlay { 
          position: absolute; 
          bottom: 0; 
          left: 0; 
          right: 0; 
          padding: 8rem 4rem 4rem; 
          background: linear-gradient(transparent, rgba(6, 95, 70, 0.9)); 
          color: white; 
          text-align: left; 
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }

        .image-overlay h3 { 
          font-size: 3rem; 
          margin-bottom: 1rem; 
          font-weight: 800; 
          transform: translateY(30px); 
          opacity: 0; 
          transition: all 0.8s 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); 
          letter-spacing: -1px;
        }

        .image-overlay p { 
          font-size: 1.4rem; 
          opacity: 0; 
          transform: translateY(30px); 
          transition: all 0.8s 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); 
          font-weight: 300;
        }

        .slider-item.active .image-overlay h3, 
        .slider-item.active .image-overlay p { transform: translateY(0); opacity: 1; }

        .slider-indicators { 
          position: absolute; 
          bottom: 40px; 
          left: 50%; 
          transform: translateX(-50%); 
          display: flex; 
          gap: 15px; 
          z-index: 10; 
          padding: 10px 20px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border-radius: 100px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .indicator { 
          width: 12px; 
          height: 12px; 
          border-radius: 50%; 
          background: rgba(255,255,255,0.4); 
          cursor: pointer; 
          transition: all 0.4s ease; 
        }

        .indicator:hover { background: rgba(255,255,255,0.8); }
        .indicator.active { background: #fff; width: 40px; border-radius: 20px; }

        @media (max-width: 1024px) {
          .landing-stats { gap: 3rem; }
          .slider-viewport { height: 500px; }
        }

        @media (max-width: 768px) {
          .slider-viewport { height: 400px; border-radius: 24px; border-width: 4px; }
          .landing-container { padding: 4rem 1.5rem; }
          .landing-stats { gap: 2rem; flex-wrap: wrap; margin-top: 4rem; }
          .stat-number { font-size: 2.5rem; }
          .image-overlay { padding: 4rem 2rem 2rem; }
          .image-overlay h3 { font-size: 1.8rem; }
          .image-overlay p { font-size: 1.1rem; }
          .showcase-title { font-size: 2.2rem; }
          .landing-title { letter-spacing: -2px; }
        }
      `}</style>
    </div>
  );
}