// frontend/src/components/pnodes/UptimeChart.jsx
import React from 'react';
import './UptimeChart.css';

const UptimeChart = ({ nodes }) => {
  // Group nodes by uptime ranges
  const uptimeRanges = {
    '< 1 day': 0,
    '1-7 days': 0,
    '7-30 days': 0,
    '> 30 days': 0,
  };

  nodes.forEach((node) => {
    const days = node.uptime / (60 * 60 * 24);
    if (days < 1) uptimeRanges['< 1 day']++;
    else if (days < 7) uptimeRanges['1-7 days']++;
    else if (days < 30) uptimeRanges['7-30 days']++;
    else uptimeRanges['> 30 days']++;
  });

  const maxValue = Math.max(...Object.values(uptimeRanges));

  return (
    <div className="uptime-chart">
      <h3 className="chart-title">Node Uptime Distribution</h3>
      <div className="chart-bars">
        {Object.entries(uptimeRanges).map(([range, count]) => {
          const percentage = maxValue > 0 ? (count / maxValue) * 100 : 0;
          
          return (
            <div key={range} className="chart-bar-container">
              <div className="chart-bar-label">{range}</div>
              <div className="chart-bar-wrapper">
                <div
                  className="chart-bar-fill"
                  style={{ width: `${percentage}%` }}
                >
                  <span className="chart-bar-value">{count}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UptimeChart;