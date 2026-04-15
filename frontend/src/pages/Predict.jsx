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

  // Handle image upload
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

  // Make prediction
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

  // Start camera
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

  // Capture from camera
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

  // Stop camera
  const handleStopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    setCameraActive(false);
  };

  // Clear all
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

  // Get disposal tips
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
      <div className="predict-wrapper">
        {/* Header */}
        <div className="predict-header">
          <h1>🗑️ Waste Classifier</h1>
          <p>Smart waste classification using deep learning</p>
          <div className="predict-subtitle">Upload or capture an image to get started</div>
        </div>

        {/* Upload Section */}
        {!preview && !loading && !prediction && (
          <div className="upload-section">
            <div className="upload-box" onClick={() => fileInputRef.current?.click()}>
              <div className="upload-icon">📸</div>
              <label className="upload-label">Choose Image or Drag & Drop</label>
              <p className="upload-description">
                Supported formats: JPG, PNG, WebP
              </p>
              <div className="upload-buttons">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-primary"
                >
                  📁 Browse Files
                </button>
                <button onClick={handleStartCamera} className="btn btn-secondary">
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
          </div>
        )}

        {/* Camera Section */}
        {cameraActive && (
          <div className="upload-section">
            <div className="camera-section">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{ width: "100%", borderRadius: "12px" }}
              />
              <canvas ref={canvasRef} style={{ display: "none" }} width={224} height={224} />
              <div className="camera-buttons">
                <button onClick={handleCapturePhoto} className="btn btn-success">
                  📸 Capture Photo
                </button>
                <button onClick={handleStopCamera} className="btn btn-danger">
                  ✕ Cancel Camera
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Preview & Results */}
        {(preview || loading || error) && (
          <div className="predict-content">
            {/* Error Message */}
            {error && (
              <div className="error-message">
                <p>❌ {error}</p>
              </div>
            )}

            {/* Preview & Input */}
            {preview && (
              <div className="preview-section">
                <div className="preview-container">
                  <img src={preview} alt="Waste" className="preview-image" />
                  <div className="action-buttons">
                    <button
                      onClick={handlePredict}
                      disabled={loading}
                      className="btn btn-predict"
                    >
                      {loading ? "⏳ Analyzing..." : "🚀 Analyze Image"}
                    </button>
                    <button onClick={handleClear} className="btn btn-clear">
                      🔄 New Image
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Analyzing waste image...</p>
              </div>
            )}
          </div>
        )}

        {/* Prediction Results */}
        {prediction && !loading && (
          <div className="predict-content">
            <div className="results-section">
              {/* Primary Prediction */}
              <div className="primary-prediction">
                <div className="category-badge">
                  {prediction.primary_class}
                </div>
                <p className="confidence-text">
                  Confidence Score
                  <strong>{(prediction.confidence * 100).toFixed(1)}%</strong>
                </p>
                <div className="confidence-meter">
                  <div
                    className="confidence-bar"
                    style={{
                      width: `${(prediction.confidence * 100).toFixed(1)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Top Predictions */}
              <div className="top-predictions">
                <h3>Top Predictions</h3>
                <div className="predictions-list">
                  {prediction.top_predictions.map((pred, idx) => (
                    <div key={idx} className="prediction-item">
                      <span className="rank">#{idx + 1}</span>
                      <span className="class-name">{pred.class}</span>
                      <span className="confidence">
                        {(pred.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disposal Tips */}
              <div className="disposal-tips">
                <h3>♻️ Disposal Guide</h3>
                <p>{getDisposalTips(prediction.primary_class)}</p>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons" style={{ gridColumn: "1 / -1" }}>
                <button onClick={handleClear} className="btn btn-primary">
                  🔄 Analyze Another
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <section className="predict-showcase">
        <h2>Example Waste Classifications</h2>
        <div className="example-grid">
          <div className="example-card">
            <img src="https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=400&h=300&fit=crop" alt="Electronics" />
            <h3>Electronic Waste</h3>
            <p>Devices like phones, keyboards, and circuit boards</p>
          </div>
          <div className="example-card">
            <img src="https://images.unsplash.com/photo-1572949645581-9b0b48f57264?w=400&h=300&fit=crop" alt="Organic" />
            <h3>Organic Waste</h3>
            <p>Biodegradable materials like food and plants</p>
          </div>
          <div className="example-card">
            <img src="https://images.unsplash.com/photo-1584361298901-f66c73f72f46?w=400&h=300&fit=crop" alt="Plastic" />
            <h3>Plastic Waste</h3>
            <p>Recyclable plastic bottles and containers</p>
          </div>
        </div>
      </section>
      <style>{`
  .predict-container { max-width: 900px; margin: 0 auto; }
  .predict-wrapper { background: white; border-radius: 32px; padding: 2rem; box-shadow: 0 12px 30px rgba(0,0,0,0.05); }
  .predict-header { text-align: center; margin-bottom: 2rem; }
  .upload-section { text-align: center; }
  .upload-box { border: 2px dashed #dce4ec; border-radius: 32px; padding: 2rem; cursor: pointer; transition: all 0.2s; }
  .upload-box:hover { border-color: #1e6f5c; background: #f8fafc; }
  .btn { padding: 0.6rem 1.2rem; border-radius: 40px; border: none; cursor: pointer; margin: 0.3rem; font-size: 0.9rem; }
  .btn-primary { background: #1e6f5c; color: white; }
  .btn-secondary { background: #eef2f7; color: #1a2a3f; }
  .preview-image { max-width: 100%; border-radius: 24px; margin: 1rem 0; }
  .results-section { margin-top: 2rem; }
  .primary-prediction { background: #f0f9f4; border-radius: 24px; padding: 1.5rem; text-align: center; }
  .category-badge { font-size: 1.8rem; font-weight: 700; color: #1e6f5c; }
  .confidence-meter { background: #eef2f7; border-radius: 20px; height: 8px; margin: 1rem 0; }
  .confidence-bar { background: #1e6f5c; height: 100%; border-radius: 20px; }
  .top-predictions { margin-top: 1.5rem; }
  .prediction-item { display: flex; justify-content: space-between; padding: 0.5rem; border-bottom: 1px solid #eef2f7; }
  .disposal-tips { background: #fff8e7; border-radius: 20px; padding: 1rem; margin: 1rem 0; }
  .loading-spinner { text-align: center; padding: 2rem; }
  .spinner { border: 4px solid #eef2f7; border-top: 4px solid #1e6f5c; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto; }
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes imagePan { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
  
  .predict-showcase { margin-top: 4rem; padding: 3rem 2rem; background: linear-gradient(135deg, rgba(30, 111, 92, 0.08), rgba(34, 197, 94, 0.05)); border-radius: 28px; animation: fadeIn 0.8s ease-out; }
  .predict-showcase h2 { text-align: center; font-size: 2rem; background: linear-gradient(135deg, #1e6f5c, #16a34a); background-clip: text; -webkit-background-clip: text; color: transparent; margin-bottom: 3rem; font-weight: 800; }
  .example-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; }
  .example-card { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(30, 111, 92, 0.1); transition: all 0.4s ease; animation: fadeIn 0.8s ease-out backwards; }
  .example-card:nth-child(1) { animation-delay: 0.2s; }
  .example-card:nth-child(2) { animation-delay: 0.3s; }
  .example-card:nth-child(3) { animation-delay: 0.4s; }
  .example-card img { width: 100%; height: 250px; object-fit: cover; transition: transform 0.6s ease; animation: imagePan 4s ease-in-out infinite; }
  .example-card:hover img { transform: scale(1.08); animation: none; }
  .example-card h3 { font-size: 1.3rem; color: #1e6f5c; margin: 1rem; font-weight: 700; }
  .example-card p { color: #475569; font-size: 0.9rem; padding: 0 1rem 1rem 1rem; line-height: 1.5; }
  .example-card:hover { transform: translateY(-8px); box-shadow: 0 16px 40px rgba(30, 111, 92, 0.15); }
  
  @media (max-width: 768px) { 
    .predict-wrapper { padding: 1rem; } 
    .example-grid { grid-template-columns: 1fr; }
    .predict-showcase { padding: 1.5rem; }
  }
`}</style>
    </div>
  );
}
