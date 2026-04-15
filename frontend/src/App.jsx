import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Predict from "./pages/Predict";
import Categories from "./pages/Categories";
import Stats from "./pages/Stats";
import About from "./pages/About";
import Contact from "./pages/Contact";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/*" element={<><Navbar /><Routes><Route path="/home" element={<Home />} /><Route path="/predict" element={<Predict />} /><Route path="/categories" element={<Categories />} /><Route path="/stats" element={<Stats />} /><Route path="/about" element={<About />} /><Route path="/contact" element={<Contact />} /></Routes></>} />
      </Routes>
    </Router>
  );
}

export default App;