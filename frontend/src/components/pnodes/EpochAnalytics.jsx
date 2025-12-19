// frontend/src/components/pnodes/EpochAnalytics.jsx
import React from 'react';
import './EpochAnalytics.css';

const EpochAnalytics = ({ epochInfo, solanaData }) => {
  // Mock data if real Solana data not available
  const epoch = epochInfo || {
    epoch: 625,
    slotIndex: 234567,
    slotsInEpoch: 432000,
    absoluteSlot: 270234567,
  };

  const solana = solanaData || {
    tps: 2847,
    blockHeight: 270234567,
    validators: 1789,
    stakeAmount: '389.2M SOL',
  };

  const epochProgress = ((epoch.slotIndex / epoch.slotsInEpoch) * 100).toFixed(2);
  const remainingSlots = epoch.slotsInEpoch - epoch.slotIndex;
  const estimatedTimeRemaining = ((remainingSlots * 0.4) / 3600).toFixed(1); // ~0.4s per slot

  return (
    <div className="epoch-analytics">
      <div className="epoch-header">
        <h3 className="epoch-title">
          <span className="epoch-icon">⚡</span>
          Epoch & Network Stats
        </h3>
        <div className="solana-badge">
          <img 
            src="https://cryptologos.cc/logos/solana-sol-logo.png" 
            alt="Solana" 
            className="solana-logo"
          />
          <span>Solana</span>
        </div>
      </div>

      <div className="epoch-current">
        <div className="epoch-number">
          <span className="epoch-label">Current Epoch</span>
          <span className="epoch-value">{epoch.epoch}</span>
        </div>
        
        <div className="epoch-progress-container">
          <div className="epoch-progress-header">
            <span className="progress-label">Epoch Progress</span>
            <span className="progress-percentage">{epochProgress}%</span>
          </div>
          <div className="epoch-progress-bar">
            <div 
              className="epoch-progress-fill"
              style={{ width: `${epochProgress}%` }}
            >
              <span className="progress-shimmer"></span>
            </div>
          </div>
          <div className="epoch-progress-info">
            <span>{epoch.slotIndex.toLocaleString()} / {epoch.slotsInEpoch.toLocaleString()} slots</span>
            <span>~{estimatedTimeRemaining}h remaining</span>
          </div>
        </div>
      </div>

      <div className="network-stats-grid">
        <div className="network-stat-card">
          <div className="stat-card-icon"></div>
          <div className="stat-card-content">
            <div className="stat-card-value">{solana.tps.toLocaleString()}</div>
            <div className="stat-card-label">TPS</div>
          </div>
          <div className="stat-card-trend positive">↗ Live</div>
        </div>

        <div className="network-stat-card">
          <div className="stat-card-icon"></div>
          <div className="stat-card-content">
            <div className="stat-card-value">{(solana.blockHeight / 1000000).toFixed(1)}M</div>
            <div className="stat-card-label">Block Height</div>
          </div>
          <div className="stat-card-trend">Growing</div>
        </div>

        <div className="network-stat-card">
          <div className="stat-card-icon"></div>
          <div className="stat-card-content">
            <div className="stat-card-value">{solana.validators.toLocaleString()}</div>
            <div className="stat-card-label">Validators</div>
          </div>
          <div className="stat-card-trend positive">↗ Active</div>
        </div>

        <div className="network-stat-card">
          <div className="stat-card-icon"></div>
          <div className="stat-card-content">
            <div className="stat-card-value">{solana.stakeAmount}</div>
            <div className="stat-card-label">Total Stake</div>
          </div>
          <div className="stat-card-trend">Staked</div>
        </div>
      </div>

      <div className="rpc-status">
        <div className="rpc-indicator">
          <span className="rpc-dot"></span>
          <span className="rpc-text">RPC Connected</span>
        </div>
        <div className="rpc-endpoint">mainnet-beta</div>
      </div>
    </div>
  );
};

export default EpochAnalytics;