import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="#features">Features</Link></li>
            <li><Link to="#about">About</Link></li>
            <li><Link to="#contact">Contact</Link></li>
            <li><Link to="/faq">FAQ</Link></li> {/* Updated to link to FAQ page */}
          </ul>
        </div>
        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Sayanaro Bazaar. All Rights Reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;