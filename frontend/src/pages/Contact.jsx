import React, { useState } from "react";
import { speechService } from "../utils/speechService";
import "../styles/Contact.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, send this to backend
    console.log("Form submitted:", formData);
    setSubmitted(true);
    speechService.speak("Thank you for your message. We will get back to you soon!");
    
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>Have questions? We'd love to hear from you!</p>
      </div>

      <div className="contact-content">
        {/* Contact Form */}
        <div className="contact-form-section">
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="Message subject"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                placeholder="Your message here..."
              ></textarea>
            </div>

            <button type="submit" className="submit-btn">
              {submitted ? "✓ Message Sent!" : "Send Message"}
            </button>
          </form>

          {submitted && (
            <div className="success-message">
              Thank you for reaching out! We'll respond shortly.
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div className="contact-info-section">
          <div className="info-card">
            <span className="info-icon">📧</span>
            <h3>Email</h3>
            <p>support@ecovision.com</p>
          </div>

          <div className="info-card">
            <span className="info-icon">📱</span>
            <h3>Phone</h3>
            <p>+1 (555) 123-4567</p>
          </div>

          <div className="info-card">
            <span className="info-icon">📍</span>
            <h3>Location</h3>
            <p>123 Green Street, Eco City, EC 12345</p>
          </div>

          <div className="info-card">
            <span className="info-icon">⏰</span>
            <h3>Response Time</h3>
            <p>Within 24 hours</p>
          </div>

          {/* Social Links */}
          <div className="social-links">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="#" className="social-icon">🐦</a>
              <a href="#" className="social-icon">💼</a>
              <a href="#" className="social-icon">📘</a>
              <a href="#" className="social-icon">📷</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
