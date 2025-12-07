// frontend/src/components/layout/Footer.jsx
import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Xandeum Labs</h4>
            <p>Decentralized storage network powered by pNodes</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="https://xandeum.network" target="_blank" rel="noopener noreferrer">Website</a></li>
              <li><a href="https://docs.xandeum.network" target="_blank" rel="noopener noreferrer">Documentation</a></li>
              <li><a href="https://github.com/xandeum" target="_blank" rel="noopener noreferrer">GitHub</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Resources</h4>
            <ul>
              <li><a href="/dashboard">Dashboard</a></li>
              <li><a href="https://xandeum.network/blog" target="_blank" rel="noopener noreferrer">Blog</a></li>
              <li><a href="https://xandeum.network/support" target="_blank" rel="noopener noreferrer">Support</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Xandeum Labs. All rights reserved.</p>
          <p className="footer-powered">Powered by Nigerian Innovation 🇳🇬</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
