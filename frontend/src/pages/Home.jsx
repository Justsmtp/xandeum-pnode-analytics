// frontend/src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import './Home.css';

const Home = () => {
  return (
    <DashboardLayout>
      <div className="home-page">
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Xandeum pNode <span className="highlight">Analytics</span>
            </h1>
            <p className="hero-subtitle">
              Real-time monitoring and analytics for the Xandeum decentralized storage network
            </p>
            <Link to="/dashboard" className="cta-button">
              View Dashboard →
            </Link>
          </div>
          <div className="hero-graphic">
            <div className="network-visual">
              <div className="node-dot node-1"></div>
              <div className="node-dot node-2"></div>
              <div className="node-dot node-3"></div>
              <div className="node-dot node-4"></div>
              <div className="connection c-1"></div>
              <div className="connection c-2"></div>
              <div className="connection c-3"></div>
            </div>
          </div>
        </div>

        <div className="features-section">
          <h2 className="section-title">Mission & Features</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🌐</div>
              <h3>Decentralized Network</h3>
              <p>
                Xandeum powers a distributed storage network through pNodes, 
                enabling secure and resilient data storage across the globe.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Real-Time Analytics</h3>
              <p>
                Monitor all active pNodes in the gossip network with live updates 
                every 30 seconds, providing instant visibility into network health.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Advanced Filtering</h3>
              <p>
                Search and filter nodes by status, region, uptime, and more. 
                Switch between card and table views for optimal data visualization.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💚</div>
              <h3>Nigerian Innovation</h3>
              <p>
                Built with pride in Nigeria, showcasing African excellence in 
                blockchain technology and decentralized systems.
              </p>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <h2>Ready to explore the network?</h2>
          <Link to="/dashboard" className="cta-button">
            Launch Dashboard
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;
