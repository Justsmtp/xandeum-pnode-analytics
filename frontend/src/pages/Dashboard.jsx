// frontend/src/pages/Dashboard.jsx
import React, { useMemo } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import PNodeList from '../components/pnodes/PNodeList';
import UptimeChart from '../components/pnodes/UptimeChart';
import SearchBar from '../components/common/SearchBar';
import FilterPanel from '../components/common/FilterPanel';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { usePNodes } from '../hooks/usePNodes';
import { usePNodeContext } from '../context/PNodeContext';
import { formatBytes } from '../utils/helpers';
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

  const { statistics, lastUpdated } = usePNodeContext();

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

  if (loading && allPNodes.length === 0) {
    return (
      <DashboardLayout>
        <LoadingSpinner message="Fetching pNodes from network..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="dashboard-page">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">pNode Network Dashboard</h1>
            <p className="dashboard-subtitle">
              Monitoring {allPNodes.length} nodes across the Xandeum network
            </p>
          </div>
          <button className="refresh-button" onClick={refreshPNodes} disabled={loading}>
            {loading ? '⟳ Refreshing...' : '↻ Refresh Data'}
          </button>
        </div>

        {error && (
          <div className="error-banner">
            <span>⚠️</span> Error loading data: {error}
          </div>
        )}

        {/* Statistics Cards */}
        {statistics && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <div className="stat-value">{statistics.total}</div>
                <div className="stat-label">Total Nodes</div>
              </div>
            </div>

            <div className="stat-card stat-active">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <div className="stat-value">{statistics.active}</div>
                <div className="stat-label">Active</div>
              </div>
            </div>

            <div className="stat-card stat-gossiping">
              <div className="stat-icon">💬</div>
              <div className="stat-content">
                <div className="stat-value">{statistics.gossiping}</div>
                <div className="stat-label">Gossiping</div>
              </div>
            </div>

            <div className="stat-card stat-offline">
              <div className="stat-icon">⚫</div>
              <div className="stat-content">
                <div className="stat-value">{statistics.offline}</div>
                <div className="stat-label">Offline</div>
              </div>
            </div>

            <div className="stat-card stat-storage">
              <div className="stat-icon">💾</div>
              <div className="stat-content">
                <div className="stat-value">{formatBytes(statistics.totalStorage.used)}</div>
                <div className="stat-label">Storage Used</div>
              </div>
            </div>
          </div>
        )}

        {/* Uptime Chart */}
        {allPNodes.length > 0 && (
          <div className="chart-section">
            <UptimeChart nodes={allPNodes} />
          </div>
        )}

        {/* Filters & Search */}
        <div className="controls-section">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <FilterPanel
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            regionFilter={regionFilter}
            setRegionFilter={setRegionFilter}
            regions={regions}
          />
        </div>

        {/* Results Summary */}
        <div className="results-summary">
          <p>
            Showing <strong>{pNodes.length}</strong> of <strong>{allPNodes.length}</strong> nodes
          </p>
          {lastUpdated && (
            <p className="last-updated">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* pNode List */}
        <PNodeList nodes={pNodes} />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

