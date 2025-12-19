// frontend/src/components/pnodes/NetworkHealth.jsx
import React, { useMemo } from 'react';
import './NetworkHealth.css';

const NetworkHealth = ({ pNodes, statistics }) => {
  const healthMetrics = useMemo(() => {
    if (!pNodes || pNodes.length === 0) return null;

    const activeNodes = pNodes.filter(n => n.gossipStatus === 'active').length;
    const totalNodes = pNodes.length;
    const healthPercentage = ((activeNodes / totalNodes) * 100).toFixed(1);

    // Calculate average uptime
    const totalUptime = pNodes.reduce((sum, node) => sum + (node.uptime || 0), 0);
    const avgUptimeSeconds = totalUptime / pNodes.length;
    const avgUptimeDays = (avgUptimeSeconds / 86400).toFixed(1);

    // Calculate latency metrics
    const latencies = pNodes
      .map(n => n.metadata?.latency)
      .filter(l => l !== null && l !== undefined);
    const avgLatency = latencies.length > 0
      ? (latencies.reduce((sum, l) => sum + l, 0) / latencies.length).toFixed(2)
      : 0;

    // Storage health
    const storageUsedPercent = statistics?.totalStorage?.total > 0
      ? ((statistics.totalStorage.used / statistics.totalStorage.total) * 100).toFixed(1)
      : 0;

    return {
      healthPercentage,
      activeNodes,
      totalNodes,
      avgUptimeDays,
      avgLatency,
      storageUsedPercent,
      status: healthPercentage >= 90 ? 'excellent' : healthPercentage >= 70 ? 'good' : 'warning',
    };
  }, [pNodes, statistics]);

  if (!healthMetrics) {
    return (
      <div className="network-health">
        <div className="health-loading">Loading health metrics...</div>
      </div>
    );
  }

  const getHealthColor = (status) => {
    switch (status) {
      case 'excellent': return '#4CAF50';
      case 'good': return '#8BC34A';
      case 'warning': return '#FF9800';
      default: return '#F44336';
    }
  };

  const getHealthLabel = (status) => {
    switch (status) {
      case 'excellent': return 'Excellent';
      case 'good': return 'Good';
      case 'warning': return 'Fair';
      default: return 'Poor';
    }
  };

  return (
    <div className="network-health">
      <div className="health-header">
        <h3 className="health-title">
          <span className="health-icon">💚</span>
          Network Health
        </h3>
        <div className={`health-badge ${healthMetrics.status}`}>
          {getHealthLabel(healthMetrics.status)}
        </div>
      </div>

      <div className="health-score-container">
        <div className="health-circle">
          <svg viewBox="0 0 200 200" className="health-circle-svg">
            <circle
              cx="100"
              cy="100"
              r="85"
              fill="none"
              stroke="#E0E0E0"
              strokeWidth="12"
            />
            <circle
              cx="100"
              cy="100"
              r="85"
              fill="none"
              stroke={getHealthColor(healthMetrics.status)}
              strokeWidth="12"
              strokeDasharray={`${(healthMetrics.healthPercentage / 100) * 534.07} 534.07`}
              strokeLinecap="round"
              transform="rotate(-90 100 100)"
              className="health-circle-progress"
            />
          </svg>
          <div className="health-score-text">
            <div className="health-percentage">{healthMetrics.healthPercentage}%</div>
            <div className="health-label">Network Health</div>
          </div>
        </div>
      </div>

      <div className="health-metrics-grid">
        <div className="health-metric">
          <div className="metric-icon-small">✅</div>
          <div className="metric-info">
            <div className="metric-value-small">{healthMetrics.activeNodes}/{healthMetrics.totalNodes}</div>
            <div className="metric-label-small">Active Nodes</div>
          </div>
        </div>

        <div className="health-metric">
          <div className="metric-icon-small">⏱️</div>
          <div className="metric-info">
            <div className="metric-value-small">{healthMetrics.avgUptimeDays}d</div>
            <div className="metric-label-small">Avg Uptime</div>
          </div>
        </div>

        <div className="health-metric">
          <div className="metric-icon-small">⚡</div>
          <div className="metric-info">
            <div className="metric-value-small">{healthMetrics.avgLatency}ms</div>
            <div className="metric-label-small">Avg Latency</div>
          </div>
        </div>

        <div className="health-metric">
          <div className="metric-icon-small">💾</div>
          <div className="metric-info">
            <div className="metric-value-small">{healthMetrics.storageUsedPercent}%</div>
            <div className="metric-label-small">Storage Used</div>
          </div>
        </div>
      </div>

      <div className="health-status-bars">
        <div className="status-bar-item">
          <div className="status-bar-label">
            <span>Network Availability</span>
            <span className="status-bar-value">{healthMetrics.healthPercentage}%</span>
          </div>
          <div className="status-bar-track">
            <div 
              className="status-bar-fill success"
              style={{ width: `${healthMetrics.healthPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="status-bar-item">
          <div className="status-bar-label">
            <span>Storage Capacity</span>
            <span className="status-bar-value">{healthMetrics.storageUsedPercent}%</span>
          </div>
          <div className="status-bar-track">
            <div 
              className="status-bar-fill info"
              style={{ width: `${healthMetrics.storageUsedPercent}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkHealth;