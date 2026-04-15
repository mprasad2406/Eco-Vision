import React, { useState } from "react";
import { speechService } from "../utils/speechService";
import "../styles/Categories.css";

const WASTE_CATEGORIES = [
  {
    id: 1,
    name: "Battery",
    icon: "🔋",
    description: "Rechargeable and non-rechargeable batteries",
    examples: "AA, AAA, Li-ion batteries",
    color: "#FF6B6B",
  },
  {
    id: 2,
    name: "Keyboard",
    icon: "⌨️",
    description: "Computer and electronic keyboards",
    examples: "Mechanical, wireless, membrane keyboards",
    color: "#4ECDC4",
  },
  {
    id: 3,
    name: "Mobile",
    icon: "📱",
    description: "Old mobile phones and devices",
    examples: "Smartphones, feature phones",
    color: "#45B7D1",
  },
  {
    id: 4,
    name: "PCB",
    icon: "🔌",
    description: "Circuit boards and electronic modules",
    examples: "Motherboards, circuit boards",
    color: "#96CEB4",
  },
  {
    id: 5,
    name: "Glass",
    icon: "🥤",
    description: "Glass bottles and containers",
    examples: "Glass bottles, jars, drinking glasses",
    color: "#FFEAA7",
  },
  {
    id: 6,
    name: "Metal",
    icon: "⚙️",
    description: "Metal waste and scraps",
    examples: "Aluminum, steel, copper",
    color: "#DDA0DD",
  },
  {
    id: 7,
    name: "Plastic",
    icon: "🛍️",
    description: "Plastic bottles and containers",
    examples: "PET, HDPE, PVC plastics",
    color: "#FF7675",
  },
  {
    id: 8,
    name: "Paper",
    icon: "📄",
    description: "Papers and cardboard",
    examples: "Newspapers, magazines, office paper",
    color: "#A29BFE",
  },
  {
    id: 9,
    name: "Trash",
    icon: "🗑️",
    description: "General waste and miscellaneous",
    examples: "Mixed waste, non-recyclable items",
    color: "#FF8B94",
  },
  {
    id: 10,
    name: "Printer",
    icon: "🖨️",
    description: "Printers and printing devices",
    examples: "Ink jet, laser printers",
    color: "#B19CD9",
  },
  {
    id: 11,
    name: "Mouse",
    icon: "🖱️",
    description: "Computer mice and input devices",
    examples: "Optical, wireless mice",
    color: "#74B9FF",
  },
  {
    id: 12,
    name: "Television",
    icon: "📺",
    description: "TV sets and monitors",
    examples: "CRT, LCD, LED televisions",
    color: "#55EFC4",
  },
  {
    id: 13,
    name: "Microwave",
    icon: "🌊",
    description: "Microwave ovens and appliances",
    examples: "Microwave ovens, dielectric appliances",
    color: "#FD79A8",
  },
  {
    id: 14,
    name: "Washing Machine",
    icon: "🧺",
    description: "Washing machines and laundry appliances",
    examples: "Washing machines, dryers",
    color: "#00B894",
  },
  {
    id: 15,
    name: "Cardboard",
    icon: "📦",
    description: "Cardboard boxes and packaging",
    examples: "Corrugated cardboard, boxes",
    color: "#FDCB6E",
  },
  {
    id: 16,
    name: "Organic",
    icon: "🌱",
    description: "Organic waste and biodegradables",
    examples: "Food waste, plant debris",
    color: "#00CEC9",
  },
  {
    id: 17,
    name: "Player",
    icon: "🎮",
    description: "Media players and gaming devices",
    examples: "DVD players, gaming consoles",
    color: "#A29BFE",
  },
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

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="categories-container">
      <div className="categories-header">
        <h1>📦 Waste Categories</h1>
        <p>Explore all 17 waste types recognized by Eco-Vision</p>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button className="clear-btn" onClick={handleClearSearch}>
            ✕
          </button>
        )}
      </div>

      {/* Categories Grid */}
      <div className="categories-grid">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            className={`category-card ${selectedCategory?.id === category.id ? "active" : ""}`}
            onClick={() => handleCategoryClick(category)}
            style={{ borderLeftColor: category.color }}
          >
            <div className="category-icon">{category.icon}</div>
            <h3 className="category-name">{category.name}</h3>
            <p className="category-description">{category.description}</p>
            <div className="category-hover">View Details →</div>
          </div>
        ))}
      </div>

      {/* Selected Category Details */}
      {selectedCategory && (
        <div className="selected-category">
          <div className="details-header">
            <span className="details-icon">{selectedCategory.icon}</span>
            <div className="details-info">
              <h2>{selectedCategory.name}</h2>
              <p className="details-description">{selectedCategory.description}</p>
            </div>
            <button className="close-btn" onClick={() => setSelectedCategory(null)}>
              ✕
            </button>
          </div>

          <div className="details-content">
            <div className="detail-section">
              <h3>📋 Description</h3>
              <p>{selectedCategory.description}</p>
            </div>

            <div className="detail-section">
              <h3>🔍 Examples</h3>
              <p>{selectedCategory.examples}</p>
            </div>

            <div className="detail-section">
              <h3>♻️ Recycling Info</h3>
              <p>
                {selectedCategory.name} waste should be handled according to local
                recycling guidelines. Please check with your local waste management
                facility for proper disposal methods.
              </p>
            </div>

            <button
              className="explain-btn"
              onClick={() => speechService.speak(`${selectedCategory.name}: ${selectedCategory.description}. Examples include ${selectedCategory.examples}`)}
            >
              🔊 Listen to Details
            </button>
          </div>
        </div>
      )}

      {/* No Results */}
      {filteredCategories.length === 0 && (
        <div className="no-results">
          <p>No categories found matching "{searchTerm}"</p>
          <button onClick={handleClearSearch}>Clear Search</button>
        </div>
      )}
    </div>
  );
}