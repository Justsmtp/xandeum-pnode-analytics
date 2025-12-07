// frontend/src/components/layout/Navbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="logo-icon">X</div>
          <span className="brand-text">Xandeum pNode Analytics</span>
        </Link>
        
        <div className="navbar-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/dashboard" 
            className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <a 
            href="https://xandeum.network" 
            target="_blank" 
            rel="noopener noreferrer"
            className="nav-link external"
          >
            Docs ↗
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
