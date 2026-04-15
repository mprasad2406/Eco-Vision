import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";
import { speechService } from "../utils/speechService";

export default function Navbar() {
  const location = useLocation();
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isListening, setIsListening] = useState(false);

  const handleSpeechToggle = () => {
    if (!speechService.isSupported()) {
      alert("Speech Recognition is not supported in your browser");
      return;
    }
    if (!isSpeechEnabled) {
      const rec = speechService.initializeRecognition(
        (transcript) => {
          console.log("Heard:", transcript);
          navigateByVoice(transcript.toLowerCase());
        },
        (error) => {
          console.error("Speech error:", error);
          setIsListening(false);
        }
      );
      setRecognition(rec);
      setIsSpeechEnabled(true);
    } else {
      if (recognition) {
        speechService.stopListening(recognition);
      }
      setIsSpeechEnabled(false);
      setIsListening(false);
    }
  };

  const handleMicClick = () => {
    if (!isSpeechEnabled) {
      alert("Enable speech mode first using the speech button");
      return;
    }
    if (!isListening) {
      speechService.startListening(recognition);
      setIsListening(true);
    } else {
      speechService.stopListening(recognition);
      setIsListening(false);
    }
  };

  const navigateByVoice = (transcript) => {
    if (transcript.includes("home")) window.location.href = "/home";
    else if (transcript.includes("predict")) window.location.href = "/predict";
    else if (transcript.includes("categor")) window.location.href = "/categories";
    else if (transcript.includes("stats") || transcript.includes("statistic")) window.location.href = "/stats";
    else if (transcript.includes("about")) window.location.href = "/about";
    else if (transcript.includes("contact")) window.location.href = "/contact";
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <Logo />
          <Link to="/home" className="brand-text">
            <span className="brand-eco">Eco</span>
            <span className="brand-vision">Vision</span>
          </Link>
        </div>
        <div className="navbar-menu">
          <Link to="/home" className={`nav-link ${isActive("/home") ? "active" : ""}`}>Home</Link>
          <Link to="/predict" className={`nav-link ${isActive("/predict") ? "active" : ""}`}>Predict</Link>
          <Link to="/categories" className={`nav-link ${isActive("/categories") ? "active" : ""}`}>Categories</Link>
          <Link to="/stats" className={`nav-link ${isActive("/stats") ? "active" : ""}`}>Stats</Link>
          <Link to="/about" className={`nav-link ${isActive("/about") ? "active" : ""}`}>About</Link>
          <Link to="/contact" className={`nav-link ${isActive("/contact") ? "active" : ""}`}>Contact</Link>
        </div>
        <div className="navbar-controls">
          <button className={`speech-btn ${isSpeechEnabled ? "active" : ""}`} onClick={handleSpeechToggle} title={isSpeechEnabled ? "Disable Speech" : "Enable Speech"}>🎤</button>
          {isSpeechEnabled && (
            <button className={`mic-btn ${isListening ? "listening" : ""}`} onClick={handleMicClick} title={isListening ? "Stop Listening" : "Start Listening"}>
              {isListening ? "🔴" : "⚪"}
            </button>
          )}
        </div>
      </nav>
      <style>{`
        .navbar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(240, 253, 244, 0.95));
          backdrop-filter: blur(20px);
          padding: 1rem 2rem;
          border-bottom: 2px solid rgba(34, 197, 94, 0.2);
          box-shadow: 0 4px 30px rgba(34, 197, 94, 0.08);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .navbar-brand { display: flex; align-items: center; gap: 0.75rem; }
        .brand-text { text-decoration: none; font-size: 1.7rem; font-weight: 800; letter-spacing: -1px; }
        .brand-eco { background: linear-gradient(135deg, #16a34a, #22c55e); background-clip: text; -webkit-background-clip: text; color: transparent; }
        .brand-vision { color: #1e293b; font-weight: 700; }
        .navbar-menu { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .nav-link { 
          padding: 0.6rem 1.4rem; 
          text-decoration: none; 
          color: #475569; 
          font-weight: 600; 
          border-radius: 50px; 
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); 
          position: relative;
          letter-spacing: 0.5px;
        }
        .nav-link::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.08));
          border-radius: 50px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .nav-link:hover { 
          color: #16a34a;
        }
        .nav-link:hover::before { opacity: 1; }
        .nav-link.active { 
          background: linear-gradient(135deg, #16a34a, #15803d); 
          color: white;
          box-shadow: 0 8px 20px rgba(34, 197, 94, 0.3);
        }
        .navbar-controls { display: flex; gap: 0.75rem; }
        .speech-btn, .mic-btn { 
          background: rgba(34, 197, 94, 0.1); 
          border: 1px solid rgba(34, 197, 94, 0.2); 
          border-radius: 50px; 
          padding: 0.6rem 1rem; 
          font-size: 1.3rem; 
          cursor: pointer; 
          transition: all 0.3s ease;
          color: #16a34a;
        }
        .speech-btn:hover { 
          background: rgba(34, 197, 94, 0.15); 
          border-color: rgba(34, 197, 94, 0.4);
        }
        .speech-btn.active { 
          background: linear-gradient(135deg, #16a34a, #15803d); 
          border-color: #16a34a;
          color: white;
          box-shadow: 0 8px 20px rgba(34, 197, 94, 0.3);
        }
        .mic-btn.listening { 
          background: linear-gradient(135deg, #ef4444, #dc2626); 
          border-color: #dc2626;
          color: white; 
          animation: pulse 1s infinite; 
        }
        @keyframes pulse { 0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); } 50% { transform: scale(1.05); box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); } 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } }
        @media (max-width: 768px) {
          .navbar { flex-direction: column; gap: 1rem; padding: 1rem; }
          .navbar-menu { justify-content: center; }
          .nav-link { padding: 0.5rem 1rem; font-size: 0.9rem; }
        }
      `}</style>
    </>
  );
}