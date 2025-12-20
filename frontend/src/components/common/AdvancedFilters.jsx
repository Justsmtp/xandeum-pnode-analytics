// frontend/src/components/common/AdvancedFilters.jsx
import React from 'react';
import './AdvancedFilters.css';

const AdvancedFilters = ({ 
  timeRange, 
  setTimeRange, 
  statusFilter, 
  setStatusFilter,
  regionFilter,
  setRegionFilter,
  regions = [],
  onClose 
}) => {
  const timeRanges = ['24h', '7d', '30d', 'Custom'];
  const statuses = ['all', 'active', 'gossiping', 'offline'];

  return (
    <div className="advanced-filters">
      <div className="filters-header">
        <h3 className="filters-title">Advanced Filters</h3>
        <button className="filters-close" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z"/>
          </svg>
        </button>
      </div>

      <div className="filters-grid">
        <div className="filter-group">
          <label className="filter-label">Time Range</label>
          <div className="filter-options">
            {timeRanges.map(range => (
              <button
                key={range}
                className={`filter-option ${timeRange === range ? 'active' : ''}`}
                onClick={() => setTimeRange(range)}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">Node Status</label>
          <div className="filter-options">
            {statuses.map(status => (
              <button
                key={status}
                className={`filter-option ${statusFilter === status ? 'active' : ''}`}
                onClick={() => setStatusFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">Region</label>
          <select 
            className="filter-select"
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
          >
            <option value="all">All Regions</option>
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Data Type</label>
          <select className="filter-select">
            <option value="all">All Data</option>
            <option value="storage">Storage</option>
            <option value="transactions">Transactions</option>
            <option value="nodes">Nodes</option>
          </select>
        </div>
      </div>

      <div className="filters-footer">
        <button 
          className="filters-reset"
          onClick={() => {
            setTimeRange('24h');
            setStatusFilter('all');
            setRegionFilter('all');
          }}
        >
          Reset Filters
        </button>
        <button className="filters-apply" onClick={onClose}>
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default AdvancedFilters;