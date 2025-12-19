// frontend/src/components/pnodes/PNodeTable.jsx
import React, { useState, useMemo } from 'react';
import StatusBadge from './StatusBadge';
import { formatBytes, formatUptime } from '../../utils/helpers';
import './PNodeTable.css';

const PNodeTable = ({ nodes }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'uptime', direction: 'desc' });

  const sortedNodes = useMemo(() => {
    const sorted = [...nodes];
    
    sorted.sort((a, b) => {
      let aValue, bValue;

      switch (sortConfig.key) {
        case 'id':
          aValue = a.id;
          bValue = b.id;
          break;
        case 'status':
          aValue = a.gossipStatus;
          bValue = b.gossipStatus;
          break;
        case 'location':
          aValue = `${a.location?.country} ${a.location?.city}`;
          bValue = `${b.location?.country} ${b.location?.city}`;
          break;
        case 'uptime':
          aValue = a.uptime || 0;
          bValue = b.uptime || 0;
          break;
        case 'storage':
          aValue = a.storage?.used || 0;
          bValue = b.storage?.used || 0;
          break;
        case 'version':
          aValue = a.version || '';
          bValue = b.version || '';
          break;
        case 'latency':
          aValue = a.metadata?.latency || 999999;
          bValue = b.metadata?.latency || 999999;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  }, [nodes, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="pnode-table-container">
      <div className="table-scroll-wrapper">
        <table className="pnode-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')} className="sortable">
                <div className="th-content">
                  <span>Node ID</span>
                  <span className="sort-icon">{getSortIcon('id')}</span>
                </div>
              </th>
              <th onClick={() => handleSort('status')} className="sortable">
                <div className="th-content">
                  <span>Status</span>
                  <span className="sort-icon">{getSortIcon('status')}</span>
                </div>
              </th>
              <th onClick={() => handleSort('location')} className="sortable">
                <div className="th-content">
                  <span>Location</span>
                  <span className="sort-icon">{getSortIcon('location')}</span>
                </div>
              </th>
              <th onClick={() => handleSort('uptime')} className="sortable">
                <div className="th-content">
                  <span>Uptime</span>
                  <span className="sort-icon">{getSortIcon('uptime')}</span>
                </div>
              </th>
              <th onClick={() => handleSort('storage')} className="sortable">
                <div className="th-content">
                  <span>Storage Used</span>
                  <span className="sort-icon">{getSortIcon('storage')}</span>
                </div>
              </th>
              <th>Storage Total</th>
              <th onClick={() => handleSort('latency')} className="sortable">
                <div className="th-content">
                  <span>Latency</span>
                  <span className="sort-icon">{getSortIcon('latency')}</span>
                </div>
              </th>
              <th onClick={() => handleSort('version')} className="sortable">
                <div className="th-content">
                  <span>Version</span>
                  <span className="sort-icon">{getSortIcon('version')}</span>
                </div>
              </th>
              <th>Last Seen</th>
            </tr>
          </thead>
          <tbody>
            {sortedNodes.map((node) => {
              const storagePercent = node.storage?.total
                ? ((node.storage.used / node.storage.total) * 100).toFixed(1)
                : 0;

              return (
                <tr key={node.id} className="table-row">
                  <td>
                    <div className="table-node-id">
                      <span className="node-icon">⬡</span>
                      <span className="node-id-text">{node.id}</span>
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={node.gossipStatus} />
                  </td>
                  <td>
                    <div className="location-cell">
                      <span className="location-main">
                        {node.location?.city}, {node.location?.country}
                      </span>
                      <span className="location-region">{node.location?.region}</span>
                    </div>
                  </td>
                  <td>
                    <div className="uptime-cell">
                      <span className="uptime-value">{formatUptime(node.uptime)}</span>
                    </div>
                  </td>
                  <td>
                    <div className="storage-cell">
                      <span className="storage-value">{formatBytes(node.storage?.used || 0)}</span>
                      <div className="storage-mini-bar">
                        <div 
                          className="storage-mini-fill" 
                          style={{ width: `${storagePercent}%` }}
                        ></div>
                      </div>
                      <span className="storage-percent">{storagePercent}%</span>
                    </div>
                  </td>
                  <td>
                    <span className="storage-total">{formatBytes(node.storage?.total || 0)}</span>
                  </td>
                  <td>
                    <div className="latency-cell">
                      {node.metadata?.latency ? (
                        <>
                          <span className="latency-value">{node.metadata.latency}ms</span>
                          <span className={`latency-badge ${
                            node.metadata.latency < 50 ? 'excellent' : 
                            node.metadata.latency < 100 ? 'good' : 'fair'
                          }`}>
                            {node.metadata.latency < 50 ? '⚡' : 
                             node.metadata.latency < 100 ? '✓' : '~'}
                          </span>
                        </>
                      ) : (
                        <span className="latency-na">N/A</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="version-badge">{node.version || 'N/A'}</span>
                  </td>
                  <td className="last-seen-cell">
                    <span className="last-seen-time">
                      {new Date(node.lastSeen).toLocaleString()}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {sortedNodes.length === 0 && (
        <div className="table-empty">
          <span className="empty-icon"></span>
          <p>No nodes found</p>
        </div>
      )}
    </div>
  );
};

export default PNodeTable;