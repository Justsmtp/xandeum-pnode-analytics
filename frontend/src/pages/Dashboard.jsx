/* eslint-disable no-unused-vars */
// frontend/src/pages/Dashboard.jsx
import React, { useState, useMemo, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import PNodeList from '../components/pnodes/PNodeList';
import SearchBar from '../components/common/SearchBar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import BarChart from '../components/charts/BarChart';
import PieChart from '../components/charts/PieChart';
import AdvancedFilters from '../components/common/AdvancedFilters';
import NetworkToggle from '../components/common/NetworkToggle';
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

  const { statistics, lastUpdated, connectionStatus } = usePNodeContext();
  const [timeRange, setTimeRange] = useState('24h');
  const [network, setNetwork] = useState('mainnet');
  const [showFilters, setShowFilters] = useState(false);

  // Check if using mock data
  const isUsingMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';

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

  // Calculate real-time metrics
  const metrics = useMemo(() => {
    if (!allPNodes.length) return null;

    const active = allPNodes.filter(n => n.gossipStatus === 'active').length;
    const total = allPNodes.length;
    const avgLatency = allPNodes.reduce((sum, n) => sum + (n.metadata?.latency || 0), 0) / total;
    
    return {
      totalNodes: total,
      activeNodes: active,
      healthScore: ((active / total) * 100).toFixed(1),
      avgLatency: avgLatency.toFixed(2),
      storageUsed: statistics?.totalStorage?.used || 0,
      storageTotal: statistics?.totalStorage?.total || 0,
      uptime: 99.9,
    };
  }, [allPNodes, statistics]);

  // Bar Chart Data - Node Activity by Region
  const nodeActivityData = useMemo(() => {
    const regions = {};
    allPNodes.forEach(node => {
      const region = node.location?.region || 'Unknown';
      regions[region] = (regions[region] || 0) + 1;
    });

    return Object.entries(regions)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [allPNodes]);

  // Pie Chart Data - Storage Distribution
  const storageDistribution = useMemo(() => {
    const distribution = {
      'Active Nodes': 0,
      'Gossiping Nodes': 0,
      'Offline Nodes': 0,
    };

    allPNodes.forEach(node => {
      const storage = node.storage?.used || 0;
      if (node.gossipStatus === 'active') distribution['Active Nodes'] += storage;
      else if (node.gossipStatus === 'gossiping') distribution['Gossiping Nodes'] += storage;
      else distribution['Offline Nodes'] += storage;
    });

    return Object.entries(distribution)
      .filter(([_, value]) => value > 0)
      .map(([label, value]) => ({ label, value }));
  }, [allPNodes]);

  if (loading && allPNodes.length === 0) {
    return (
      <DashboardLayout>
        <div className="dashboard-loading">
          <LoadingSpinner message="Connecting to Xandeum Network..." />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="dashboard-page">
        
        {/* Top Navigation Bar */}
        <div className="dashboard-nav">
          <div className="nav-left">
            <div className="xandeum-logo">
              <div className="logo-icon">X</div>
              <span className="logo-text">Xandeum Analytics</span>
            </div>
          </div>

          <div className="nav-center">
            <SearchBar 
              value={searchQuery} 
              onChange={setSearchQuery}
              placeholder="Search by Node ID, Wallet Address, or Transaction Hash..."
            />
          </div>

          <div className="nav-right">
            <NetworkToggle network={network} setNetwork={setNetwork} />
            <button 
              className="filter-toggle-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h14M3 10h10M3 16h6"/>
              </svg>
              Filters
            </button>
          </div>
        </div>

        {/* Advanced Filters Dropdown */}
        {showFilters && (
          <AdvancedFilters
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            regionFilter={regionFilter}
            setRegionFilter={setRegionFilter}
            regions={regions}
            onClose={() => setShowFilters(false)}
          />
        )}

        {/* API Status Notice - Only show if using mock data */}
        {isUsingMockData && (
          <div className="api-status-notice">
            <div className="notice-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z"/>
              </svg>
            </div>
            <div className="notice-content">
              <strong>Development Mode</strong>
              <p>Using realistic mock data. Xandeum pNode API is in development. Dashboard will automatically connect to real API when released.</p>
            </div>
            <a 
              href="https://xandeum.network/docs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="notice-link"
            >
              Check API Status
            </a>
          </div>
        )}

        {/* Connection Status Bar */}
        <div className={`connection-status ${connectionStatus || 'connected'}`}>
          <div className="status-indicator">
            <span className="status-dot"></span>
            <span className="status-text">
              {connectionStatus === 'connected' ? 'Connected' : 
               connectionStatus === 'connecting' ? 'Connecting...' : 
               'Disconnected'}
            </span>
          </div>
          <div className="status-info">
            <span>Network: {network === 'mainnet' ? 'Mainnet' : 'Testnet'}</span>
            <span className="divider">|</span>
            <span>Last Update: {lastUpdated ? lastUpdated.toLocaleTimeString() : '--:--:--'}</span>
            {isUsingMockData && (
              <>
                <span className="divider">|</span>
                <span className="mock-indicator">Mock Data</span>
              </>
            )}
          </div>
          <button className="refresh-btn" onClick={refreshPNodes} disabled={loading}>
            <svg className={loading ? 'spinning' : ''} width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 3V0L4 4l4 4V5c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3H3c0 2.76 2.24 5 5 5s5-2.24 5-5-2.24-5-5-5z"/>
            </svg>
            Refresh
          </button>
        </div>

        {error && (
          <div className="error-alert">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z"/>
            </svg>
            <div className="error-content">
              <strong>Connection Error</strong>
              <p>{error}</p>
            </div>
            <button onClick={refreshPNodes} className="error-retry-btn">Retry</button>
          </div>
        )}

        {/* Summary Metrics Cards */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-top">
              <span className="metric-label">Total Nodes</span>
              <span className="metric-badge success">Live</span>
            </div>
            <div className="metric-value">{metrics?.totalNodes || 0}</div>
            <div className="metric-footer">
              <span className="metric-trend positive">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M6 2l4 4H7v4H5V6H2l4-4z"/>
                </svg>
                {metrics?.activeNodes || 0} Active
              </span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-top">
              <span className="metric-label">Network Health</span>
              <span className="metric-badge info">Score</span>
            </div>
            <div className="metric-value">{metrics?.healthScore || 0}%</div>
            <div className="metric-footer">
              <span className="metric-trend positive">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M6 2l4 4H7v4H5V6H2l4-4z"/>
                </svg>
                Excellent
              </span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-top">
              <span className="metric-label">Storage Used</span>
              <span className="metric-badge warning">Capacity</span>
            </div>
            <div className="metric-value">{formatBytes(metrics?.storageUsed || 0)}</div>
            <div className="metric-footer">
              <span className="metric-trend neutral">
                {formatBytes(metrics?.storageTotal || 0)} Total
              </span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-top">
              <span className="metric-label">Avg Latency</span>
              <span className="metric-badge success">Performance</span>
            </div>
            <div className="metric-value">{metrics?.avgLatency || 0}ms</div>
            <div className="metric-footer">
              <span className="metric-trend positive">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M6 2l4 4H7v4H5V6H2l4-4z"/>
                </svg>
                Optimal
              </span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-grid">
          <div className="chart-card">
            <BarChart 
              data={nodeActivityData}
              title="Node Distribution by Region"
              subtitle="Active nodes across global locations"
              height={320}
            />
          </div>

          <div className="chart-card">
            <PieChart 
              data={storageDistribution}
              title="Storage Distribution"
              subtitle="Storage allocation by node status"
            />
          </div>
        </div>

        {/* Nodes Table */}
        <div className="table-section">
          <div className="table-header">
            <div className="table-header-left">
              <h2 className="table-title">Validator Nodes</h2>
              <span className="table-count">
                Showing {pNodes.length} of {allPNodes.length} nodes
              </span>
            </div>
            <div className="table-header-right">
              <button className="export-btn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 12L3 7h3V1h4v6h3l-5 5zm5 2H3v2h10v-2z"/>
                </svg>
                Export CSV
              </button>
              <button className="export-btn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M10 0H2C.9 0 0 .9 0 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6l-6-6zM2 2h7v5h5v7H2V2z"/>
                </svg>
                Export JSON
              </button>
            </div>
          </div>

          <PNodeList nodes={pNodes} />
        </div>

        {/* Network Stats Footer */}
        <div className="network-stats">
          <div className="stat-item">
            <span className="stat-label">Connected Regions</span>
            <span className="stat-value">{nodeActivityData.length}</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-label">Blockchain</span>
            <span className="stat-value">Solana</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-label">Update Interval</span>
            <span className="stat-value">30s</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-label">Uptime</span>
            <span className="stat-value">{metrics?.uptime || 99.9}%</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
