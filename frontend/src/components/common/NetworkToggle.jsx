// frontend/src/components/common/NetworkToggle.jsx
import React from 'react';
import './NetworkToggle.css';

const NetworkToggle = ({ network, setNetwork }) => {
  return (
    <div className="network-toggle">
      <button
        className={`network-btn ${network === 'mainnet' ? 'active' : ''}`}
        onClick={() => setNetwork('mainnet')}
      >
        Mainnet
      </button>
      <button
        className={`network-btn ${network === 'testnet' ? 'active' : ''}`}
        onClick={() => setNetwork('testnet')}
      >
        Testnet
      </button>
    </div>
  );
};

export default NetworkToggle;