import React, { useState, useRef } from "react";
import { apiService } from "../services/apiService";

export default function Predict() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePredict = async () => {
    if (!image) {
      setError("Please upload an image first");
      return;
    }

    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const result = await apiService.predictWaste(image);
      if (result.error) {
        setError(result.error);
      } else {
        setPrediction(result);
      }
    } catch (err) {
      setError("Failed to analyze image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      videoRef.current.srcObject = stream;
      setCameraActive(true);
      setError(null);
    } catch (err) {
      setError("Camera access denied. Please check permissions.");
    }
  };

  const handleCapturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      context.drawImage(videoRef.current, 0, 0, 224, 224);

      canvasRef.current.toBlob((blob) => {
        const file = new File([blob], "camera.jpg", { type: "image/jpeg" });
        setImage(file);

        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(blob);

        if (videoRef.current.srcObject) {
          videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        }
        setCameraActive(false);
      });
    }
  };

  const handleStopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    setCameraActive(false);
  };

  const handleClear = () => {
    setImage(null);
    setPreview(null);
    setPrediction(null);
    setError(null);
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    setCameraActive(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getDisposalTips = (category) => {
    const tips = {
      Plastic: "♻️ Rinse and place in recyclables. Keep plastic bags separate.",
      Metal: "♻️ Crush cans if possible. Aluminum and steel cans are highly recyclable.",
      Glass: "♻️ Place in separate container. Remove caps/lids first.",
      Paper: "♻️ Keep dry. Break down boxes to save space.",
      Cardboard: "♻️ Flatten boxes. Keep away from water and rain.",
      Organic: "🌱 Use for composting. Great for garden or compost bin.",
      Battery: "⚠️ Store safely. Take to special battery recycling center.",
      Trash: "🗑️ General waste. Ensure proper segregation before disposal.",
      Keyboard: "♻️ Electronic waste. Take to e-waste collection center.",
      Mobile: "♻️ Contains valuable materials. Go to certified e-waste recycler.",
      Mouse: "♻️ Electronic waste. Check local e-waste programs.",
      Printer: "♻️ Large electronic waste. Contact manufacturer for recycling.",
      Television: "⚠️ Large electronics. Must go to specialized e-waste facility.",
      Microwave: "⚠️ Hazardous. Needs special handling at e-waste facility.",
      "Washing Machine": "⚠️ Large appliance. Contact municipal waste management.",
      PCB: "⚠️ Hazardous. Must go to certified e-waste recycler.",
      Player: "♻️ Electronic device. Standard e-waste recycling process.",
    };
    return tips[category] || "Please dispose responsibly.";
  };

  return (
    <div className="predict-container">
      <div className="predict-header">
        <h1 className="gradient-text">Waste Classifier</h1>
        <p>Intelligent material recognition for a sustainable future</p>
      </div>

      <div className="predict-main-card premium-card">
        {!preview && !loading && !prediction && !cameraActive && (
          <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
            <div className="upload-icon-wrapper">
              <span className="icon">▲</span>
            </div>
            <h2>Upload Waste Image</h2>
            <p>Drag and drop your photo here or <span className="browse-text">browse files</span></p>
            <div className="upload-actions">
              <button 
                onClick={(e) => { e.stopPropagation(); handleStartCamera(); }} 
                className="predict-btn secondary"
              >
                📷 Use Camera
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
          </div>
        )}

        {cameraActive && (
          <div className="camera-view">
            <video ref={videoRef} autoPlay playsInline className="video-stream" />
            <canvas ref={canvasRef} style={{ display: "none" }} width={224} height={224} />
            <div className="camera-controls">
              <button onClick={handleCapturePhoto} className="predict-btn primary">📸 Capture</button>
              <button onClick={handleStopCamera} className="predict-btn danger">✕ Cancel</button>
            </div>
          </div>
        )}

        {(preview || loading || error) && (
          <div className="preview-view">
            {error && <div className="error-badge">❌ {error}</div>}
            {preview && (
              <div className="preview-container">
                <img src={preview} alt="Waste preview" className="preview-img" />
                <div className="preview-actions">
                  <button 
                    onClick={handlePredict} 
                    disabled={loading} 
                    className="predict-btn primary large"
                  >
                    {loading ? "⏳ Analyzing..." : "🚀 Analyze Material"}
                  </button>
                  <button onClick={handleClear} className="predict-btn text">New Image</button>
                </div>
              </div>
            )}
            {loading && (
              <div className="loader-overlay">
                <div className="scanner"></div>
                <p>Decoding material composition...</p>
              </div>
            )}
          </div>
        )}

        {prediction && !loading && (
          <div className="results-view">
            <div className="result-main">
              <div className="result-category-shell">
                <span className="result-label">Identified Material</span>
                <h2 className="result-category">{prediction.prediction}</h2>
              </div>
              <div className="confidence-section">
                <div className="confidence-header">
                  <span>Confidence Score</span>
                  <span>{Number(prediction.confidence).toFixed(1)}%</span>
                </div>
                <div className="confidence-track">
                  <div 
                    className="confidence-fill" 
                    style={{ width: `${prediction.confidence}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="result-details">
              <div className="tips-box">
                <h3>♻️ Disposal Guide</h3>
                <p>{getDisposalTips(prediction.prediction)}</p>
              </div>
              <div className="top-preds">
                <h3>Alternative Probabilities</h3>
                <div className="preds-list">
                  {prediction.top_predictions.slice(0, 3).map((pred, i) => (
                    <div key={i} className="pred-item">
                      <span className="pred-name">{pred.class}</span>
                      <span className="pred-val">
                        {pred.confidence > 1
                          ? `${pred.confidence.toFixed(0)}%`
                          : `${(pred.confidence * 100).toFixed(0)}%`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="result-reset">
              <button onClick={handleClear} className="predict-btn primary">Analyze Another</button>
            </div>
          </div>
        )}
      </div>

      <section className="predict-examples">
        <h2 className="section-title">Common Categories</h2>
        <div className="example-grid">
          {[
            { img: "https://images.unsplash.com/photo-1559027615-cd2628902d4a", title: "Electronics", desc: "Keyboards, mobiles, PCBs" },
            { img: "https://images.unsplash.com/photo-1572949645581-9b0b48f57264", title: "Organic", desc: "Food waste, plant materials" },
            { img: "https://images.unsplash.com/photo-1584361298901-f66c73f72f46", title: "Recyclables", desc: "Plastic, metal, glass" }
          ].map((item, i) => (
            <div key={i} className="example-item premium-card">
              <img src={`${item.img}?w=400&h=300&fit=crop`} alt={item.title} />
              <div className="example-info">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .predict-container {
          max-width: 1000px;
          margin: 0 auto;
          animation: fadeInUp 0.8s ease-out;
        }

        .predict-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        .predict-header h1 {
          font-size: 3rem;
          margin-bottom: 0.5rem;
        }
        .predict-header p {
          color: var(--text-muted);
          font-size: 1.1rem;
        }

        .predict-main-card {
          padding: 3rem;
          min-height: 400px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .upload-zone {
          text-align: center;
          padding: 4rem 2rem;
          border: 2px dashed rgba(16, 185, 129, 0.2);
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .upload-zone:hover {
          background: rgba(16, 185, 129, 0.05);
          border-color: var(--primary);
        }

        .upload-icon-wrapper {
          width: 80px;
          height: 80px;
          background: rgba(16, 185, 129, 0.1);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          margin: 0 auto 1.5rem;
          font-size: 2rem;
        }

        .browse-text {
          color: var(--primary);
          font-weight: 700;
          text-decoration: underline;
        }

        .upload-actions {
          margin-top: 2rem;
        }

        .predict-btn {
          padding: 0.8rem 2rem;
          border-radius: 100px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          font-family: inherit;
        }
        .predict-btn.primary {
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: white;
          box-shadow: 0 10px 20px rgba(16, 185, 129, 0.2);
        }
        .predict-btn.secondary {
          background: white;
          color: var(--text-main);
          border: 1px solid rgba(0,0,0,0.1);
        }
        .predict-btn.danger {
          background: #ef4444;
          color: white;
        }
        .predict-btn.text {
          background: transparent;
          color: var(--text-muted);
        }
        .predict-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.1);
        }

        .camera-view {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }
        .video-stream {
          width: 100%;
          max-width: 500px;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        .preview-view {
          text-align: center;
        }
        .preview-img {
          max-width: 100%;
          max-height: 400px;
          border-radius: 20px;
          margin-bottom: 2rem;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        .results-view {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }
        .result-main {
          text-align: center;
        }
        .result-label {
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--primary);
        }
        .result-category {
          font-size: 3rem;
          font-weight: 800;
          margin: 0.5rem 0 1.5rem;
        }

        .confidence-section {
          max-width: 400px;
          margin: 0 auto;
        }
        .confidence-header {
          display: flex;
          justify-content: space-between;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: var(--text-muted);
        }
        .confidence-track {
          height: 12px;
          background: #e2e8f0;
          border-radius: 100px;
          overflow: hidden;
        }
        .confidence-fill {
          height: 100%;
          background: linear-gradient(to right, var(--primary), var(--secondary));
          border-radius: 100px;
          animation: slideInLeft 1s ease-out;
        }

        .result-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        .tips-box {
          background: rgba(16, 185, 129, 0.05);
          padding: 1.5rem;
          border-radius: 20px;
          border: 1px solid rgba(16, 185, 129, 0.1);
        }
        .tips-box h3 {
          margin-bottom: 0.75rem;
          color: var(--primary-dark);
        }

        .top-preds h3 {
          font-size: 1rem;
          margin-bottom: 1rem;
          color: var(--text-muted);
        }
        .preds-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .pred-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid #f1f5f9;
          font-weight: 600;
        }

        .result-reset {
          text-align: center;
        }

        .predict-examples {
          margin-top: 5rem;
        }
        .section-title {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 2.5rem;
          text-align: center;
        }
        .example-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2.5rem;
        }
        .example-item {
          overflow: hidden;
          padding: 0;
        }
        .example-item img {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }
        .example-info {
          padding: 1.5rem;
        }
        .example-info h3 {
          margin-bottom: 0.5rem;
          color: var(--primary-dark);
        }
        .example-info p {
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .predict-main-card { padding: 1.5rem; }
          .result-details { grid-template-columns: 1fr; }
          .result-category { font-size: 2rem; }
        }
      `}</style>
    </div>
  );
}
