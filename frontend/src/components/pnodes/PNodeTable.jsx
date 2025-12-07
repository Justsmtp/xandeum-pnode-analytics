// frontend/src/components/pnodes/PNodeTable.jsx
import React from 'react';
import StatusBadge from './StatusBadge';
import { formatBytes, formatUptime } from '../../utils/helpers';
import './PNodeTable.css';

const PNodeTable = ({ nodes }) => {
  return (
    <div className="pnode-table-container">
      <table className="pnode-table">
        <thead>
          <tr>
            <th>Node ID</th>
            <th>Status</th>
            <th>Location</th>
            <th>Uptime</th>
            <th>Storage Used</th>
            <th>Storage Total</th>
            <th>Version</th>
            <th>Last Seen</th>
          </tr>
        </thead>
        <tbody>
          {nodes.map((node) => {
            const storagePercent = node.storage?.total
              ? ((node.storage.used / node.storage.total) * 100).toFixed(1)
              : 0;

            return (
              <tr key={node.id}>
                <td>
                  <div className="table-node-id">
                    <span className="node-icon">⬡</span>
                    {node.id}
                  </div>
                </td>
                <td>
                  <StatusBadge status={node.gossipStatus} />
                </td>
                <td>
                  {node.location?.city}, {node.location?.country}
                  <div className="location-region">{node.location?.region}</div>
                </td>
                <td>{formatUptime(node.uptime)}</td>
                <td>
                  <div className="storage-cell">
                    {formatBytes(node.storage?.used || 0)}
                    <div className="storage-mini-bar">
                      <div 
                        className="storage-mini-fill" 
                        style={{ width: `${storagePercent}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td>{formatBytes(node.storage?.total || 0)}</td>
                <td>
                  <span className="version-badge">{node.version || 'N/A'}</span>
                </td>
                <td className="last-seen-cell">
                  {new Date(node.lastSeen).toLocaleString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PNodeTable;
