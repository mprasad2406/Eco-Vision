import React from "react";
import { speechService } from "../utils/speechService";

export default function About() {
  const handleSpeak = () => {
    speechService.speak("Eco-Vision is a smart waste classification system powered by advanced deep learning. Our mission is to revolutionize waste management and support sustainable environmental practices.");
  };

  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About Eco-Vision</h1>
        <button className="speak-btn" onClick={handleSpeak}>🔊</button>
      </div>
      <div className="about-content">
        <section className="about-section">
          <h2>🎯 Our Mission</h2>
          <p>To automate waste classification using Artificial Intelligence and support efficient waste segregation for better recycling and environmental management.</p>
        </section>
        <section className="about-section">
          <h2>⚙️ Technology Stack</h2>
          <div className="tech-grid">
            <div className="tech-card"><h3>Model Architecture</h3><p>MobileNetV2 with Transfer Learning</p></div>
            <div className="tech-card"><h3>Image Processing</h3><p>224x224 pixel input with augmentation</p></div>
            <div className="tech-card"><h3>Optimization</h3><p>Adam optimizer with early stopping</p></div>
            <div className="tech-card"><h3>Performance</h3><p>85-90% accuracy across all categories</p></div>
          </div>
        </section>
        <section className="about-section">
          <h2>📦 17 Waste Categories</h2>
          <div className="categories-grid">
            <div className="category-tag">🔋 Battery</div>
            <div className="category-tag">⌨️ Keyboard</div>
            <div className="category-tag">📱 Mobile</div>
            <div className="category-tag">🔌 PCB</div>
            <div className="category-tag">🥤 Glass</div>
            <div className="category-tag">⚙️ Metal</div>
            <div className="category-tag">🛍️ Plastic</div>
            <div className="category-tag">📄 Paper</div>
            <div className="category-tag">🗑️ Trash</div>
            <div className="category-tag">🖨️ Printer</div>
            <div className="category-tag">🖱️ Mouse</div>
            <div className="category-tag">📺 Television</div>
            <div className="category-tag">🌊 Microwave</div>
            <div className="category-tag">🧺 Washing Machine</div>
            <div className="category-tag">📦 Cardboard</div>
            <div className="category-tag">🌱 Organic</div>
            <div className="category-tag">🎮 Player</div>
          </div>
        </section>
        <section className="about-section">
          <h2>📚 Training Process</h2>
          <div className="training-phases">
            <div className="phase"><h3>Phase 1: Data Collection</h3><p>Gathered 5000+ images across all 17 waste categories with diverse lighting and angles</p></div>
            <div className="phase"><h3>Phase 2: Preprocessing</h3><p>Image normalization, augmentation, and resizing to 224x224 pixels for model input</p></div>
            <div className="phase"><h3>Phase 3: Feature Extraction</h3><p>Base MobileNetV2 model frozen to extract pre-trained features from ImageNet</p></div>
            <div className="phase"><h3>Phase 4: Fine-tuning</h3><p>Last layers unfrozen with low learning rate for task-specific optimization</p></div>
            <div className="phase"><h3>Phase 5: Validation & Testing</h3><p>Rigorous evaluation with cross-validation ensuring 85-90% accuracy across all categories</p></div>
            <div className="phase"><h3>Phase 6: Deployment</h3><p>Model optimized for production use with real-time inference capabilities</p></div>
          </div>
        </section>
        <section className="about-section">
          <h2>🚀 Future Improvements</h2>
          <ul className="improvements-list">
            <li>Integration with IoT smart bins</li>
            <li>Real-time YOLO-based object detection</li>
            <li>Mobile application deployment</li>
            <li>Cloud deployment for large-scale use</li>
            <li>Multi-language support</li>
            <li>Advanced analytics dashboard</li>
          </ul>
        </section>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        
        .about-container { max-width: 1000px; margin: 0 auto; padding: 20px; animation: fadeIn 0.8s ease-out; }
        .about-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
        .about-header h1 { background: linear-gradient(135deg, #1dd1a1, #00f5d4); background-clip: text; -webkit-background-clip: text; color: transparent; font-size: 2.5rem; margin: 0; }
        .speak-btn { background: linear-gradient(135deg, rgba(29, 209, 161, 0.2), rgba(0, 245, 212, 0.1)); border: 1px solid rgba(29, 209, 161, 0.3); color: #1dd1a1; border-radius: 50px; padding: 0.8rem 1.2rem; font-size: 1.3rem; cursor: pointer; transition: all 0.3s ease; backdrop-filter: blur(10px); }
        .speak-btn:hover { background: linear-gradient(135deg, rgba(29, 209, 161, 0.3), rgba(0, 245, 212, 0.2)); border-color: rgba(29, 209, 161, 0.5); transform: translateY(-2px); box-shadow: 0 8px 20px rgba(29, 209, 161, 0.15); }
        .about-section { background: linear-gradient(135deg, rgba(30, 41, 59, 0.6), rgba(20, 30, 48, 0.8)); border-radius: 16px; padding: 2rem; margin-bottom: 2rem; border: 1px solid rgba(29, 209, 161, 0.15); transition: all 0.4s ease; animation: fadeIn 0.8s ease-out backwards; }
        .about-section h2 { margin-bottom: 1rem; color: #1dd1a1; font-size: 1.5rem; }
        .tech-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-top: 1rem; }
        .tech-card { background: linear-gradient(135deg, rgba(29, 209, 161, 0.1), rgba(0, 245, 212, 0.05)); border-radius: 12px; padding: 1.2rem; text-align: center; border: 1px solid rgba(29, 209, 161, 0.1); transition: all 0.3s ease; }
        .tech-card:hover { transform: translateY(-4px); background: linear-gradient(135deg, rgba(29, 209, 161, 0.15), rgba(0, 245, 212, 0.08)); border-color: rgba(29, 209, 161, 0.2); }
        .tech-card h3 { color: #1dd1a1; margin: 0.5rem 0; }
        .tech-card p { color: #cbd5e0; margin: 0; font-size: 0.9rem; }
        .categories-grid { display: flex; flex-wrap: wrap; gap: 0.8rem; margin-top: 1rem; }
        .category-tag { background: linear-gradient(135deg, rgba(29, 209, 161, 0.2), rgba(0, 245, 212, 0.1)); padding: 0.6rem 1.2rem; border-radius: 40px; font-size: 0.9rem; color: #e8eef5; border: 1px solid rgba(29, 209, 161, 0.2); transition: all 0.3s ease; }
        .category-tag:hover { background: linear-gradient(135deg, rgba(29, 209, 161, 0.3), rgba(0, 245, 212, 0.15)); border-color: rgba(29, 209, 161, 0.3); transform: translateY(-2px); }
        .training-phases { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem; }
        .phase { background: linear-gradient(135deg, rgba(29, 209, 161, 0.1), rgba(0, 245, 212, 0.05)); border-radius: 12px; padding: 1.5rem; border: 1px solid rgba(29, 209, 161, 0.1); transition: all 0.3s ease; }
        .phase:hover { transform: translateY(-4px); background: linear-gradient(135deg, rgba(29, 209, 161, 0.15), rgba(0, 245, 212, 0.08)); border-color: rgba(29, 209, 161, 0.2); }
        .phase h3 { color: #1dd1a1; margin-top: 0; font-size: 1rem; }
        .phase p { color: #cbd5e0; margin: 0.5rem 0 0 0; font-size: 0.9rem; line-height: 1.5; }
        .improvements-list { list-style: none; padding-left: 0; margin: 1rem 0 0 0; }
        .improvements-list li { padding: 0.6rem 0; padding-left: 1.8rem; position: relative; color: #cbd5e0; line-height: 1.6; }
        .improvements-list li:before { content: "✓"; position: absolute; left: 0; color: #1dd1a1; font-weight: 700; }
        @media (max-width: 768px) { 
          .about-container { padding: 16px; }
          .about-header h1 { font-size: 1.8rem; }
          .tech-grid { grid-template-columns: 1fr; } 
          .training-phases { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}