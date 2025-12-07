// frontend/src/components/common/FilterPanel.jsx
import React from 'react';
import './FilterPanel.css';

const FilterPanel = ({ 
  statusFilter, 
  setStatusFilter, 
  regionFilter, 
  setRegionFilter,
  regions = [] 
}) => {
  const statuses = ['all', 'active', 'gossiping', 'offline'];

  return (
    <div className="filter-panel">
      <div className="filter-group">
        <label className="filter-label">Status</label>
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">Region</label>
        <select
          className="filter-select"
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
        >
          <option value="all">All Regions</option>
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterPanel;

