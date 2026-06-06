import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import "../styles/home.css";

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  const [chatVisible, setChatVisible] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: "bot", text: "Hello! How can I help you today?" },
  ]);
  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const sendChatbotMessage = () => {
    if (!chatInput.trim()) return;

    const newMessages = [...chatMessages, { type: "user", text: chatInput }];
    setChatMessages(newMessages);
    setChatInput("");

    setTimeout(() => {
      const botResponse = getBotResponse(chatInput);
      setChatMessages((prev) => [...prev, { type: "bot", text: botResponse }]);
    }, 1000);
  };

  const getBotResponse = (message) => {
    const msg = message.toLowerCase();
    if (msg.includes("hello") || msg.includes("hi")) return "Hi! How can I assist you today?";
    if (msg.includes("service") || msg.includes("what can you do")) return "We analyze X-rays, MRI, CT scans and lab reports with AI.";
    if (msg.includes("upload") || msg.includes("how to")) return "Drag & drop your files to start analysis.";
    return "Thanks for your message! I'm here to assist with medical imaging.";
  };

  useEffect(() => {
    const elements = document.querySelectorAll(
      '.service-card, .testimonial-card, .tech-feature, .cert-badge, .benefit-item-detailed, .services, .floating-image-container, .process-step-interactive, .benefits__text, .benefits__image, .technology__text, .technology__certifications, .final-cta, .section__header, .section'
    );

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0) scale(1)";
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "50px", threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
  }, []);

  return (
    <div className="home-page">
      <Header />

      <main className="page page--active" id="home-page">
        <section className="hero section">
          <div className="container">
            <div className="hero__content">
              <div className="hero__grid">
                <div className="hero__text animate-fadeInUp">
                  <h1 className="hero__title_1">Transform Your Medical Imaging with AI</h1>
                  <p className="hero__subtitle_1">
                    Get instant, accurate analysis of your X-rays, MRI, CT scans, and lab results
                  </p>
                  <div className="hero__benefits">
                    <div className="benefit-item">
                      <span className="benefit__icon">⚡</span>
                      <span className="benefit__text">Results in under 5 minutes</span>
                    </div>
                    <div className="benefit-item">
                      <span className="benefit__icon">🎯</span>
                      <span className="benefit__text">95% accuracy rate</span>
                    </div>
                    <div className="benefit-item">
                      <span className="benefit__icon">🔒</span>
                      <span className="benefit__text">HIPAA compliant & secure</span>
                    </div>
                  </div>
                  <div className="hero__buttons">
                    <Link to="/upload" className="btn_1 btn--primary btn--lg">Starts Free Analysis</Link>
                    <button type="button" className="btn_1 btn--secondary btn--lg hero-demo-btn">Watch Demo</button>
                  </div>
                  <div className="hero__trust">
                    <span className="trust-item">50,000+ images analyzed</span>
                    <span className="trust-divider">•</span>
                    <span className="trust-item">99.9% uptime guaranteed</span>
                  </div>
                </div>
                <div className="hero__visual animate-slideIn">
                  <div className="hero__image-container">
                    <img
                      src="https://user-gen-media-assets.s3.amazonaws.com/seedream_images/4d94e8f2-c35c-4b86-97f0-22360f1e79f2.png"
                      alt="AI Medical Analysis"
                      className="hero__bg-image"
                    />
                    <div className="floating-elements">
                      <div className="float-icon float-icon--1">🩺</div>
                      <div className="float-icon float-icon--2">🧠</div>
                      <div className="float-icon float-icon--3">🦴</div>
                      <div className="float-icon float-icon--4">🔬</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

<section className="services section" id="what-we-analyze">
  <div className="container">
    <div className="section__header">
      <h2 className="section__title animate-fadeInUp">
        X-Ray Analysis Services
      </h2>
      <p className="section__subtitle animate-fadeInUp">
        We specialize exclusively in X-Ray diagnostics, covering multiple aspects to ensure accurate and reliable results.
      </p>
    </div>

    <div className="services__grid">

      {/* Card 1 */}
      <div className="service-card animate-fadeInUp">
        <div className="service-card__icon">🦴</div>
        <h3 className="service-card__title">Bone Analysis</h3>
        <p className="service-card__description">
          Detect fractures, bone density issues, and skeletal abnormalities.
        </p>
        <div className="service-card__features">
          <span className="feature-tag">Fractures</span>
          <span className="feature-tag">Bone density</span>
          <span className="feature-tag">Deformities</span>
        </div>
      </div>

      {/* Card 2 */}
      <div className="service-card animate-fadeInUp">
        <div className="service-card__icon">🫁</div>
        <h3 className="service-card__title">Chest Analysis</h3>
        <p className="service-card__description">
          Identify lung diseases and chest-related abnormalities.
        </p>
        <div className="service-card__features">
          <span className="feature-tag">Pneumonia</span>
          <span className="feature-tag">Infections</span>
          <span className="feature-tag">Lung issues</span>
        </div>
      </div>

      {/* Card 3 */}
      <div className="service-card animate-fadeInUp">
        <div className="service-card__icon">🧠</div>
        <h3 className="service-card__title">Advanced Detection</h3>
        <p className="service-card__description">
          AI-powered detection of hidden patterns and anomalies in X-Ray images.
        </p>
        <div className="service-card__features">
          <span className="feature-tag">AI analysis</span>
          <span className="feature-tag">Pattern detection</span>
          <span className="feature-tag">Early diagnosis</span>
        </div>
      </div>

      {/* Card 4 */}
      <div className="service-card animate-fadeInUp">
        <div className="service-card__icon">⚡</div>
        <h3 className="service-card__title">Fast Results</h3>
        <p className="service-card__description">
          Get quick and reliable diagnostic reports in seconds.
        </p>
        <div className="service-card__features">
          <span className="feature-tag">Instant results</span>
          <span className="feature-tag">High accuracy</span>
          <span className="feature-tag">24/7 availability</span>
        </div>
      </div>

    </div>
  </div>
</section>
<section className="process section">
  <div className="container">
    <div className="section__header">
      <h2 className="section__title animate-fadeInUp">How It Works</h2>
      <p className="section__subtitle animate-fadeInUp">Three simple steps to get your medical imaging analysis</p>
    </div>

    <div className="process__interactive">
      <div className="process-step-interactive animate-slideIn" data-step="1">
        <div className="step-circle">
          <div className="step-icon">📤</div>
        </div>
        <div className="step-content">
          <h3 className="step-title">Upload</h3>
          <p className="step-description">Drag & drop your medical files securely</p>
          <p className="step-detail">Support for DICOM, PDF, JPG, PNG formats</p>
          <div className="step-preview">
            <div className="upload-preview"></div>
          </div>
        </div>
      </div>

      <div className="process-arrow"><span>➜</span></div>

      <div className="process-step-interactive animate-slideIn" data-step="2">
        <div className="step-circle">
          <div className="step-icon">🤖</div>
        </div>
        <div className="step-content">
          <h3 className="step-title">AI Analysis</h3>
          <p className="step-description">Advanced algorithms process your data</p>
          <p className="step-detail">95% accuracy with medical-grade AI</p>
          <div className="step-preview">
            <div className="analysis-preview"></div>
          </div>
        </div>
      </div>

      <div className="process-arrow"><span>➜</span></div>

      <div className="process-step-interactive animate-slideIn" data-step="3">
        <div className="step-circle">
          <div className="step-icon">📋</div>
        </div>
        <div className="step-content">
          <h3 className="step-title">Get Results</h3>
          <p className="step-description">Comprehensive reports in minutes</p>
          <p className="step-detail">Download PDF or view online</p>
          <div className="step-preview">
            <div className="report-preview"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section className="testimonials section">
  <div className="container">
    <div className="section__header">
      <h2 className="section__title animate-fadeInUp">What Our Patients Say</h2>
      <p className="section__subtitle animate-fadeInUp">Real experiences from thousands of satisfied users</p>
    </div>

    <div className="testimonials__grid">
      <div className="testimonial-card animate-fadeInUp" style={{ animationDelay: "0ms" }}>
        <div className="testimonial-rating">
          <span className="star">★</span>
          <span className="star">★</span>
          <span className="star">★</span>
          <span className="star">★</span>
          <span className="star">★</span>
        </div>
        <p className="testimonial-text">
          "Got my X-ray results in 3 minutes! The AI explanation was so clear and helpful."
        </p>
        <div className="testimonial-author">
          <div className="author-avatar">👩</div>
          <div className="author-info">
            <div className="author-name">Sarah M.</div>
            <div className="author-role">Patient</div>
          </div>
        </div>
      </div>

      <div className="testimonial-card animate-fadeInUp" style={{ animationDelay: "100ms" }}>
        <div className="testimonial-rating">
          <span className="star">★</span>
          <span className="star">★</span>
          <span className="star">★</span>
          <span className="star">★</span>
          <span className="star">★</span>
        </div>
        <p className="testimonial-text">
          "Amazing accuracy on my MRI analysis. Saved me weeks of waiting for specialist appointment."
        </p>
        <div className="testimonial-author">
          <div className="author-avatar">👨</div>
          <div className="author-info">
            <div className="author-name">David R.</div>
            <div className="author-role">Patient</div>
          </div>
        </div>
      </div>

      <div className="testimonial-card animate-fadeInUp" style={{ animationDelay: "200ms" }}>
        <div className="testimonial-rating">
          <span className="star">★</span>
          <span className="star">★</span>
          <span className="star">★</span>
          <span className="star">★</span>
          <span className="star">★</span>
        </div>
        <p className="testimonial-text">
          "The blood work analysis helped me understand my results better than my doctor's explanation."
        </p>
        <div className="testimonial-author">
          <div className="author-avatar">👩‍🦱</div>
          <div className="author-info">
            <div className="author-name">Maria L.</div>
            <div className="author-role">Patient</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


<section className="benefits section">
  <div className="container">
    <div className="benefits__content">
      <div className="benefits__text animate-fadeInUp">
        <h2 className="section__title">Why Choose Our AI Platform?</h2>

        <div className="benefits__list">
          <div className="benefit-item-detailed">
            <div className="benefit-check">✓</div>
            <span className="benefit-text">Instant analysis of medical images</span>
          </div>
          <div className="benefit-item-detailed">
            <div className="benefit-check">✓</div>
            <span className="benefit-text">Patient-friendly reports with clear explanations</span>
          </div>
          <div className="benefit-item-detailed">
            <div className="benefit-check">✓</div>
            <span className="benefit-text">24/7 access from any device</span>
          </div>
          <div className="benefit-item-detailed">
            <div className="benefit-check">✓</div>
            <span className="benefit-text">Secure cloud storage for all your medical data</span>
          </div>
        </div>

        <Link to="/" className="btn_1 btn--primary btn--lg">Start Free Trial</Link>
      </div>

      <div className="benefits__image animate-float">
        <div className="floating-image-container">
          <img
            src="https://user-gen-media-assets.s3.amazonaws.com/seedream_images/6d1ba2f7-0475-4a36-bff2-25fe6f39f451.png"
            alt="Medical benefits illustration"
            className="floating-image"
          />
          <div className="floating-shadow"></div>
        </div>
      </div>
    </div>
  </div>
</section>


<section className="technology section">
  <div className="container">
    <div className="technology__content">
      <div className="technology__text animate-fadeInUp">
        <h2 className="section__title">Powered by Advanced AI</h2>
        <p className="section__subtitle">
          Medical-grade artificial intelligence trained on millions of images
        </p>

        <div className="tech-features">
          <div className="tech-feature">
            <span className="tech-icon">🏥</span>
            <span className="tech-text">FDA-approved AI algorithms</span>
          </div>
          <div className="tech-feature">
            <span className="tech-icon">🧠</span>
            <span className="tech-text">Trained on 10M+ medical images</span>
          </div>
          <div className="tech-feature">
            <span className="tech-icon">📈</span>
            <span className="tech-text">Continuous learning and improvement</span>
          </div>
          <div className="tech-feature">
            <span className="tech-icon">🎯</span>
            <span className="tech-text">Medical-grade accuracy standards</span>
          </div>
        </div>
      </div>

      <div className="technology__certifications animate-slideIn">
        <h3 className="cert-title">Certifications &amp; Compliance</h3>
        <div className="cert-grid">
          <div className="cert-badge">
            <div className="cert-icon">🛡️</div>
            <div className="cert-label">HIPAA Compliant</div>
          </div>
          <div className="cert-badge">
            <div className="cert-icon">🔐</div>
            <div className="cert-label">ISO 27001 Certified</div>
          </div>
          <div className="cert-badge">
            <div className="cert-icon">✅</div>
            <div className="cert-label">FDA 510(k) Cleared</div>
          </div>
          <div className="cert-badge">
            <div className="cert-icon">🏆</div>
            <div className="cert-label">SOC 2 Type II</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section className="final-cta section">
  <div className="container">
    <div className="cta-content animate-fadeInUp">
      <div className="cta-background"></div>
      <div className="cta-text">
        <h2 className="cta__title">Ready to Experience AI Medical Analysis?</h2>
        <p className="cta__subtitle">
          Join thousands of patients getting faster, more accurate results
        </p>
      </div>

      <div className="cta__buttons">
        <Link to="/" className="btn_1 btn--white btn--lg cta-primary">
          Start Your Free Analysis
        </Link>
        <Link to="/education" className="btn_1 btn--outline-white btn--lg">
          Contact Sales
        </Link>
      </div>

      <div className="cta-geometric">
        <div className="geo-shape geo-shape-1"></div>
        <div className="geo-shape geo-shape-2"></div>
        <div className="geo-shape geo-shape-3"></div>
      </div>
    </div>
  </div>
</section>

        {/* <div id="chatbot-container">
          <div id="chatbot-icon" onClick={toggleChat}>
            🤖
          </div>
          <div id="chatbot-popup" className={chatVisible ? "chatbot-visible" : "chatbot-hidden"}>
            <div className="chatbot-header">
              <h4>AI Assistant</h4>
              <button onClick={toggleChat} className="chatbot-close">×</button>
            </div>
            <div className="chatbot-messages" id="chatbot-messages">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`chatbot-message ${msg.type === "bot" ? "bot-message" : "user-message"}`}>
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="chatbot-input-container_1">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={handleChatKeyPress}
              />
              <button onClick={sendChatbotMessage} className="chatbot-send">Send</button>
            </div>
          </div>
        </div> */}

      </main>


<footer className="footer">
  <div className="container">
    <div className="footer__content">
      <div className="footer_section footer_brand">
        <div className="footer__logo">
          <img
            src="https://i.postimg.cc/dVxJWzgh/11111.png"
            alt="MedLab Logo"
            className="logo__img"
          />
          <span className="logo__text" style={{color:"white" }}>
            Skeleti-<span className="edit" style={{ color: "#0EA5E9" }}><img src="https://i.postimg.cc/dVxJWzgh/11111.png" className="logo_img_1" alt="Skeleti-x logo" /></span>
          </span>
        </div>
        <p className="footer__description">
          Transform your medical imaging with AI-powered analysis. Fast, accurate, and patient-friendly results.
        </p>

        <div className="footer__social">
          <h5>Follow Us</h5>
          <div className="social-links">
            <button type="button" className="social-link">🐦 Twitter</button>
            <button type="button" className="social-link">🗺 LinkedIn</button>
            <button type="button" className="social-link">📱 Facebook</button>
          </div>
        </div>
      </div>

      <div className="footer__section">
        <h4>Quick Links</h4>
        <ul className="footer__links">
          <li><Link to="/upload">Upload Files</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/reports">View Reports</Link></li>
          <li><Link to="/chatbot">AI Assistant</Link></li>
          <li><Link to="/education">Education Center</Link></li>
        </ul>
      </div>

      <div className="footer__section">
        <h4>Resources</h4>
        <ul className="footer__links">
          <li><button type="button" className="footer-link-button">Help Center</button></li>
          <li><button type="button" className="footer-link-button">API Documentation</button></li>
          <li><button type="button" className="footer-link-button">Medical Guidelines</button></li>
          <li><button type="button" className="footer-link-button">Research Papers</button></li>
          <li><button type="button" className="footer-link-button">Blog</button></li>
        </ul>
      </div>

      <div className="footer__section">
        <h4>Newsletter</h4>
        <p className="footer__newsletter-text">
          Stay updated with the latest in AI medical technology
        </p>
        <div className="newsletter-form">
          <input type="email" placeholder="Enter your email" className="newsletter-input" />
          <button className="newsletter-btn">Subscribe</button>
        </div>

        <div className="footer__badges">
          <div className="compliance-badge">
            <span className="badge-icon">🛡️</span>
            <span className="badge-text">HIPAA Compliant</span>
          </div>
          <div className="compliance-badge">
            <span className="badge-icon">🏆</span>
            <span className="badge-text">FDA Approved</span>
          </div>
        </div>
      </div>
    </div>

    <div className="footer__bottom">
      <div className="footer__bottom-content">
        <div className="footer__copyright">
          <p>&copy; 2025 Skeleti-x. All rights reserved.</p>
        </div>
        <div className="footer__legal">
          <button type="button" className="footer-link-button">Privacy Policy</button>
          <button type="button" className="footer-link-button">Terms of Service</button>
          <button type="button" className="footer-link-button">Cookie Policy</button>
          <button type="button" className="footer-link-button">Accessibility</button>
        </div>
      </div>
    </div>
  </div>
</footer>


    </div>
  );
}

export default Home;
