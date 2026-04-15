import React, { useState } from "react";
import { speechService } from "../utils/speechService";

const WASTE_CATEGORIES = [
  { id: 1, name: "Battery", icon: "🔋", color: "#e74c3c", description: "Rechargeable and single-use batteries", examples: "AA batteries, phone batteries, power banks"},
  { id: 2, name: "Keyboard", icon: "⌨️", color: "#3498db", description: "Computer and electronic keyboards", examples: "USB keyboards, wireless keyboards, mechanical keyboards" },
  { id: 3, name: "Mobile", icon: "📱", color: "#2ecc71", description: "Smartphones and mobile devices", examples: "Smartphones, tablets, smartwatches" },
  { id: 4, name: "PCB", icon: "🔌", color: "#9b59b6", description: "Printed circuit boards and components", examples: "Circuit boards, microchips, processors" },
  { id: 5, name: "Glass", icon: "🥤", color: "#1abc9c", description: "Glass bottles and containers", examples: "Beer bottles, wine bottles, jars" },
  { id: 6, name: "Metal", icon: "⚙️", color: "#34495e", description: "Metal cans, foil, and metal items", examples: "Aluminum cans, steel cans, metal scraps" },
  { id: 7, name: "Plastic", icon: "🛍️", color: "#f39c12", description: "Plastic bottles and plastic packaging", examples: "PET bottles, plastic bags, plastic containers" },
  { id: 8, name: "Paper", icon: "📄", color: "#95a5a6", description: "Paper, cardboard, and paper products", examples: "Newspapers, cardboard boxes, paper bags" },
  { id: 9, name: "Trash", icon: "🗑️", color: "#c0392b", description: "General waste and non-recyclable items", examples: "Broken plastics, food waste, mixed materials" },
  { id: 10, name: "Printer", icon: "🖨️", color: "#16a085", description: "Printers and printing equipment", examples: "Ink jet printers, laser printers, printer cartridges" },
  { id: 11, name: "Mouse", icon: "🖱️", color: "#27ae60", description: "Computer mice and input devices", examples: "Wireless mouse, optical mouse, trackpads" },
  { id: 12, name: "Television", icon: "📺", color: "#8e44ad", description: "Old television sets and displays", examples: "CRT TVs, LED TVs, monitors" },
  { id: 13, name: "Microwave", icon: "🌊", color: "#c0392b", description: "Microwave ovens and heating appliances", examples: "Microwave ovens, toasters, kettles" },
  { id: 14, name: "Washing Machine", icon: "🧺", color: "#3498db", description: "Washing machines and laundry equipment", examples: "Front-load washers, top-load washers, dryers" },
  { id: 15, name: "Cardboard", icon: "📦", color: "#d35400", description: "Cardboard boxes and corrugated materials", examples: "Shipping boxes, delivery boxes, egg cartons" },
  { id: 16, name: "Organic", icon: "🌱", color: "#27ae60", description: "Food waste and organic materials", examples: "Fruit peels, vegetable scraps, leaves" },
  { id: 17, name: "Player", icon: "🎮", color: "#2980b9", description: "Media players and gaming devices", examples: "DVD players, gaming consoles, Blu-ray players" }
];

export default function Categories() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = WASTE_CATEGORIES.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    speechService.speak(`${category.name}: ${category.description}`);
  };

  const handleClearSearch = () => setSearchTerm("");

  return (
    <div className="categories-container">
      <div className="categories-header"><h1>📦 Waste Categories</h1><p>Explore all 17 waste types recognized by Eco-Vision</p></div>
      <div className="search-section">
        <input type="text" placeholder="Search categories..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
        {searchTerm && <button className="clear-btn" onClick={handleClearSearch}>✕</button>}
      </div>
      <div className="categories-grid">
        {filteredCategories.map((category) => (
          <div key={category.id} className={`category-card ${selectedCategory?.id === category.id ? "active" : ""}`} onClick={() => handleCategoryClick(category)} style={{ borderLeftColor: category.color }}>
            <div className="category-icon">{category.icon}</div>
            <h3 className="category-name">{category.name}</h3>
            <p className="category-description">{category.description}</p>
            <div className="category-hover">View Details →</div>
          </div>
        ))}
      </div>
      {selectedCategory && (
        <div className="selected-category">
          <div className="details-header"><span className="details-icon">{selectedCategory.icon}</span><div className="details-info"><h2>{selectedCategory.name}</h2><p className="details-description">{selectedCategory.description}</p></div><button className="close-btn" onClick={() => setSelectedCategory(null)}>✕</button></div>
          <div className="details-content">
            <div className="detail-section"><h3>📋 Description</h3><p>{selectedCategory.description}</p></div>
            <div className="detail-section"><h3>🔍 Examples</h3><p>{selectedCategory.examples}</p></div>
            <div className="detail-section"><h3>♻️ Recycling Info</h3><p>{selectedCategory.name} waste should be handled according to local recycling guidelines. Please check with your local waste management facility for proper disposal methods.</p></div>
            <button className="explain-btn" onClick={() => speechService.speak(`${selectedCategory.name}: ${selectedCategory.description}. Examples include ${selectedCategory.examples}`)}>🔊 Listen to Details</button>
          </div>
        </div>
      )}
      {filteredCategories.length === 0 && <div className="no-results"><p>No categories found matching "{searchTerm}"</p><button onClick={handleClearSearch}>Clear Search</button></div>}
      <section className="category-showcase">
        <h2>Real Examples of E-Waste Categories</h2>
        <div className="showcase-grid">
          <div className="showcase-item">
            <img src="https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=400&h=300&fit=crop" alt="Electronic components" />
            <h3>Electronic Components</h3>
            <p>PCBs, circuits, and microchips for proper e-waste recycling</p>
          </div>
          <div className="showcase-item">
            <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop" alt="Batteries and power" />
            <h3>Batteries & Power</h3>
            <p>Various battery types requiring specialized handling</p>
          </div>
          <div className="showcase-item">
            <img src="https://images.unsplash.com/photo-1550454897-eb2e8b0ed6b0?w=400&h=300&fit=crop" alt="Mobile devices" />
            <h3>Mobile & Devices</h3>
            <p>Smartphones, tablets, and portable electronic devices</p>
          </div>
        </div>
      </section>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes imagePan { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        
        .category-showcase { margin-top: 5rem; padding: 3rem 2rem; background: linear-gradient(135deg, rgba(30, 111, 92, 0.08), rgba(34, 197, 94, 0.05)); border-radius: 28px; animation: fadeIn 0.8s ease-out 1.2s backwards; }
        .category-showcase h2 { text-align: center; font-size: 2rem; background: linear-gradient(135deg, #1e6f5c, #16a34a); background-clip: text; -webkit-background-clip: text; color: transparent; margin-bottom: 3rem; font-weight: 800; }
        .showcase-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; }
        .showcase-item { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(30, 111, 92, 0.1); transition: all 0.4s ease; animation: fadeIn 0.8s ease-out backwards; }
        .showcase-item:nth-child(1) { animation-delay: 1.3s; }
        .showcase-item:nth-child(2) { animation-delay: 1.4s; }
        .showcase-item:nth-child(3) { animation-delay: 1.5s; }
        .showcase-item img { width: 100%; height: 250px; object-fit: cover; transition: transform 0.6s ease; animation: imagePan 4s ease-in-out infinite; }
        .showcase-item:hover img { transform: scale(1.08); animation: none; }
        .showcase-item h3 { font-size: 1.3rem; color: #1e6f5c; margin: 1rem; font-weight: 700; }
        .showcase-item p { color: #475569; font-size: 0.9rem; padding: 0 1rem 1rem 1rem; line-height: 1.5; }
        .showcase-item:hover { transform: translateY(-8px); box-shadow: 0 16px 40px rgba(30, 111, 92, 0.15); }
        
        .categories-container { max-width: 1200px; margin: 0 auto; }
        .categories-header { text-align: center; margin-bottom: 2rem; }
        .search-section { position: relative; max-width: 400px; margin: 0 auto 2rem; }
        .search-input { width: 100%; padding: 0.8rem 2rem 0.8rem 1rem; border: 1px solid #dce4ec; border-radius: 60px; font-size: 1rem; }
        .clear-btn { position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; }
        .categories-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.5rem; }
        .category-card { background: white; border-radius: 20px; padding: 1.2rem; border-left: 4px solid; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
        .category-card:hover { transform: translateY(-3px); box-shadow: 0 12px 20px rgba(0,0,0,0.08); }
        .category-icon { font-size: 2rem; margin-bottom: 0.5rem; }
        .category-name { margin: 0.5rem 0; font-size: 1.2rem; }
        .category-description { color: #5a6e7c; font-size: 0.85rem; }
        .category-hover { margin-top: 0.5rem; font-size: 0.8rem; color: #1e6f5c; opacity: 0; transition: opacity 0.2s; }
        .category-card:hover .category-hover { opacity: 1; }
        .selected-category { margin-top: 2rem; background: white; border-radius: 28px; padding: 1.5rem; box-shadow: 0 8px 25px rgba(0,0,0,0.05); }
        .details-header { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; justify-content: space-between; }
        .details-icon { font-size: 2.5rem; }
        .details-info h2 { margin: 0; }
        .close-btn { background: #eef2f7; border: none; border-radius: 40px; padding: 0.3rem 0.8rem; cursor: pointer; }
        .detail-section { margin: 1rem 0; padding-bottom: 0.5rem; border-bottom: 1px solid #eef2f7; }
        .explain-btn { background: #1e6f5c; color: white; border: none; border-radius: 40px; padding: 0.6rem 1.2rem; margin-top: 1rem; cursor: pointer; }
        .no-results { text-align: center; margin-top: 2rem; }
        @media (max-width: 768px) { .categories-grid { grid-template-columns: 1fr; } .showcase-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}