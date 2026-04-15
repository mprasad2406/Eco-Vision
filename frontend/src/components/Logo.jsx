import React from "react";

export default function Logo() {
  return (
    <svg
      width="45"
      height="45"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      style={{ marginRight: "10px" }}
    >
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="ecoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#1dd1a1', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#00f5d4', stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Main Circle Background */}
      <circle cx="50" cy="50" r="48" fill="none" stroke="url(#ecoGradient)" strokeWidth="2" opacity="0.8" />
      
      {/* Leaf 1 - Top */}
      <ellipse cx="50" cy="20" rx="10" ry="15" fill="url(#ecoGradient)" opacity="0.9" transform="rotate(-30 50 20)" />
      
      {/* Leaf 2 - Top Right */}
      <ellipse cx="70" cy="28" rx="10" ry="15" fill="url(#ecoGradient)" opacity="0.85" transform="rotate(30 70 28)" />
      
      {/* Leaf 3 - Bottom Right */}
      <ellipse cx="72" cy="52" rx="10" ry="15" fill="url(#ecoGradient)" opacity="0.85" transform="rotate(80 72 52)" />
      
      {/* Center Circle */}
      <circle cx="50" cy="50" r="20" fill="none" stroke="url(#ecoGradient)" strokeWidth="2" opacity="0.7" />
      
      {/* Center Dot */}
      <circle cx="50" cy="50" r="6" fill="url(#ecoGradient)" />
      
      {/* Recycle Arrow Symbol */}
      <path d="M 40 35 L 35 45 L 42 42 M 60 35 L 65 45 L 58 42 M 50 60 L 50 70" stroke="url(#ecoGradient)" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
