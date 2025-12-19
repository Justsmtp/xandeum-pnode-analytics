// frontend/src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import './Home.css';

const Home = () => {
  return (
    <DashboardLayout>
      <div className="home-page">
        {/* Floating Background Dots */}
        <div className="floating-dots">
          <div className="floating-dot dot-1"></div>
          <div className="floating-dot dot-2"></div>
          <div className="floating-dot dot-3"></div>
          <div className="floating-dot dot-4"></div>
          <div className="floating-dot dot-5"></div>
          <div className="floating-dot dot-6"></div>
          <div className="floating-dot dot-7"></div>
          <div className="floating-dot dot-8"></div>
          <div className="floating-dot dot-9"></div>
          <div className="floating-dot dot-10"></div>
        </div>

        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Xandeum pNode <span className="highlight">Analytics</span>
            </h1>
            <p className="hero-subtitle">
              Real-time monitoring and analytics for the Xandeum decentralized storage network
            </p>
            <div className="hero-buttons">
              <Link to="/dashboard" className="cta-button primary">
                View Dashboard →
              </Link>
              <a 
                href="https://xandeum.network" 
                target="_blank" 
                rel="noopener noreferrer"
                className="cta-button secondary"
              >
                Learn More
              </a>
            </div>
          </div>
          <div className="hero-graphic">
            <div className="network-visual">
              <div className="node-dot node-1"></div>
              <div className="node-dot node-2"></div>
              <div className="node-dot node-3"></div>
              <div className="node-dot node-4"></div>
              <div className="node-dot node-5"></div>
              <div className="node-dot node-6"></div>
              <div className="connection c-1"></div>
              <div className="connection c-2"></div>
              <div className="connection c-3"></div>
              <div className="connection c-4"></div>
            </div>
          </div>
        </div>

        {/* Decentralized Storage Banner */}
        <div className="storage-banner floating-box">
          <h2 className="banner-title">Decentralized Storage</h2>
          <p className="banner-subtitle">Powering the future of Web3 infrastructure</p>
        </div>

        {/* Smart Contract & Random Access Section */}
        <div className="tech-features-section">
          <div className="tech-feature-box floating-box">
            <div className="tech-icon"></div>
            <h3>Smart Contract Native</h3>
            <p>
              Xandeum integrates directly with Solana's smart contract platform, 
              enabling seamless and efficient data interaction for dApps.
            </p>
            <a 
              href="https://xandeum.network/smart-contracts" 
              target="_blank" 
              rel="noopener noreferrer"
              className="learn-more-link"
            >
              Learn More →
            </a>
          </div>

          <div className="tech-feature-box floating-box">
            <div className="tech-icon"></div>
            <h3>Random Access</h3>
            <p>
              Xandeum allows for quick and efficient retrieval of specific data, 
              unlike solutions that only offer file-level access.
            </p>
            <a 
              href="https://xandeum.network/random-access" 
              target="_blank" 
              rel="noopener noreferrer"
              className="learn-more-link"
            >
              Learn More →
            </a>
          </div>
        </div>

        {/* Mission & Features */}
        <div className="features-section">
          <h2 className="section-title">Mission & Features</h2>
          
          <div className="features-grid">
            <div className="feature-card floating-box">
              <div className="feature-icon"></div>
              <h3>Decentralized Network</h3>
              <p>
                Xandeum powers a distributed storage network through pNodes, 
                enabling secure and resilient data storage across the globe.
              </p>
              <a 
                href="https://xandeum.network/network" 
                target="_blank" 
                rel="noopener noreferrer"
                className="learn-more-link"
              >
                Learn More →
              </a>
            </div>

            <div className="feature-card floating-box">
              <div className="feature-icon"></div>
              <h3>Real-Time Analytics</h3>
              <p>
                Monitor all active pNodes in the gossip network with live updates 
                every 30 seconds, providing instant visibility into network health.
              </p>
              <a 
                href="https://xandeum.network/analytics" 
                target="_blank" 
                rel="noopener noreferrer"
                className="learn-more-link"
              >
                Learn More →
              </a>
            </div>

            <div className="feature-card floating-box">
              <div className="feature-icon"></div>
              <h3>Advanced Filtering</h3>
              <p>
                Search and filter nodes by status, region, uptime, and more. 
                Switch between card and table views for optimal data visualization.
              </p>
              <a 
                href="https://xandeum.network/features" 
                target="_blank" 
                rel="noopener noreferrer"
                className="learn-more-link"
              >
                Learn More →
              </a>
            </div>

            <div className="feature-card floating-box">
              <div className="feature-icon"></div>
              <h3>Nigerian Innovation</h3>
              <p>
                Built with pride in Nigeria, showcasing African excellence in 
                blockchain technology and decentralized systems.
              </p>
              <a 
                href="https://xandeum.network/about" 
                target="_blank" 
                rel="noopener noreferrer"
                className="learn-more-link"
              >
                Learn More →
              </a>
            </div>
          </div>
        </div>

        {/* Liquid Staking Section */}
        <div className="staking-section floating-box">
          <div className="staking-content">
            <div className="staking-header">
              <h2 className="staking-title">Liquid Staking with Xandeum</h2>
              <div className="staking-badge">NEW</div>
            </div>
            <p className="staking-subtitle">Earn rewards while supporting the network</p>
            
            <div className="staking-benefits">
              <div className="benefit-item">
                <div className="benefit-icon"></div>
                <div className="benefit-text">
                  <h4>Storage Fees in SOL</h4>
                  <p>Storage-enabled dApps pay storage fees in SOL</p>
                </div>
              </div>

              <div className="benefit-item">
                <div className="benefit-icon"></div>
                <div className="benefit-text">
                  <h4>Validator Delegation</h4>
                  <p>Xandeum Liquid Staking captures these by delegating to Xandeum-enabled validators</p>
                </div>
              </div>

              <div className="benefit-item">
                <div className="benefit-icon"></div>
                <div className="benefit-text">
                  <h4>Direct Rewards</h4>
                  <p>When staking with us, these storage rewards arrive directly in your wallet</p>
                </div>
              </div>
            </div>

            <div className="staking-actions">
              <a 
                href="https://xandsol.xandeum.network" 
                target="_blank" 
                rel="noopener noreferrer"
                className="stake-button"
              >
                Stake Now →
              </a>
              <a 
                href="https://xandsol.xandeum.network" 
                target="_blank" 
                rel="noopener noreferrer"
                className="learn-more-button"
              >
                Learn About Staking
              </a>
            </div>
          </div>
        </div>

        {/* Ecosystem Tools */}
        <div className="ecosystem-section">
          <h2 className="section-title">Powered by Solana Ecosystem</h2>
          <p className="ecosystem-subtitle">Built with the best tools in Web3</p>
          
          <div className="ecosystem-tools">
            <a 
              href="https://solana.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="tool-card floating-box"
            >
              <div className="tool-logo">
                <img src="https://cryptologos.cc/logos/solana-sol-logo.png" alt="Solana" />
              </div>
              <h4>Solana</h4>
              <p>High-performance blockchain</p>
            </a>

            <a 
              href="https://phantom.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="tool-card floating-box"
            >
              <div className="tool-logo phantom-gradient">
                <span>👻</span>
              </div>
              <h4>Phantom</h4>
              <p>Multi-chain crypto wallet</p>
            </a>

            <a 
              href="https://jito.network" 
              target="_blank" 
              rel="noopener noreferrer"
              className="tool-card floating-box"
            >
              <div className="tool-logo jito-gradient">
                <span>⚡</span>
              </div>
              <h4>Jito</h4>
              <p>MEV infrastructure</p>
            </a>
          </div>
        </div>

        {/* Final CTA */}
        <div className="cta-section floating-box">
          <h2>Ready to explore the network?</h2>
          <div className="cta-buttons">
            <Link to="/dashboard" className="cta-button primary large">
              Launch Dashboard
            </Link>
            <a 
              href="https://xandeum.network" 
              target="_blank" 
              rel="noopener noreferrer"
              className="cta-button secondary large"
            >
              Visit Xandeum Network
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;