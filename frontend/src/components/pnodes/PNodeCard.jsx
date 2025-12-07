// frontend/src/components/pnodes/PNodeCard.jsx
import React from 'react';
import StatusBadge from './StatusBadge';
import { formatBytes, formatUptime } from '../../utils/helpers';
import './PNodeCard.css';

const PNodeCard = ({ node }) => {
  const storagePercent = node.storage?.total 
    ? ((node.storage.used / node.storage.total) * 100).toFixed(1)
    : 0;

  return (
    <div className="pnode-card">
      <div className="pnode-card-header">
        <div className="pnode-id">
          <span className="pnode-icon">⬡</span>
          <span className="pnode-id-text">{node.id}</span>
        </div>
        <StatusBadge status={node.gossipStatus} />
      </div>

      <div className="pnode-card-body">
        <div className="pnode-info-row">
          <span className="info-label">📍 Location</span>
          <span className="info-value">
            {node.location?.city || 'Unknown'}, {node.location?.country || 'Unknown'}
          </span>
        </div>

        <div className="pnode-info-row">
          <span className="info-label">⏱️ Uptime</span>
          <span className="info-value">{formatUptime(node.uptime)}</span>
        </div>

        <div className="pnode-info-row">
          <span className="info-label">🔢 Version</span>
          <span className="info-value">{node.version || 'N/A'}</span>
        </div>

        <div className="pnode-storage">
          <div className="storage-header">
            <span className="info-label">💾 Storage</span>
            <span className="storage-percent">{storagePercent}%</span>
          </div>
          <div className="storage-bar">
            <div 
              className="storage-fill" 
              style={{ width: `${storagePercent}%` }}
            ></div>
          </div>
          <div className="storage-details">
            <span>{formatBytes(node.storage?.used || 0)} used</span>
            <span>{formatBytes(node.storage?.total || 0)} total</span>
          </div>
        </div>
      </div>

      <div className="pnode-card-footer">
        <span className="last-seen">
          Last seen: {new Date(node.lastSeen).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default PNodeCard;
