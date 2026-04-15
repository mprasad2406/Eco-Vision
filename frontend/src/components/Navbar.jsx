import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";
import { speechService } from "../utils/speechService";
import "../styles/Navbar.css";

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
      // Enable speech
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
      // Disable speech
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
    if (transcript.includes("home")) {
      window.location.href = "/home";
    } else if (transcript.includes("predict")) {
      window.location.href = "/predict";
    } else if (transcript.includes("categor")) {
      window.location.href = "/categories";
    } else if (transcript.includes("stats") || transcript.includes("statistic")) {
      window.location.href = "/stats";
    } else if (transcript.includes("about")) {
      window.location.href = "/about";
    } else if (transcript.includes("contact")) {
      window.location.href = "/contact";
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Logo />
        <Link to="/home" className="brand-text">
          <span className="brand-eco">Eco</span>
          <span className="brand-vision">Vision</span>
        </Link>
      </div>

      <div className="navbar-menu">
        <Link to="/home" className={`nav-link ${isActive("/home") ? "active" : ""}`}>
          Home
        </Link>
        <Link to="/predict" className={`nav-link ${isActive("/predict") ? "active" : ""}`}>
          Predict
        </Link>
        <Link to="/categories" className={`nav-link ${isActive("/categories") ? "active" : ""}`}>
          Categories
        </Link>
        <Link to="/stats" className={`nav-link ${isActive("/stats") ? "active" : ""}`}>
          Stats
        </Link>
        <Link to="/about" className={`nav-link ${isActive("/about") ? "active" : ""}`}>
          About
        </Link>
        <Link to="/contact" className={`nav-link ${isActive("/contact") ? "active" : ""}`}>
          Contact
        </Link>
      </div>

      <div className="navbar-controls">
        <button
          className={`speech-btn ${isSpeechEnabled ? "active" : ""}`}
          onClick={handleSpeechToggle}
          title={isSpeechEnabled ? "Disable Speech" : "Enable Speech"}
        >
          🎤
        </button>
        {isSpeechEnabled && (
          <button
            className={`mic-btn ${isListening ? "listening" : ""}`}
            onClick={handleMicClick}
            title={isListening ? "Stop Listening" : "Start Listening"}
          >
            {isListening ? "🔴" : "⚪"}
          </button>
        )}
      </div>
    </nav>
  );
}
