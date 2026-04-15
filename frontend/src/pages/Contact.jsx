import React, { useState } from "react";
import { speechService } from "../utils/speechService";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
      <div className="contact-header"><h1>Contact Us</h1><p>Have questions? We'd love to hear from you!</p></div>
      <div className="contact-content">
        <div className="contact-form-section">
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group"><label htmlFor="name">Name</label><input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Your full name" /></div>
            <div className="form-group"><label htmlFor="email">Email</label><input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="your.email@example.com" /></div>
            <div className="form-group"><label htmlFor="subject">Subject</label><input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required placeholder="Message subject" /></div>
            <div className="form-group"><label htmlFor="message">Message</label><textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows="6" placeholder="Your message here..."></textarea></div>
            <button type="submit" className="submit-btn">{submitted ? "✓ Message Sent!" : "Send Message"}</button>
          </form>
          {submitted && <div className="success-message">Thank you for reaching out! We'll respond shortly.</div>}
        </div>
        <div className="contact-info-section">
          <div className="service-banner"><h3>🚀 Want Our Service?</h3><p>If you're interested in integrating Eco-Vision waste classification into your facility or need enterprise solutions, reach out to us today!</p><p className="service-email"><strong>Business Inquiries:</strong> business@ecovision.com</p></div>
          <div className="info-card"><span className="info-icon">📧</span><h3>Email</h3><p>support@ecovision.com</p></div>
          <div className="info-card"><span className="info-icon">📱</span><h3>Phone</h3><p>+1 (555) 123-4567</p></div>
          <div className="info-card"><span className="info-icon">📍</span><h3>Location</h3><p>123 Green Street, Eco City, EC 12345</p></div>
          <div className="info-card"><span className="info-icon">⏰</span><h3>Response Time</h3><p>Within 24 hours</p></div>
          <div className="social-links"><h3>Follow Us</h3><div className="social-icons"><a href="#" className="social-icon">🐦</a><a href="#" className="social-icon">💼</a><a href="#" className="social-icon">📘</a><a href="#" className="social-icon">📷</a></div></div>
        </div>
      </div>
      <style>{`
        .contact-container { max-width: 1100px; margin: 0 auto; }
        .contact-header { text-align: center; margin-bottom: 2rem; }
        .contact-content { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        .contact-form-section { background: white; border-radius: 28px; padding: 2rem; box-shadow: 0 8px 20px rgba(0,0,0,0.05); }
        .form-group { margin-bottom: 1rem; }
        label { display: block; margin-bottom: 0.3rem; font-weight: 500; }
        input, textarea { width: 100%; padding: 0.7rem 1rem; border: 1px solid #dce4ec; border-radius: 16px; font-family: inherit; }
        .submit-btn { background: #1e6f5c; color: white; border: none; border-radius: 40px; padding: 0.8rem 1.5rem; width: 100%; font-size: 1rem; cursor: pointer; }
        .success-message { margin-top: 1rem; background: #d4edda; color: #155724; padding: 0.8rem; border-radius: 16px; text-align: center; }
        .contact-info-section { display: flex; flex-direction: column; gap: 1rem; }
        .service-banner { background: linear-gradient(135deg, #1e6f5c 0%, #289672 100%); color: white; border-radius: 20px; padding: 1.5rem; margin-bottom: 1rem; box-shadow: 0 8px 20px rgba(30, 111, 92, 0.2); }
        .service-banner h3 { margin-top: 0; margin-bottom: 0.5rem; }
        .service-banner p { margin: 0.5rem 0; }
        .service-email { background: rgba(255, 255, 255, 0.15); padding: 0.8rem; border-radius: 12px; margin-top: 1rem; }
        .info-card { background: white; border-radius: 20px; padding: 1.2rem; display: flex; align-items: center; gap: 1rem; }
        .info-icon { font-size: 2rem; }
        .social-links { background: white; border-radius: 20px; padding: 1.2rem; text-align: center; }
        .social-icons { display: flex; justify-content: center; gap: 1rem; margin-top: 0.5rem; }
        .social-icon { text-decoration: none; font-size: 1.5rem; }
        @media (max-width: 768px) { .contact-content { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
} 