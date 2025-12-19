/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
// frontend/src/pages/Dashboard.jsx
import React, { useState, useMemo, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import PNodeList from '../components/pnodes/PNodeList';
import SearchBar from '../components/common/SearchBar';
import FilterPanel from '../components/common/FilterPanel';
import LoadingSpinner from '../components/common/LoadingSpinner';
import RegionHeatmap from '../components/pnodes/RegionHeatmap';
import EpochAnalytics from '../components/pnodes/EpochAnalytics';
import NetworkHealth from '../components/pnodes/NetworkHealth';
import { usePNodes } from '../hooks/usePNodes';
import { usePNodeContext } from '../context/PNodeContext';
import { formatBytes, formatNumber } from '../utils/helpers';
import './Dashboard.css';

const Dashboard = () => {
  const {
    pNodes,
    allPNodes,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    regionFilter,
    setRegionFilter,
    refreshPNodes,
  } = usePNodes();

  const { statistics, lastUpdated, solanaData, epochInfo } = usePNodeContext();
  const [liveUpdateIndicator, setLiveUpdateIndicator] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'uptime', direction: 'desc' });

  // Get unique regions
  const regions = useMemo(() => {
    const regionSet = new Set();
    allPNodes.forEach((node) => {
      if (node.location?.region) {
        regionSet.add(node.location.region);
      }
    });
    return Array.from(regionSet).sort();
  }, [allPNodes]);

  // Live update indicator animation
  useEffect(() => {
    if (lastUpdated) {
      setLiveUpdateIndicator(true);
      const timer = setTimeout(() => setLiveUpdateIndicator(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [lastUpdated]);

  // Calculate performance metrics
  const performanceMetrics = useMemo(() => {
    if (!allPNodes.length) return null;

    const totalLatency = allPNodes.reduce((sum, node) => 
      sum + (node.metadata?.latency || 0), 0);
    const avgLatency = totalLatency / allPNodes.length;

    const activeNodes = allPNodes.filter(n => n.gossipStatus === 'active');
    const healthScore = (activeNodes.length / allPNodes.length) * 100;

    return {
      avgLatency: avgLatency.toFixed(2),
      healthScore: healthScore.toFixed(1),
      totalStake: statistics?.totalStorage?.total || 0,
      activeValidators: activeNodes.length,
    };
  }, [allPNodes, statistics]);

  if (loading && allPNodes.length === 0) {
    return (
      <DashboardLayout>
        <LoadingSpinner message="Connecting to Xandeum Network..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="dashboard-page">
        {/* Live Status Bar */}
        <div className={`live-status-bar ${liveUpdateIndicator ? 'pulsing' : ''}`}>
          <div className="live-indicator">
            <span className="live-dot"></span>
            <span className="live-text">LIVE</span>
          </div>
          <div className="status-info">
            <span>Xandeum Network</span>
            <span className="separator">•</span>
            <span>Real-time Updates</span>
            {lastUpdated && (
              <>
                <span className="separator">•</span>
                <span>Last: {lastUpdated.toLocaleTimeString()}</span>
              </>
            )}
          </div>
          <button className="refresh-button-mini" onClick={refreshPNodes} disabled={loading}>
            {loading ? '⟳' : '↻'}
          </button>
        </div>

        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <h1 className="dashboard-title">
              Xandeum Network Dashboard
            </h1>
            <p className="dashboard-subtitle">
              Real-time pNode analytics and network monitoring
            </p>
          </div>
          <div className="header-actions">
            <button className="action-button secondary" onClick={refreshPNodes}>
              Refresh
            </button>
            <button className="action-button primary">
              Export Data
            </button>
          </div>
        </div>

        {error && (
          <div className="error-banner">
            <div className="error-content">
              <strong>Connection Error</strong>
              <p>{error}</p>
            </div>
            <button onClick={refreshPNodes} className="error-retry">Retry</button>
          </div>
        )}

        {/* Key Metrics Overview */}
        <div className="metrics-overview">
          <div className="metric-card primary">
            <div className="metric-header">
              <span className="metric-badge">Network</span>
            </div>
            <div className="metric-value">{statistics?.total || 0}</div>
            <div className="metric-label">Total pNodes</div>
            <div className="metric-change positive">
              {statistics?.active || 0} Active
            </div>
          </div>

          <div className="metric-card success">
            <div className="metric-header">
              <span className="metric-badge">Health</span>
            </div>
            <div className="metric-value">{performanceMetrics?.healthScore || 0}%</div>
            <div className="metric-label">Network Health</div>
            <div className="metric-change positive">
              Excellent
            </div>
          </div>

          <div className="metric-card info">
            <div className="metric-header">
              <span className="metric-badge">Storage</span>
            </div>
            <div className="metric-value">
              {formatBytes(statistics?.totalStorage?.used || 0)}
            </div>
            <div className="metric-label">Total Used</div>
            <div className="metric-change">
              {formatBytes(statistics?.totalStorage?.total || 0)} Total
            </div>
          </div>

          <div className="metric-card warning">
            <div className="metric-header">
              <span className="metric-badge">Performance</span>
            </div>
            <div className="metric-value">{performanceMetrics?.avgLatency || 0}ms</div>
            <div className="metric-label">Avg Latency</div>
            <div className="metric-change positive">
              Optimal
            </div>
          </div>

          <div className="metric-card accent">
            <div className="metric-header">
              <span className="metric-badge">Gossip</span>
            </div>
            <div className="metric-value">{statistics?.gossiping || 0}</div>
            <div className="metric-label">Gossiping Nodes</div>
            <div className="metric-change">
              Active Communication
            </div>
          </div>

          <div className="metric-card error">
            <div className="metric-header">
              <span className="metric-badge">Status</span>
            </div>
            <div className="metric-value">{statistics?.offline || 0}</div>
            <div className="metric-label">Offline Nodes</div>
            <div className="metric-change">
              {((statistics?.offline / statistics?.total) * 100 || 0).toFixed(1)}% of Network
            </div>
          </div>
        </div>

        {/* Network Health & Epoch Analytics */}
        <div className="analytics-grid">
          <div className="analytics-card">
            <NetworkHealth pNodes={allPNodes} statistics={statistics} />
          </div>
          <div className="analytics-card">
            <EpochAnalytics epochInfo={epochInfo} solanaData={solanaData} />
          </div>
        </div>

        {/* Region Heatmap */}
        <div className="heatmap-section">
          <RegionHeatmap nodes={allPNodes} />
        </div>

        {/* Advanced Controls */}
        <div className="controls-container">
          <div className="controls-header">
            <h2 className="controls-title">
              Filter & Search
            </h2>
            <div className="view-stats">
              Showing <strong>{pNodes.length}</strong> of <strong>{allPNodes.length}</strong> nodes
            </div>
          </div>

          <div className="controls-section">
            <SearchBar 
              value={searchQuery} 
              onChange={setSearchQuery}
              placeholder="Search by Node ID, Location, or IP..."
            />
            <FilterPanel
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              regionFilter={regionFilter}
              setRegionFilter={setRegionFilter}
              regions={regions}
            />
          </div>
        </div>

        {/* Sortable pNode Table */}
        <div className="nodes-table-container">
          <div className="table-header">
            <h2 className="table-title">
              Validator Nodes
            </h2>
            <div className="table-actions">
              <button className="table-action-btn">
                Export CSV
              </button>
              <button className="table-action-btn">
                Copy Data
              </button>
            </div>
          </div>
          <PNodeList 
            nodes={pNodes} 
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
          />
        </div>

        {/* Footer Stats */}
        <div className="dashboard-footer-stats">
          <div className="footer-stat">
            <div className="footer-stat-value">{regions.length}</div>
            <div className="footer-stat-label">Regions</div>
          </div>
          <div className="footer-stat">
            <div className="footer-stat-value">Solana</div>
            <div className="footer-stat-label">Blockchain</div>
          </div>
          <div className="footer-stat">
            <div className="footer-stat-value">30s</div>
            <div className="footer-stat-label">Update Interval</div>
          </div>
          <div className="footer-stat">
            <div className="footer-stat-value">RPC</div>
            <div className="footer-stat-label">Connected</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;