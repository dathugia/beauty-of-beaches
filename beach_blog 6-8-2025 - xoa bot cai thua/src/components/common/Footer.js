import React from 'react';
import { Link } from 'react-router-dom';
import FooterMarquee from './FooterMarquee';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top-border"></div>
      
      <div className="footer-content">
        <div className="footer-container">
          {/* Column 1: About */}
          <div className="footer-column">
            <h3 className="footer-title">BeautyOfBeaches</h3>
            <p className="footer-description">
              Discover the world's most beautiful beaches with us. 
              Explore stunning coastal destinations and plan your perfect beach getaway.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-column">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/gallery">Photo Gallery</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/feedback">Feedback</Link></li>
            </ul>
          </div>

          {/* Column 3: Regions */}
          <div className="footer-column">
            <h3 className="footer-title">Regions</h3>
            <ul className="footer-links">
              <li><Link to="/regions/north">North</Link></li>
              <li><Link to="/regions/south">South</Link></li>
              <li><Link to="/regions/east">East</Link></li>
              <li><Link to="/regions/west">West</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="footer-column">
            <h3 className="footer-title">Contact</h3>
            <div className="footer-contact">
              <p>Email: info@beautyofbeaches.com</p>
              <p>Phone: +84 28 1234 5678</p>
              <p>Address: 123 Beach Street, Ho Chi Minh City</p>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-separator"></div>
      
      <div className="footer-bottom">
        <div className="footer-container">
          <p className="footer-copyright">
            © 2024 BeautyOfBeaches. All rights reserved.
          </p>
        </div>
      </div>
      
      <FooterMarquee />
    </footer>
  );
};

export default Footer;
