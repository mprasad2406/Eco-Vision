import React, { useState } from "react";

export default function Contact() {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real app, this would send to an API
  };

  return (
    <div className="contact-container">
      <header className="contact-hero">
        <h1 className="gradient-text">Get in Touch</h1>
        <p>Expert support for your waste management and AI integration needs</p>
      </header>

      <div className="contact-content">
        <div className="contact-grid">
          <div className="contact-info premium-card">
            <h2>Contact Information</h2>
            <p>Connect with our technical team for integration support, hardware inquiries, or partnership opportunities.</p>
            
            <div className="info-items">
              <div className="info-item">
                <span className="info-icon">📍</span>
                <div>
                  <h4>Research Lab</h4>
                  <p>Eco-Vision Innovation Hub, Suite 402</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">📧</span>
                <div>
                  <h4>Email</h4>
                  <p>support@ecovision.ai</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">📞</span>
                <div>
                  <h4>Technical Support</h4>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
            </div>

            <div className="social-links">
              <h3>Follow Our Progress</h3>
              <div className="social-tags">
                <span className="social-tag">GitHub</span>
                <span className="social-tag">LinkedIn</span>
                <span className="social-tag">Twitter</span>
              </div>
            </div>
          </div>

          <div className="contact-form-container premium-card">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe" 
                    required 
                    value={formState.name}
                    onChange={e => setFormState({...formState, name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com" 
                    required 
                    value={formState.email}
                    onChange={e => setFormState({...formState, email: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Message / Hardware Query</label>
                  <textarea 
                    rows="5" 
                    placeholder="Tell us about your project or required hardware support..." 
                    required
                    value={formState.message}
                    onChange={e => setFormState({...formState, message: e.target.value})}
                  ></textarea>
                </div>
                <button type="submit" className="submit-btn">Send Message</button>
              </form>
            ) : (
              <div className="success-message">
                <div className="success-icon">✓</div>
                <h2>Message Sent!</h2>
                <p>Thank you for reaching out, {formState.name.split(' ')[0]}. Our technical team will get back to you within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} className="reset-btn">Send Another</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .contact-container {
          animation: fadeInUp 0.8s ease-out;
        }
        .contact-hero {
          text-align: center;
          margin-bottom: 4rem;
        }
        .contact-hero h1 { font-size: 3.5rem; }
        
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 3rem;
          align-items: start;
        }

        .contact-info {
          padding: 3rem;
          background: var(--text-main);
          color: white;
        }
        .contact-info h2 { color: white; margin-bottom: 1.5rem; }
        .contact-info p { color: rgba(255,255,255,0.7); line-height: 1.6; margin-bottom: 2.5rem; }

        .info-items { display: flex; flex-direction: column; gap: 2rem; margin-bottom: 3rem; }
        .info-item { display: flex; gap: 1.5rem; }
        .info-icon { font-size: 1.5rem; background: rgba(16, 185, 129, 0.2); width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; border-radius: 12px; }
        .info-item h4 { margin-top: 0; margin-bottom: 0.25rem; }
        .info-item p { margin: 0; font-size: 0.95rem; }

        .social-tags { display: flex; gap: 1rem; margin-top: 1rem; }
        .social-tag { background: rgba(255,255,255,0.1); padding: 0.5rem 1rem; border-radius: 50px; font-size: 0.85rem; cursor: pointer; transition: 0.3s; }
        .social-tag:hover { background: var(--primary); color: white; }

        .contact-form-container { padding: 3rem; }
        .form-group { margin-bottom: 1.5rem; }
        .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 700; font-size: 0.9rem; }
        .form-group input, .form-group textarea {
          width: 100%;
          padding: 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          outline: none;
          font-family: inherit;
          transition: 0.3s;
        }
        .form-group input:focus, .form-group textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1); }

        .submit-btn {
          width: 100%;
          background: var(--primary);
          color: white;
          border: none;
          padding: 1rem;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
        }
        .submit-btn:hover { background: #059669; transform: translateY(-2px); }

        .success-message { text-align: center; padding: 2rem 0; }
        .success-icon { font-size: 3rem; color: var(--primary); margin-bottom: 1.5rem; }
        .reset-btn { margin-top: 1.5rem; background: transparent; border: 1px solid #e2e8f0; padding: 0.6rem 1.5rem; border-radius: 50px; cursor: pointer; }

        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr; }
          .contact-hero h1 { font-size: 2.5rem; }
        }
      `}</style>
    </div>
  );
}