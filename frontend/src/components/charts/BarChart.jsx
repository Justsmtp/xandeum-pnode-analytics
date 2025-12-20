// frontend/src/components/charts/BarChart.jsx
import React, { useMemo, useState } from 'react';
import './BarChart.css';

const BarChart = ({ data, title, subtitle, height = 320 }) => {
  const [hoveredBar, setHoveredBar] = useState(null);

  const maxValue = useMemo(() => {
    return Math.max(...data.map(d => d.value), 1);
  }, [data]);

  const yAxisTicks = useMemo(() => {
    const ticks = [];
    const step = maxValue / 4;
    for (let i = 0; i <= 4; i++) {
      ticks.push(Math.round(step * i));
    }
    return ticks.reverse();
  }, [maxValue]);

  return (
    <div className="bar-chart-container">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">{title}</h3>
          {subtitle && <p className="chart-subtitle">{subtitle}</p>}
        </div>
      </div>
      
      <div className="bar-chart-wrapper" style={{ height: `${height}px` }}>
        <div className="bar-chart-y-axis">
          {yAxisTicks.map((tick, index) => (
            <div key={index} className="y-axis-row">
              <span className="y-axis-label">{tick}</span>
              <div className="y-axis-grid-line"></div>
            </div>
          ))}
        </div>
        
        <div className="bar-chart-content">
          {data.map((item, index) => {
            const barHeight = (item.value / maxValue) * 100;
            const isHovered = hoveredBar === index;
            
            return (
              <div 
                key={index} 
                className="bar-column"
                onMouseEnter={() => setHoveredBar(index)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                <div className="bar-wrapper">
                  <div 
                    className={`bar ${isHovered ? 'hovered' : ''}`}
                    style={{ height: `${barHeight}%` }}
                  >
                    {isHovered && (
                      <div className="bar-tooltip">
                        <div className="tooltip-label">{item.label}</div>
                        <div className="tooltip-value">{item.value.toLocaleString()}</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bar-x-label">{item.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BarChart;