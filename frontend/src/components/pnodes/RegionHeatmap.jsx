// frontend/src/components/pnodes/RegionHeatmap.jsx
import React, { useMemo } from 'react';
import './RegionHeatmap.css';

const RegionHeatmap = ({ nodes }) => {
  const regionData = useMemo(() => {
    const regions = {};
    
    nodes.forEach(node => {
      const region = node.location?.region || 'Unknown';
      if (!regions[region]) {
        regions[region] = {
          count: 0,
          active: 0,
          offline: 0,
          totalStorage: 0,
        };
      }
      
      regions[region].count++;
      if (node.gossipStatus === 'active') regions[region].active++;
      if (node.gossipStatus === 'offline') regions[region].offline++;
      regions[region].totalStorage += node.storage?.used || 0;
    });

    // Convert to array and sort by count
    return Object.entries(regions)
      .map(([name, data]) => ({
        name,
        ...data,
        healthScore: ((data.active / data.count) * 100).toFixed(1),
      }))
      .sort((a, b) => b.count - a.count);
  }, [nodes]);

  const maxCount = Math.max(...regionData.map(r => r.count), 1);

  const getHeatColor = (count) => {
    const intensity = (count / maxCount);
    if (intensity > 0.7) return 'heat-high';
    if (intensity > 0.4) return 'heat-medium';
    return 'heat-low';
  };

  const getRegionIcon = (regionName) => {
    const icons = {
      'North America': '🌎',
      'South America': '🌎',
      'Europe': '🌍',
      'Africa': '🌍',
      'Asia': '🌏',
      'Oceania': '🌏',
      'West Africa': '🌍',
    };
    return icons[regionName] || '🌐';
  };

  return (
    <div className="region-heatmap">
      <div className="heatmap-header">
        <h2 className="heatmap-title">
          <span className="heatmap-icon"></span>
          Global Node Distribution
        </h2>
        <div className="heatmap-legend">
          <span className="legend-item">
            <span className="legend-color heat-low"></span>
            Low
          </span>
          <span className="legend-item">
            <span className="legend-color heat-medium"></span>
            Medium
          </span>
          <span className="legend-item">
            <span className="legend-color heat-high"></span>
            High
          </span>
        </div>
      </div>

      <div className="heatmap-grid">
        {regionData.map((region) => (
          <div key={region.name} className={`region-card ${getHeatColor(region.count)}`}>
            <div className="region-header">
              <span className="region-icon">{getRegionIcon(region.name)}</span>
              <span className="region-name">{region.name}</span>
            </div>
            
            <div className="region-stats">
              <div className="region-stat-item">
                <div className="stat-value">{region.count}</div>
                <div className="stat-label">Total Nodes</div>
              </div>
              
              <div className="region-stat-item">
                <div className="stat-value success">{region.active}</div>
                <div className="stat-label">Active</div>
              </div>
              
              <div className="region-stat-item">
                <div className="stat-value error">{region.offline}</div>
                <div className="stat-label">Offline</div>
              </div>
            </div>

            <div className="region-health">
              <div className="health-bar-container">
                <div 
                  className="health-bar-fill" 
                  style={{ width: `${region.healthScore}%` }}
                ></div>
              </div>
              <span className="health-score">{region.healthScore}% Health</span>
            </div>
          </div>
        ))}
      </div>

      {regionData.length === 0 && (
        <div className="heatmap-empty">
          <span className="empty-icon">🌐</span>
          <p>No regional data available</p>
        </div>
      )}
    </div>
  );
};

export default RegionHeatmap;